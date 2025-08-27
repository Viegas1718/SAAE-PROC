import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';

interface RequestDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (email: string, documents: string[]) => void;
}

const RequestDocumentModal: React.FC<RequestDocumentModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [email, setEmail] = useState('');
  const [documents, setDocuments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docList = documents.split('\n').filter(doc => doc.trim() !== '');
    if (email && docList.length > 0) {
      onCreate(email, docList);
      // Reset form
      setEmail('');
      setDocuments('');
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
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Liste um documento por linha.</p>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitar Documento Externo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
            label="E-mail do Usuário Externo"
            value={email}
            onChange={setEmail}
            placeholder="exemplo@email.com"
            type="email"
        />
        <TextAreaField 
            label="Documentos a Solicitar"
            value={documents}
            onChange={setDocuments}
            placeholder="Ex: Cópia do RG&#x0a;Comprovante de Residência"
        />
        <div className="flex justify-end pt-4 space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Enviar Solicitação
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestDocumentModal;