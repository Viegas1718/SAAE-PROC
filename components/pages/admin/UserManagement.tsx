import React, { useState } from 'react';
import type { User, Department } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Tag from '../../ui/Tag';
import EditUserModal from './EditUserModal';
import { PencilIcon } from '../../icons/Icons';

interface UserManagementProps {
    allUsers: User[];
    allDepartments: Department[];
    onUpdateUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ allUsers, allDepartments, onUpdateUser }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOpenEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    const handleSaveUser = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        handleCloseEditModal();
    };

    return (
        <>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gerenciar Usuários</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Total de {allUsers.length} usuários no sistema.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo</th>
                                <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lotação Principal</th>
                                <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                            {allUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">
                                        <Tag status={user.userType} />
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-300">
                                        {allDepartments.find(d => d.id === user.departmentId)?.name ?? 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <Button size="sm" variant="secondary" onClick={() => handleOpenEditModal(user)}>
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {selectedUser && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    user={selectedUser}
                    allDepartments={allDepartments}
                    onSave={handleSaveUser}
                />
            )}
        </>
    );
};

export default UserManagement;