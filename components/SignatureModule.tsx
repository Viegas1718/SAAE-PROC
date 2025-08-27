import React, { useState } from 'react';
import type { SignatureDocument, User, Signatory } from '../types';
import Card from './ui/Card';
import { InboxView } from './signature/InboxView';
import { FavoritesView } from './signature/FavoritesView';
import { SentView } from './signature/SentView';
import { DocumentArrowUpIcon, StarIcon, InboxIcon } from './icons/Icons';

interface SignatureModuleProps {
    docs: SignatureDocument[];
    users: User[];
    currentUser: User;
    onToggleFavorite: (docId: number) => void;
    onUpload: (file: { name: string; type: 'PDF' | 'DOCX'; sizeMB: number }) => void;
    onDelete: (docIds: number[]) => void;
    onSign: (docIds: number[]) => void;
    onRequestSignature: (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

type SignatureView = 'inbox' | 'favorites' | 'sent';

const NavButton: React.FC<{
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


const SignatureModule: React.FC<SignatureModuleProps> = (props) => {
    const [activeView, setActiveView] = useState<SignatureView>('inbox');
    
    const renderView = () => {
        switch(activeView) {
            case 'inbox':
                return <InboxView {...props} />;
            case 'favorites':
                return <FavoritesView {...props} />;
            case 'sent':
                return <SentView {...props} />;
            default:
                return null;
        }
    };

    return (
        <Card className="dark:bg-slate-900 dark:border-slate-800 flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Assinatura Eletrônica</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie e assine seus documentos digitalmente.</p>
            </div>

            <div className="px-6 border-b border-slate-200 dark:border-slate-800">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <NavButton
                        icon={<InboxIcon className="w-5 h-5" />}
                        label="Caixa de Entrada"
                        isActive={activeView === 'inbox'}
                        onClick={() => setActiveView('inbox')}
                    />
                    <NavButton
                        icon={<StarIcon className="w-5 h-5" />}
                        label="Favoritos"
                        isActive={activeView === 'favorites'}
                        onClick={() => setActiveView('favorites')}
                    />
                     <NavButton
                        icon={<DocumentArrowUpIcon className="w-5 h-5" />}
                        label="Enviados"
                        isActive={activeView === 'sent'}
                        onClick={() => setActiveView('sent')}
                    />
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto">
                {renderView()}
            </div>
        </Card>
    );
};

export default SignatureModule;
