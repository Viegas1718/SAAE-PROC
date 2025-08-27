import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import type { ProcessDocument } from '../../types';
import { DocumentType } from '../../types';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  processDocuments: ProcessDocument[];
  onSend: (email: string, message: string, documentIds: number[]) => void;
}

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ isOpen, onClose, processDocuments, onSend }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<Set<number>>(new Set());

  const availableDocs = useMemo(() => {
    return processDocuments.filter(doc => doc.docType === DocumentType.File);
  }, [processDocuments]);

  const handleCheckboxChange = (docId: number) => {
    setSelectedDocIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docId)) {
        newSet.delete(docId);
      } else {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      onSend(email, message, Array.from(selectedDocIds));
      // Reset form
      setEmail('');
      setMessage('');
      setSelectedDocIds(new Set());
    }
  };
  
  const baseInputClasses = `block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

  const InputField: React.FC<{label: string, value: string, onChange: (val: string) => void, placeholder: string, type?: string}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
            required
        />
    </div>
  );

  const TextAreaField: React.FC<{label: string, value: string, onChange: (val: string) => void, placeholder: string}> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseInputClasses} min-h-[100px]`}
            required
        />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar Notificação / Arquivos">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
            label="E-mail do Destinatário"
            value={email}
            onChange={setEmail}
            placeholder="exemplo@email.com"
            type="email"
        />
        <TextAreaField 
            label="Mensagem"
            value={message}
            onChange={setMessage}
            placeholder="Escreva a mensagem que será enviada no corpo do e-mail."
        />

        {availableDocs.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anexar Documentos do Processo</label>
            <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
              {availableDocs.map(doc => (
                <label key={doc.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDocIds.has(doc.id)}
                    onChange={() => handleCheckboxChange(doc.id)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                  />
                  <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">{doc.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Enviar Notificação
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendNotificationModal;