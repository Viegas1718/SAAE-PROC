import React, { useState, useMemo } from 'react';
import { DocumentRow } from './DocumentRow';
import type { SignatureDocument, User, Signatory } from '../../types';
import { SignatoryStatus } from '../../types';

interface InboxViewProps {
    docs: SignatureDocument[];
    users: User[];
    currentUser: User;
    onToggleFavorite: (docId: number) => void;
    onDelete: (docIds: number[]) => void;
    onSign: (docIds: number[]) => void;
    onRequestSignature: (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

type InboxTab = 'pending' | 'signed' | 'shared';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        {children}
    </button>
);

export const InboxView: React.FC<InboxViewProps> = (props) => {
    const { docs, currentUser } = props;
    const [activeTab, setActiveTab] = useState<InboxTab>('pending');

    const filteredDocs = useMemo(() => {
        const userIdStr = String(currentUser.id);
        switch(activeTab) {
            case 'pending':
                return docs.filter(d => d.signatories.some(s => s.id === userIdStr && s.status === SignatoryStatus.Pending));
            case 'signed':
                return docs.filter(d => d.signatories.some(s => s.id === userIdStr && s.status === SignatoryStatus.Signed));
            case 'shared':
                return docs.filter(d => d.uploaderId !== currentUser.id && d.signatories.some(s => s.id === userIdStr));
            default:
                return [];
        }
    }, [docs, currentUser, activeTab]);

    return (
        <div>
            <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                    <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                        Faltando Assinar
                    </TabButton>
                    <TabButton active={activeTab === 'signed'} onClick={() => setActiveTab('signed')}>
                        Assinados
                    </TabButton>
                     <TabButton active={activeTab === 'shared'} onClick={() => setActiveTab('shared')}>
                        Compartilhados
                    </TabButton>
                </div>
            </div>

            <div className="p-2 md:p-4">
                 {filteredDocs.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {filteredDocs.map(doc => (
                           <DocumentRow
                                key={doc.id}
                                doc={doc}
                                isSelected={false} // No selection in inbox
                                onSelect={() => {}} // No selection in inbox
                                {...props}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 dark:text-slate-400">Não há documentos nesta aba.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
