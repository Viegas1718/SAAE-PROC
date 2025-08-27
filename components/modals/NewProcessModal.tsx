import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import type { ProcessType, FormField } from '../../types';
import { FormFieldType } from '../../types';

interface NewProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { 
    typeId: number; 
    subject: string; 
    requester: string; 
    customFields: { [key: string]: any };
  }) => void;
  processTypes: ProcessType[];
}

const NewProcessModal: React.FC<NewProcessModalProps> = ({ isOpen, onClose, onCreate, processTypes }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('');
  const [subject, setSubject] = useState('');
  const [requester, setRequester] = useState('');
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: any }>({});
  
  const selectedType = useMemo(() => {
    return processTypes.find(pt => pt.id === selectedTypeId);
  }, [selectedTypeId, processTypes]);

  const resetForm = () => {
    setSelectedTypeId('');
    setSubject('');
    setRequester('');
    setCustomFieldValues({});
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && requester && selectedTypeId) {
      onCreate({ 
        typeId: selectedTypeId, 
        subject, 
        requester, 
        customFields: customFieldValues 
      });
      resetForm();
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };
  
  const renderField = (field: FormField) => {
    const baseInputClasses = `block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

    switch (field.type) {
        case FormFieldType.TextArea:
            return <textarea value={customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldChange(field.id, e.target.value)} required={field.required} className={baseInputClasses + ' min-h-[80px]'} />;
        case FormFieldType.Number:
             return <input type="number" value={customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldChange(field.id, e.target.value)} required={field.required} className={baseInputClasses} />;
        case FormFieldType.Date:
            return <input type="date" value={customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldChange(field.id, e.target.value)} required={field.required} className={baseInputClasses} />;
        case FormFieldType.Text:
        default:
            return <input type="text" value={customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldChange(field.id, e.target.value)} required={field.required} className={baseInputClasses} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar Novo Processo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Processo</label>
            <select value={selectedTypeId} onChange={e => setSelectedTypeId(Number(e.target.value))} required className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="" disabled>Selecione o tipo</option>
                {processTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
            </select>
        </div>

        {selectedTypeId && (
            <>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assunto do Processo</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Solicitação de Férias para Setembro" required className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Requerente</label>
                    <input type="text" value={requester} onChange={(e) => setRequester(e.target.value)} placeholder="Ex: João da Silva (Matrícula 123)" required className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                {selectedType?.formFields.map(field => (
                    <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderField(field)}
                    </div>
                ))}
                 {selectedType && selectedType.attachments.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Anexos</label>
                        <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
                        {selectedType.attachments.map(attach => (
                            <div key={attach.id}>
                                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{attach.name} {attach.required && <span className="text-red-500">*</span>}</label>
                                <input type="file" className="text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </>
        )}

        <div className="flex justify-end pt-4 space-x-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!selectedTypeId}>
            Criar Processo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProcessModal;