import React, { useState } from 'react';
import type { ProcessType, FormField } from '../../../types';
import { FormFieldType } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '../../icons/Icons';

interface EditProcessTypeProps {
    processType: ProcessType;
    onSave: (processType: ProcessType) => void;
    onBack: () => void;
}

const EditProcessType: React.FC<EditProcessTypeProps> = ({ processType: initialProcessType, onSave, onBack }) => {
    const [processType, setProcessType] = useState<ProcessType>(initialProcessType);

    const handleSave = () => {
        onSave(processType);
        onBack();
    };

    const addFormField = () => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            label: 'Novo Campo',
            type: FormFieldType.Text,
            required: false
        };
        setProcessType(pt => ({ ...pt, formFields: [...pt.formFields, newField] }));
    };

    const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
        setProcessType(pt => ({
            ...pt,
            formFields: pt.formFields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        }));
    };

    const removeFormField = (fieldId: string) => {
        setProcessType(pt => ({
            ...pt,
            formFields: pt.formFields.filter(f => f.id !== fieldId)
        }));
    };

    const baseInputClasses = `block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <Button onClick={onBack} variant="secondary" size="sm">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Voltar para a Lista
                </Button>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gerenciar: {processType.name}</h1>
                <Button onClick={handleSave} size="sm">
                    Salvar Alterações
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna de Configuração */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="dark:bg-slate-900 dark:border-slate-800">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Configurações Gerais</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Tipo de Processo</label>
                                <input type="text" value={processType.name} onChange={e => setProcessType(pt => ({...pt, name: e.target.value}))} className={baseInputClasses} />
                            </div>
                        </div>
                    </Card>
                     <Card className="dark:bg-slate-900 dark:border-slate-800">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Capa do Processo</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Funcionalidade em desenvolvimento.</p>
                        </div>
                    </Card>
                     <Card className="dark:bg-slate-900 dark:border-slate-800">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Anexos Obrigatórios</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Funcionalidade em desenvolvimento.</p>
                        </div>
                    </Card>
                </div>

                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="dark:bg-slate-900 dark:border-slate-800">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Fluxo de Tramitação (Drawflow)</h3>
                             <div className="h-64 bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center">
                                <p className="text-slate-500 dark:text-slate-400">Integração com Drawflow.js virá aqui.</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="dark:bg-slate-900 dark:border-slate-800">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Formulário Personalizado</h3>
                                <Button size="sm" variant="secondary" onClick={addFormField}>
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Adicionar Campo
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {processType.formFields.map(field => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                        <div className="col-span-5">
                                            <input type="text" value={field.label} onChange={e => updateFormField(field.id, { label: e.target.value })} placeholder="Nome do Campo" className={baseInputClasses + " p-1 text-sm"}/>
                                        </div>
                                        <div className="col-span-4">
                                            <select value={field.type} onChange={e => updateFormField(field.id, { type: e.target.value as FormFieldType })} className={baseInputClasses + " p-1 text-sm"}>
                                                {Object.values(FormFieldType).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center">
                                            <input type="checkbox" checked={field.required} onChange={e => updateFormField(field.id, { required: e.target.checked })} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 bg-white dark:bg-slate-800"/>
                                            <label className="text-xs ml-2 text-slate-600 dark:text-slate-300">Obrig.</label>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <button onClick={() => removeFormField(field.id)} className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                ))}
                                {processType.formFields.length === 0 && <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-4">Nenhum campo adicionado.</p>}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditProcessType;