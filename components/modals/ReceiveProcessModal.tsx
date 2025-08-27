import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import type { Process, User } from '../../types';

interface ReceiveProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: Process;
  usersInDepartment: User[];
  onDistribute: (userNames: string[]) => void;
  onReturn: () => void;
}

const ReceiveProcessModal: React.FC<ReceiveProcessModalProps> = ({ isOpen, onClose, process, usersInDepartment, onDistribute, onReturn }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const handleCheckboxChange = (userId: number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleDistribute = () => {
    const selectedUsers = usersInDepartment.filter(user => selectedUserIds.has(user.id));
    if (selectedUsers.length > 0) {
      onDistribute(selectedUsers.map(u => u.name));
      setSelectedUserIds(new Set());
    }
  };

  const handleReturn = () => {
    onReturn();
    setSelectedUserIds(new Set());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Receber Processo: ${process.id}`}>
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-2">Distribuir no Departamento</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Selecione um ou mais usuários para designar a responsabilidade deste processo.</p>
          <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
            {usersInDepartment.length > 0 ? (
              usersInDepartment.map(user => (
                <label key={user.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.has(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhum outro usuário neste departamento.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={handleReturn} disabled={process.movements.length < 2}>
            Devolver ao Remetente
          </Button>
          <Button type="button" variant="primary" onClick={handleDistribute} disabled={selectedUserIds.size === 0}>
            Distribuir
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiveProcessModal;