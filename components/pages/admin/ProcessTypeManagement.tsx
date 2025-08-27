import React, { useState } from 'react';
import type { ProcessType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import EditProcessType from './EditProcessType';
import { PencilIcon, PlusIcon } from '../../icons/Icons';

interface ProcessTypeManagementProps {
    processTypes: ProcessType[];
    onSave: (processType: ProcessType) => void;
}

const ProcessTypeManagement: React.FC<ProcessTypeManagementProps> = ({ processTypes, onSave }) => {
    const [editingProcessType, setEditingProcessType] = useState<ProcessType | null>(null);

    if (editingProcessType) {
        return (
            <EditProcessType 
                processType={editingProcessType}
                onSave={onSave}
                onBack={() => setEditingProcessType(null)}
            />
        );
    }
    
    return (
        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <div className="p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tipos de Processo</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Gerencie os formulários, fluxos e anexos para cada tipo de processo.
                    </p>
                </div>
                 <Button onClick={() => alert('Funcionalidade para novo tipo de processo em desenvolvimento.')}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Novo Tipo de Processo
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome do Tipo</th>
                            <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo (Interno/Externo)</th>
                             <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                        {processTypes.map(pt => (
                            <tr key={pt.id}>
                                <td className="py-4 px-6 text-sm font-medium text-slate-800 dark:text-slate-100">{pt.name}</td>
                                <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-300 capitalize">{pt.type === 'internal' ? 'Interno' : 'Externo'}</td>
                                <td className="py-4 px-6">
                                     <Button size="sm" variant="secondary" onClick={() => setEditingProcessType(pt)}>
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Gerenciar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ProcessTypeManagement;