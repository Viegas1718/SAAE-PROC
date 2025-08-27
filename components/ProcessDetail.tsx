import React, { useState } from 'react';
import type { Process, ProcessDocument, ProcessMovement, User, ProcessType } from '../types';
import { DocumentType, RequestStatus, NotificationStatus, ProcessAction } from '../types';
import Card from './ui/Card';
import Tag from './ui/Tag';
import Button from './ui/Button';
import { 
  ArrowLeftIcon, 
  PaperClipIcon, 
  UserGroupIcon, 
  ClockIcon,
  DocumentTextIcon, 
  PaperAirplaneIcon,
  UserPlusIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  InboxArrowDownIcon
} from './icons/Icons';

interface ProcessDetailProps {
  process: Process;
  currentUser: User;
  allProcessTypes: ProcessType[];
  currentDepartmentId: number;
  onBack: () => void;
  onOpenRequestModal: () => void;
  onOpenSendNotificationModal: () => void;
  onOpenReceiveModal: () => void;
  onOpenSendModal: () => void;
  onSimulateUpload: (processId: string, requestId: number) => void;
  onSimulateEmailRead: (processId: string, notificationId: number) => void;
  onToggleMovementVisibility: (processId: string, movementId: number) => void;
  onRevertLastMovement: (processId: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
        {children}
    </button>
);

const MovementsTimeline: React.FC<{
  process: Process;
  onToggleVisibility: (movementId: number) => void;
  onRevertMovement: () => void;
}> = ({ process, onToggleVisibility, onRevertMovement }) => {
    const [expandedMovementId, setExpandedMovementId] = useState<number | null>(null);

    const handleToggleExpand = (movementId: number) => {
        setExpandedMovementId(prevId => (prevId === movementId ? null : movementId));
    };
    
    return (
        <div className="space-y-2">
            {process.movements.map((mov, index) => {
                const isLastMovement = index === process.movements.length - 1;
                const isCurrentStep = isLastMovement && process.department.name === mov.to;
                
                return (
                    <div key={mov.id} className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCurrentStep ? 'bg-blue-600 ring-4 ring-blue-200 dark:ring-blue-500/30' : 'bg-slate-400 dark:bg-slate-600'}`}>
                               <ClockIcon className="w-4 h-4 text-white" />
                            </div>
                            {!isLastMovement && <div className="w-px h-full bg-slate-300 dark:bg-slate-700"></div>}
                        </div>
                        <div className="w-full pb-6">
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div className="p-3 flex justify-between items-center">
                                    <div>
                                        <button onClick={() => handleToggleExpand(mov.id)} className="text-left group">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{mov.action}</p>
                                        </button>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{mov.date} às {mov.time} por {mov.user}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => onToggleVisibility(mov.id)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400" title={mov.isPublic ? "Visível para o requerente" : "Oculto para o requerente"}>
                                            {mov.isPublic ? <LockOpenIcon className="w-4 h-4" /> : <LockClosedIcon className="w-4 h-4" />}
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400" title="Exportar movimentação">
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {expandedMovementId === mov.id && (
                                    <div className="px-3 pb-3">
                                        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                                            <p className="text-sm text-slate-600 dark:text-slate-300">De: <span className="font-medium">{mov.from}</span> Para: <span className="font-medium">{mov.to}</span></p>
                                            {mov.details && <p className="text-sm mt-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md border border-slate-200 dark:border-slate-700">{mov.details}</p>}
                                            {isLastMovement && process.movements.length > 1 && (
                                                <div className="mt-3 text-right">
                                                    <Button variant="danger" size="sm" onClick={onRevertMovement}>
                                                        <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
                                                        Reverter Movimentação
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                           {isCurrentStep && <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">DEPARTAMENTO ATUAL</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const DocumentList: React.FC<{ 
  process: Process; 
  onSimulateUpload: (processId: string, requestId: number) => void;
  onSimulateEmailRead: (processId: string, notificationId: number) => void;
}> = ({ process, onSimulateUpload, onSimulateEmailRead }) => (
  <div className="space-y-3">
    {process.documents.map(doc => {
      if (doc.docType === DocumentType.ExternalRequest) {
        return (
          <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enviado para: {doc.requestedTo} por {doc.addedBy}</p>
              </div>
              {doc.requestStatus && <Tag status={doc.requestStatus} />}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Documentos Solicitados:</p>
              <ul className="list-disc list-inside space-y-1">
                {doc.requestedDocuments?.map((reqDoc, index) => (
                  <li key={index} className="text-sm text-slate-700 dark:text-slate-300">{reqDoc}</li>
                ))}
              </ul>
            </div>
            {doc.requestStatus === RequestStatus.Pending && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-right">
                <Button size="sm" onClick={() => onSimulateUpload(process.id, doc.id)}>
                  Simular Envio de Documentos
                </Button>
              </div>
            )}
          </div>
        )
      }

      if (doc.docType === DocumentType.ExternalNotification) {
        const sentDocs = process.documents.filter(d => doc.sentDocumentIds?.includes(d.id));
        return (
          <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enviado por {doc.addedBy} em {new Date(doc.addedAt).toLocaleDateString()}</p>
              </div>
              {doc.notificationStatus && <Tag status={doc.notificationStatus} />}
            </div>
             <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700 whitespace-pre-wrap text-slate-600 dark:text-slate-300">{doc.message}</p>
             </div>
            {sentDocs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Documentos Anexados:</p>
                <ul className="list-disc list-inside space-y-1">
                  {sentDocs.map((sentDoc) => (
                    <li key={sentDoc.id} className="text-sm text-slate-700 dark:text-slate-300">{sentDoc.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {doc.notificationStatus === NotificationStatus.Sent && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-right">
                <Button size="sm" onClick={() => onSimulateEmailRead(process.id, doc.id)}>
                  Simular Leitura de E-mail
                </Button>
              </div>
            )}
          </div>
        )
      }
      
      return (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Adicionado por {doc.addedBy} em {new Date(doc.addedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Baixar</button>
        </div>
      );
    })}
  </div>
);


const ProcessDetail: React.FC<ProcessDetailProps> = ({ process, currentUser, allProcessTypes, onBack, onOpenRequestModal, onSimulateUpload, onOpenSendNotificationModal, onSimulateEmailRead, currentDepartmentId, onToggleMovementVisibility, onRevertLastMovement, onOpenReceiveModal, onOpenSendModal }) => {
    const [activeTab, setActiveTab] = useState('movements');

    const isUserInCurrentProcessDept = process.department.id === currentDepartmentId;
    const isLastActionDistribution = process.movements[process.movements.length - 1]?.action === ProcessAction.Distribution;

    const canReceive = isUserInCurrentProcessDept && !isLastActionDistribution &&
        (!process.allowedReceivers || process.allowedReceivers.includes(currentUser.name));

    const canSend = isUserInCurrentProcessDept && !isLastActionDistribution;
    
    const processType = allProcessTypes.find(pt => pt.id === process.typeId);


  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <Button onClick={onBack} variant="secondary" size="sm">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Voltar à Lista
            </Button>
            <div className="flex items-center space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onOpenReceiveModal} 
                  disabled={!canReceive} 
                  title={!canReceive ? "Você não tem permissão para receber este processo." : ""}
                >
                  <InboxArrowDownIcon className="w-4 h-4 mr-2" />
                  Receber e Distribuir
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={onOpenSendModal} 
                  disabled={!canSend} 
                  title={!canSend ? "Você não tem permissão para enviar este processo." : ""}
                >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Enviar Processo
                </Button>
            </div>
        </div>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Processo Nº {process.id}</p>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{process.subject}</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Requerente: <span className="font-medium">{process.requester}</span></p>
                        {processType && <p className="text-sm text-slate-600 dark:text-slate-300">Tipo de Processo: <span className="font-medium">{processType.name}</span></p>}
                    </div>
                    <Tag status={process.status} />
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center"><UserGroupIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> Interessados</h3>
                            <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                                {process.interestedParties.length > 0 ? process.interestedParties.map(p => <li key={p}>{p}</li>) : <li>Nenhum</li>}
                            </ul>
                        </div>
                    </Card>
                     <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center"><PaperClipIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> Documentos</h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{process.documents.length} documentos e solicitações</p>
                        </div>
                    </Card>
                     <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center"><ClockIcon className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-500" /> Última Movimentação</h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{process.lastMoved}</p>
                        </div>
                    </Card>
                </div>
                {processType && process.customFields && Object.keys(process.customFields).length > 0 && (
                    <Card className="mt-6 dark:bg-slate-800 dark:border-slate-700">
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Detalhes do Processo ({processType.name})</h3>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                {processType.formFields.map(field => {
                                    const value = process.customFields?.[field.id];
                                    if (value === undefined || value === null || value === '') return null;
                                    return (
                                        <div key={field.id} className="flex flex-col">
                                            <dt className="text-slate-500 dark:text-slate-400">{field.label}</dt>
                                            <dd className="text-slate-800 dark:text-slate-100 font-medium">{String(value)}</dd>
                                        </div>
                                    )
                                })}
                            </dl>
                        </div>
                    </Card>
                )}
            </div>

            <div className="px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                     <TabButton active={activeTab === 'movements'} onClick={() => setActiveTab('movements')}>
                        Movimentações ({process.movements.length})
                    </TabButton>
                    <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                        Área de Trabalho ({process.documents.length})
                    </TabButton>
                </div>
            </div>
            <div className="p-6">
                {activeTab === 'movements' && (
                    <MovementsTimeline
                        process={process}
                        onToggleVisibility={(movId) => onToggleMovementVisibility(process.id, movId)}
                        onRevertMovement={() => onRevertLastMovement(process.id)}
                    />
                )}
                {activeTab === 'documents' && (
                    <div>
                        <div className="flex justify-end space-x-2 mb-4">
                            <Button variant="secondary" size="sm" onClick={onOpenRequestModal}>
                                <UserPlusIcon className="w-4 h-4 mr-2" />
                                Solicitar Documento
                            </Button>
                            <Button variant="secondary" size="sm" onClick={onOpenSendNotificationModal}>
                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                Enviar Notificação
                            </Button>
                        </div>
                        <DocumentList
                            process={process}
                            onSimulateUpload={onSimulateUpload}
                            onSimulateEmailRead={onSimulateEmailRead}
                        />
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
};

export default ProcessDetail;