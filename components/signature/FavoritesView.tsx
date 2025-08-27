import React, { useMemo } from 'react';
import { DocumentRow } from './DocumentRow';
import type { SignatureDocument, User, Signatory } from '../../types';

interface FavoritesViewProps {
    docs: SignatureDocument[];
    users: User[];
    currentUser: User;
    onToggleFavorite: (docId: number) => void;
    onDelete: (docIds: number[]) => void;
    onSign: (docIds: number[]) => void;
    onRequestSignature: (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = (props) => {
    const favoriteDocs = useMemo(() => props.docs.filter(d => d.isFavorite), [props.docs]);

    return (
        <div className="p-2 md:p-4">
            {favoriteDocs.length > 0 ? (
                <div className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {favoriteDocs.map(doc => (
                        <DocumentRow
                            key={doc.id}
                            doc={doc}
                            isSelected={false} // No selection in favorites view
                            onSelect={() => {}} // No selection in favorites view
                            {...props}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-500 dark:text-slate-400">Nenhum documento marcado como favorito.</p>
                </div>
            )}
        </div>
    );
};
