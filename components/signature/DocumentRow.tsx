import React, { useState, useRef, useEffect } from 'react';
import type { SignatureDocument, User, Signatory } from '../../types';
import { SignatoryStatus } from '../../types';
import { DocumentTextIcon, StarIcon, EllipsisVerticalIcon, PencilSquareIcon, UserGroupIcon, TrashIcon } from '../icons/Icons';
import RequestSignatureModal from '../modals/RequestSignatureModal';

interface DocumentRowProps {
  doc: SignatureDocument;
  users: User[];
  currentUser: User;
  isSelected: boolean;
  onSelect: (docId: number) => void;
  onToggleFavorite: (docId: number) => void;
  onDelete: (docIds: number[]) => void;
  onSign: (docIds: number[]) => void;
  onRequestSignature: (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

const SignatoryStatusPill: React.FC<{ status: SignatoryStatus }> = ({ status }) => {
    const styles = {
        [SignatoryStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [SignatoryStatus.Signed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

export const DocumentRow: React.FC<DocumentRowProps> = (props) => {
    const { doc, currentUser, isSelected, onSelect } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isUploader = doc.uploaderId === currentUser.id;
    const userIsSignatory = doc.signatories.some(s => s.id === String(currentUser.id));
    const hasUserSigned = doc.signatories.some(s => s.id === String(currentUser.id) && s.status === SignatoryStatus.Signed);
    const isPendingForCurrentUser = doc.signatories.some(s => s.id === String(currentUser.id) && s.status === SignatoryStatus.Pending);

    // Determines if the user can perform the sign action right now.
    const canSign = isPendingForCurrentUser || (isUploader && !hasUserSigned);
    // Determines if the action menu should be visible at all.
    const canTakeAction = isUploader || userIsSignatory;
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const ActionMenu = () => (
        <div ref={menuRef} className="relative">
            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                <EllipsisVerticalIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-700">
                    <div className="py-1">
                        {(isUploader || userIsSignatory) && (
                            <button
                                onClick={() => { props.onSign([doc.id]); setIsMenuOpen(false); }}
                                disabled={!canSign}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                            >
                                <PencilSquareIcon className="w-4 h-4 mr-3" />
                                {hasUserSigned ? 'Assinado' : 'Assinar'}
                            </button>
                        )}
                        {isUploader && (
                          <>
                            <button onClick={() => { setIsRequestModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                <UserGroupIcon className="w-4 h-4 mr-3" /> Solicitar Assinatura
                            </button>
                            <div className="my-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <button onClick={() => { props.onDelete([doc.id]); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-red-500">
                               <TrashIcon className="w-4 h-4 mr-3" /> Excluir
                            </button>
                          </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
        <div className={`flex items-center p-3 border-b border-slate-200 dark:border-slate-800 transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
            <div className="flex items-center flex-1 min-w-0">
                {isUploader && (
                     <input type="checkbox" checked={isSelected} onChange={() => onSelect(doc.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-500 mr-4" />
                )}
                 <button onClick={() => props.onToggleFavorite(doc.id)} className="mr-3 text-slate-400 hover:text-yellow-500">
                    <StarIcon className={`w-5 h-5 transition-colors ${doc.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                 </button>
                <DocumentTextIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 mr-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {doc.fileDetails.type} - {doc.fileDetails.sizeMB.toFixed(2)} MB - Solicitado em {doc.requestedAt}
                    </p>
                </div>
            </div>
            <div className="flex items-center ml-4 space-x-2">
                <div className="flex -space-x-2 overflow-hidden">
                    {doc.signatories.map(s => (
                        <div key={s.id} className="inline-block" title={`${s.name} - ${s.status}`}>
                            <SignatoryStatusPill status={s.status} />
                        </div>
                    ))}
                </div>
                 {canTakeAction && <ActionMenu />}
            </div>
        </div>
        <RequestSignatureModal 
            isOpen={isRequestModalOpen} 
            onClose={() => setIsRequestModalOpen(false)} 
            doc={doc} 
            users={props.users} 
            onRequest={(newSigs) => props.onRequestSignature(doc.id, newSigs)}
        />
        </>
    );
};