import React, { useState, useMemo } from 'react';
import type { User, Department } from '../../../types';
import { UserType } from '../../../types';
import Modal from '../../modals/Modal';
import Button from '../../ui/Button';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    allDepartments: Department[];
    onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, allDepartments, onSave }) => {
    const [userType, setUserType] = useState(user.userType);
    const [allowedDepartmentIds, setAllowedDepartmentIds] = useState(new Set(user.allowedDepartmentIds));
    const [permissions, setPermissions] = useState(user.permissions);

    const handleDeptCheckboxChange = (deptId: number) => {
        setAllowedDepartmentIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(deptId)) {
                if (user.departmentId !== deptId) newSet.delete(deptId); // Prevent removing primary dept
            } else {
                newSet.add(deptId);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        onSave({
            ...user,
            userType,
            allowedDepartmentIds: Array.from(allowedDepartmentIds),
            permissions,
        });
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar Usuário: ${user.name}`}>
            <div className="space-y-6">
                {/* Tipo de Usuário */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Usuário</label>
                    <select
                        value={userType}
                        onChange={e => setUserType(e.target.value as UserType)}
                        className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm text-slate-900 dark:text-slate-100"
                    >
                        {Object.values(UserType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </section>

                {/* Lotações */}
                <section>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lotações Permitidas</label>
                    <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md">
                        {allDepartments.map(dept => (
                            <label key={dept.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowedDepartmentIds.has(dept.id)}
                                    onChange={() => handleDeptCheckboxChange(dept.id)}
                                    disabled={dept.id === user.departmentId}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800"
                                />
                                <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">{dept.name}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Permissões de Assinatura */}
                 <section>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Módulo de Assinatura</label>
                    <div className="space-y-3">
                         <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="sig-access" type="checkbox"
                                    checked={permissions.canAccessSignatureModule}
                                    onChange={e => setPermissions(p => ({ ...p, canAccessSignatureModule: e.target.checked }))}
                                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 bg-white dark:bg-slate-800"
                                />
                            </div>
                            <div className="ml-3 text-sm"><label htmlFor="sig-access" className="font-medium text-slate-900 dark:text-slate-100">Permitir acesso ao módulo</label></div>
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Cargos para Assinatura (separados por vírgula)</label>
                           <input 
                                type="text"
                                value={permissions.signatureRoles.join(', ')}
                                onChange={e => setPermissions(p => ({...p, signatureRoles: e.target.value.split(',').map(s => s.trim())}))}
                                className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm"
                                placeholder="Ex: Diretor, Gerente"
                           />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="button" variant="primary" onClick={handleSave}>Salvar Alterações</Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditUserModal;