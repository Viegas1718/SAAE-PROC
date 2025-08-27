import React, { useState, useMemo } from 'react';
import { DocumentRow } from './DocumentRow';
import { BatchActionsBar } from './BatchActionsBar';
import NewSignatureDocModal from '../modals/NewSignatureDocModal';
import type { SignatureDocument, User, Signatory } from '../../types';
import Button from '../ui/Button';
import { DocumentArrowUpIcon } from '../icons/Icons';

interface SentViewProps {
    docs: SignatureDocument[];
    users: User[];
    currentUser: User;
    onToggleFavorite: (docId: number) => void;
    onUpload: (file: { name: string; type: 'PDF' | 'DOCX'; sizeMB: number }) => void;
    onDelete: (docIds: number[]) => void;
    onSign: (docIds: number[]) => void;
    onRequestSignature: (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

export const SentView: React.FC<SentViewProps> = (props) => {
    const { docs, currentUser, onDelete, onSign } = props;
    const [selectedDocIds, setSelectedDocIds] = useState<Set<number>>(new Set());
    const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

    const sentDocs = useMemo(() => {
        return docs.filter(d => d.uploaderId === currentUser.id);
    }, [docs, currentUser]);
    
    const handleSelectDoc = (docId: number) => {
        setSelectedDocIds(prev => {
            const newSet = new Set(prev);
            newSet.has(docId) ? newSet.delete(docId) : newSet.add(docId);
            return newSet;
        });
    };
    
    const handleBatchDelete = () => {
        onDelete(Array.from(selectedDocIds));
        setSelectedDocIds(new Set());
    };
    
    const handleBatchSign = () => {
        onSign(Array.from(selectedDocIds));
        setSelectedDocIds(new Set());
    };

    return (
        <>
        <div className="p-4">
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsNewDocModalOpen(true)}>
                    <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                    Incluir Documento
                </Button>
            </div>
            {sentDocs.length > 0 ? (
                <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {sentDocs.map(doc => (
                        <DocumentRow
                            key={doc.id}
                            doc={doc}
                            isSelected={selectedDocIds.has(doc.id)}
                            onSelect={handleSelectDoc}
                            {...props}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20">
                    <p className="text-slate-500 dark:text-slate-400">Você ainda não enviou nenhum documento.</p>
                </div>
            )}
        </div>
        
        <BatchActionsBar
            selectedCount={selectedDocIds.size}
            onClear={() => setSelectedDocIds(new Set())}
            onSign={handleBatchSign}
            onDownload={() => alert('Download em lote em desenvolvimento.')}
            onDelete={handleBatchDelete}
        />

        <NewSignatureDocModal
            isOpen={isNewDocModalOpen}
            onClose={() => setIsNewDocModalOpen(false)}
            onUpload={props.onUpload}
        />
        </>
    );
};
