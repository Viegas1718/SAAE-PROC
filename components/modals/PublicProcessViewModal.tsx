import React from 'react';
import Modal from './Modal';
import type { Process } from '../../types';
import Tag from '../ui/Tag';
import { ClockIcon } from '../icons/Icons';

interface PublicProcessViewModalProps {
  result: Process | 'not_found' | null;
  onClose: () => void;
}

const PublicProcessViewModal: React.FC<PublicProcessViewModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const publicMovements = typeof result === 'object' 
    ? result.movements.filter(m => m.isPublic) 
    : [];

  return (
    <Modal 
      isOpen={!!result} 
      onClose={onClose} 
      title={typeof result === 'object' ? `Andamento do Processo: ${result.id}` : 'Consulta Pública'}
    >
      {typeof result === 'object' ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.subject}</h4>
            <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">Requerente: <span className="font-medium">{result.requester}</span></p>
                <Tag status={result.status} />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Histórico Público de Movimentações</h5>
            {publicMovements.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {publicMovements.map((mov, index) => (
                        <div key={mov.id} className="flex">
                            <div className="flex flex-col items-center mr-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-600">
                                   <ClockIcon className="w-4 h-4 text-white" />
                                </div>
                                {index < publicMovements.length - 1 && <div className="w-px h-full bg-slate-300 dark:bg-slate-700"></div>}
                            </div>
                            <div className="w-full pb-2">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{mov.action}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{mov.date} às {mov.time}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">De: <span className="font-medium">{mov.from}</span> Para: <span className="font-medium">{mov.to}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhuma movimentação pública disponível para este processo.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-600 dark:text-slate-300 py-8">
            Nenhum processo público encontrado para o CPF/CNPJ informado.
        </p>
      )}
    </Modal>
  );
};

export default PublicProcessViewModal;
