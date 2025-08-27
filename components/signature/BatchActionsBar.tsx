import React from 'react';
import Button from '../ui/Button';
import { PencilSquareIcon, ArrowDownOnSquareIcon, TrashIcon, XMarkIcon } from '../icons/Icons';

interface BatchActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onSign: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({ selectedCount, onClear, onSign, onDownload, onDelete }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-slate-800 p-3 border-t border-slate-200 dark:border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={onClear} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <XMarkIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                 <p className="ml-3 text-sm font-medium text-slate-800 dark:text-slate-100">{selectedCount} item(s) selecionado(s)</p>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={onSign}>
                    <PencilSquareIcon className="w-4 h-4 mr-2" />
                    Assinar
                </Button>
                <Button variant="secondary" size="sm" onClick={onDownload}>
                    <ArrowDownOnSquareIcon className="w-4 h-4 mr-2" />
                    Baixar
                </Button>
                <Button variant="danger" size="sm" onClick={onDelete}>
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Excluir
                </Button>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
