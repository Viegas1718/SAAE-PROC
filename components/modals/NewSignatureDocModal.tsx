import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import { DocumentArrowUpIcon } from '../icons/Icons';

interface NewSignatureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: { name: string; type: 'PDF' | 'DOCX'; sizeMB: number }) => void;
}

const NewSignatureDocModal: React.FC<NewSignatureDocModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        const isWord = selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isPdf = selectedFile.type === 'application/pdf';
        const sizeMB = selectedFile.size / 1024 / 1024;

        if (isWord && sizeMB > 9) {
            setError('Arquivos Word não podem exceder 9MB.');
            setFile(null);
        } else if (isPdf && sizeMB > 50) {
            setError('Arquivos PDF não podem exceder 50MB.');
            setFile(null);
        } else if (isWord || isPdf) {
            setError('');
            setFile(selectedFile);
        } else {
            setError('Tipo de arquivo inválido. Apenas .docx e .pdf são permitidos.');
            setFile(null);
        }
    }
  };
  
  const handleSubmit = () => {
      if(file) {
          const type = file.type === 'application/pdf' ? 'PDF' : 'DOCX';
          onUpload({ name: file.name, type, sizeMB: file.size / 1024 / 1024 });
          handleClose();
      }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Incluir Novo Documento para Assinatura">
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Selecione o arquivo</label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-6 py-10">
            <div className="text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-300">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white dark:bg-slate-900 font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:ring-offset-slate-900 hover:text-blue-500"
                >
                  <span>Carregue um arquivo</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx" />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">PDF (até 50MB), DOCX (até 9MB)</p>
            </div>
          </div>
          {file && <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">Arquivo selecionado: <span className="font-medium">{file.name}</span></p>}
          {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button type="button" variant="primary" onClick={handleSubmit} disabled={!file || !!error}>
            Incluir Documento
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NewSignatureDocModal;
