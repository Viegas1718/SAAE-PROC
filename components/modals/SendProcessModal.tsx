import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import type { Process, Department, User } from '../../types';

interface SendProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: Process;
  allDepartments: Department[];
  allUsers: User[];
  onSend: (processId: string, targetDepartmentId: number, allowedReceivers?: string[]) => void;
}

const SendProcessModal: React.FC<SendProcessModalProps> = ({ isOpen, onClose, process, allDepartments, allUsers, onSend }) => {
  const [targetDepartmentId, setTargetDepartmentId] = useState<number | ''>('');
  const [restrictReceivers, setRestrictReceivers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const usersInTargetDepartment = useMemo(() => {
    if (!targetDepartmentId) return [];
    return allUsers.filter(user => user.departmentId === targetDepartmentId);
  }, [targetDepartmentId, allUsers]);

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

  const resetState = () => {
    setTargetDepartmentId('');
    setRestrictReceivers(false);
    setSelectedUserIds(new Set());
  };

  const handleSend = () => {
    if (typeof targetDepartmentId === 'number') {
        const allowedReceivers = restrictReceivers
            ? allUsers.filter(u => selectedUserIds.has(u.id)).map(u => u.name)
            : undefined;
            
      onSend(process.id, targetDepartmentId, allowedReceivers);
      resetState();
      onClose();
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const availableDepartments = allDepartments.filter(d => d.id !== process.department.id);
  const baseSelectClasses = `block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm text-slate-900 dark:text-slate-100
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Enviar Processo: ${process.id}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="department-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selecione o departamento de destino</label>
          <select
            id="department-select"
            value={targetDepartmentId}
            onChange={(e) => setTargetDepartmentId(Number(e.target.value))}
            className={baseSelectClasses}
          >
            <option value="" disabled>Selecione um departamento</option>
            {availableDepartments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="restrict-receivers"
              aria-describedby="restrict-receivers-description"
              name="restrict-receivers"
              type="checkbox"
              checked={restrictReceivers}
              onChange={(e) => setRestrictReceivers(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-600 bg-white dark:bg-slate-800"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="restrict-receivers" className="font-medium text-slate-900 dark:text-slate-100">
              Definir quem poderá receber (opcional)
            </label>
            <p id="restrict-receivers-description" className="text-slate-500 dark:text-slate-400">
              Apenas os usuários selecionados poderão receber e distribuir este processo.
            </p>
          </div>
        </div>
        
        {restrictReceivers && targetDepartmentId && (
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selecione os usuários</label>
                 <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
                    {usersInTargetDepartment.length > 0 ? usersInTargetDepartment.map(user => (
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
                    )) : <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Nenhum usuário neste departamento.</p>}
                 </div>
            </div>
        )}

        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={handleSend} 
            disabled={!targetDepartmentId || (restrictReceivers && selectedUserIds.size === 0)}
          >
            Enviar Processo
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendProcessModal;