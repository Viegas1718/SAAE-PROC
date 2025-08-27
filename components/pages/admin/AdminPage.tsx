import React, { useState } from 'react';
import type { User, Department, ProcessType } from '../../../types';
import UserManagement from './UserManagement';
import ProcessTypeManagement from './ProcessTypeManagement';
import { UserGroupIcon, DocumentDuplicateIcon } from '../../icons/Icons';

interface AdminPageProps {
    allUsers: User[];
    allDepartments: Department[];
    onUpdateUser: (user: User) => void;
    allProcessTypes: ProcessType[];
    onUpdateProcessType: (processType: ProcessType) => void;
}

const AdminTab: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-t-lg border-b-2 font-medium text-sm transition-colors ${
            isActive
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </button>
);

const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'users' | 'processTypes'>('users');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Painel de Administração</h1>
            </div>
            
            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <AdminTab
                        icon={<UserGroupIcon className="w-5 h-5" />}
                        label="Gerenciar Usuários"
                        isActive={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <AdminTab
                        icon={<DocumentDuplicateIcon className="w-5 h-5" />}
                        label="Tipos de Processo"
                        isActive={activeTab === 'processTypes'}
                        onClick={() => setActiveTab('processTypes')}
                    />
                </nav>
            </div>
            
            <div>
                {activeTab === 'users' && (
                    <UserManagement 
                        allUsers={props.allUsers}
                        allDepartments={props.allDepartments}
                        onUpdateUser={props.onUpdateUser}
                    />
                )}
                {activeTab === 'processTypes' && (
                   <ProcessTypeManagement 
                        processTypes={props.allProcessTypes}
                        onSave={props.onUpdateProcessType}
                   />
                )}
            </div>
        </div>
    );
};

export default AdminPage;