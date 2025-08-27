import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import type { User, SignatureDocument, Signatory } from '../../types';
import { SignatoryType } from '../../types';
// FIX: Replaced missing UsersIcon and EnvelopeOpenIcon with available icons.
import { UserGroupIcon, EnvelopeIcon } from '../icons/Icons';

interface RequestSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: SignatureDocument;
  users: User[];
  onRequest: (newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

const RequestSignatureModal: React.FC<RequestSignatureModalProps> = ({ isOpen, onClose, doc, users, onRequest }) => {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [externalEmail, setExternalEmail] = useState('');

  const availableUsers = useMemo(() => {
    const existingIds = new Set(doc.signatories.filter(s => s.type === SignatoryType.Internal).map(s => s.id));
    return users.filter(u => !existingIds.has(String(u.id)));
  }, [doc, users]);

  const handleCheckboxChange = (userId: number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
      return newSet;
    });
  };
  
  const handleRequest = () => {
    let newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[] = [];
    if(activeTab === 'internal') {
        newSignatories = users
            .filter(u => selectedUserIds.has(u.id))
            .map(u => ({ id: String(u.id), name: u.name, type: SignatoryType.Internal }));
    } else {
        if (externalEmail) {
            newSignatories = [{ id: externalEmail, name: `Usuário Externo (${externalEmail})`, type: SignatoryType.External }];
        }
    }
    
    if (newSignatories.length > 0) {
        onRequest(newSignatories);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedUserIds(new Set());
    setExternalEmail('');
    setActiveTab('internal');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Solicitar Assinatura: ${doc.name}`}>
        <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button onClick={() => setActiveTab('internal')} className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${activeTab === 'internal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    <UserGroupIcon className="w-5 h-5 mr-2" /> Usuário Interno
                </button>
                 <button onClick={() => setActiveTab('external')} className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${activeTab === 'external' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    <EnvelopeIcon className="w-5 h-5 mr-2" /> Email Externo
                </button>
            </nav>
        </div>
      
      {activeTab === 'internal' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Selecione os usuários</label>
          <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
            {availableUsers.map(user => (
              <label key={user.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                <input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => handleCheckboxChange(user.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500" />
                <div className="ml-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'external' && (
         <div>
            <label htmlFor="external-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail do Signatário Externo</label>
            <input type="email" id="external-email" value={externalEmail} onChange={e => setExternalEmail(e.target.value)} placeholder="email@externo.com"
            className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm" />
        </div>
      )}
      
      <div className="flex justify-end pt-6 space-x-2 border-t border-slate-200 dark:border-slate-700 mt-6">
        <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button type="button" variant="primary" onClick={handleRequest}>Adicionar Solicitante</Button>
      </div>
    </Modal>
  );
};

export default RequestSignatureModal;