import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ProcessTable from './components/ProcessTable';
import ProcessDetail from './components/ProcessDetail';
import SignatureModule from './components/SignatureModule';
import NewProcessModal from './components/modals/NewProcessModal';
import RequestDocumentModal from './components/modals/RequestDocumentModal';
import SendNotificationModal from './components/modals/SendNotificationModal';
import ReceiveProcessModal from './components/modals/ReceiveProcessModal';
import SendProcessModal from './components/modals/SendProcessModal';
import ProfilePage from './components/pages/ProfilePage';
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';
import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage';
import AdminPage from './components/pages/admin/AdminPage';
import { mockProcesses, mockUsers, mockSignatureDocs, mockDepartments, mockProcessTypes } from './constants';
import type { Process, SignatureDocument, ProcessDocument, ProcessMovement, User, ProcessType, Signatory } from './types';
import { ProcessStatus, DocumentType, RequestStatus, NotificationStatus, ProcessAction, SignatoryStatus, SignatoryType } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const currentUser = users.find(u => u.id === currentUserId);

  const [activeView, setActiveView] = useState<string>('Caixa de Entrada');
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);
  const [signatureDocs, setSignatureDocs] = useState<SignatureDocument[]>(mockSignatureDocs);
  const [processTypes, setProcessTypes] = useState<ProcessType[]>(mockProcessTypes);

  const [isNewProcessModalOpen, setIsNewProcessModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(currentUser?.currentDepartmentId ?? null);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        setCurrentUserId(user.id);
        setCurrentDepartmentId(user.currentDepartmentId);
        setIsAuthenticated(true);
        setActiveView('Caixa de Entrada');
    } else {
        alert("Usuário ou senha inválidos.");
    }
  };
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setAuthView('login');
  };

  const handleDepartmentChange = (departmentId: number) => {
    setCurrentDepartmentId(departmentId);
    setActiveView('Caixa de Entrada');
    setSelectedProcess(null);
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    setSelectedProcess(null);
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    alert('Perfil salvo com sucesso!');
  };

  const handleUpdateProcessType = (updatedProcessType: ProcessType) => {
    setProcessTypes(processTypes.map(pt => pt.id === updatedProcessType.id ? updatedProcessType : pt));
  };
  
  const handleSignOutDevice = (userId: number, deviceId: string) => {
    setUsers(users.map(user => {
        if (user.id === userId) {
            return {
                ...user,
                connectedDevices: user.connectedDevices.filter(device => device.id !== deviceId)
            };
        }
        return user;
    }));
  };

  const handleSelectProcess = (process: Process) => {
    setSelectedProcess(process);
  };

  const handleBackToList = () => {
    setSelectedProcess(null);
  };

  const updateProcessState = (processId: string, updates: Partial<Process> | ((p: Process) => Process)) => {
    const updatedProcesses = processes.map(p => {
        if (p.id === processId) {
            const updatedProcess = typeof updates === 'function' ? updates(p) : { ...p, ...updates };
            if (selectedProcess?.id === processId) {
                setSelectedProcess(updatedProcess);
            }
            return updatedProcess;
        }
        return p;
    });
    setProcesses(updatedProcesses);
  };

  const addMovement = (processId: string, movement: Omit<ProcessMovement, 'id' | 'date' | 'time'>) => {
    updateProcessState(processId, (p) => {
        const newMovement: ProcessMovement = {
            id: p.movements.length + 1,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            ...movement
        };
        return { ...p, movements: [...p.movements, newMovement] };
    });
  };

  const handleCreateProcess = (data: { typeId: number, subject: string, requester: string, customFields: { [key: string]: any }}) => {
    if (!currentUser || currentDepartmentId === null) return;
    const newProcess: Process = {
        id: `2024-00${processes.length + 126}`,
        typeId: data.typeId,
        subject: data.subject,
        requester: data.requester,
        requesterCPF: '111.222.333-45', // Placeholder
        category: 'Geral', // Placeholder
        status: ProcessStatus.InProgress,
        department: mockDepartments.find(d => d.id === currentDepartmentId)!,
        lastMoved: new Date().toISOString().split('T')[0],
        isFavorite: false,
        isConfidential: false,
        interestedParties: [],
        customFields: data.customFields,
        documents: [],
        movements: [
            { id: 1, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString(), from: 'Sistema', to: mockDepartments.find(d => d.id === currentDepartmentId)!.name, action: ProcessAction.Creation, user: currentUser.name, isPublic: true }
        ],
    };
    setProcesses([newProcess, ...processes]);
    setIsNewProcessModalOpen(false);
  };

  const handleRequestDocument = (email: string, documents: string[]) => {
    if (!selectedProcess || !currentUser) return;
    const newRequest: ProcessDocument = {
        id: selectedProcess.documents.length + 1,
        docType: DocumentType.ExternalRequest,
        name: `Solicitação para ${email}`,
        addedAt: new Date().toISOString(),
        addedBy: currentUser.name,
        requestStatus: RequestStatus.Pending,
        requestedTo: email,
        requestedDocuments: documents,
    };
    updateProcessState(selectedProcess.id, p => ({ ...p, documents: [...p.documents, newRequest] }));
    setIsRequestModalOpen(false);
  };

   const handleSimulateUpload = (processId: string, requestId: number) => {
    updateProcessState(processId, p => {
      const requestDoc = p.documents.find(d => d.id === requestId);
      if (!requestDoc || !requestDoc.requestedDocuments) return p;

      const newDocs: ProcessDocument[] = requestDoc.requestedDocuments.map((docName, index) => ({
        id: p.documents.length + 1 + index,
        docType: DocumentType.File,
        name: `${docName} (recebido).pdf`,
        type: 'PDF',
        addedAt: new Date().toISOString(),
        addedBy: requestDoc.requestedTo!,
        isPublic: false,
      }));

      const updatedDocs = p.documents.map(d => 
        d.id === requestId ? { ...d, requestStatus: RequestStatus.Received } : d
      );

      return { ...p, documents: [...updatedDocs, ...newDocs] };
    });
  };

  const handleSendNotification = (email: string, message: string, documentIds: number[]) => {
     if (!selectedProcess || !currentUser) return;
     const newNotification: ProcessDocument = {
        id: selectedProcess.documents.length + 1,
        docType: DocumentType.ExternalNotification,
        name: `Notificação para ${email}`,
        addedAt: new Date().toISOString(),
        addedBy: currentUser.name,
        notificationStatus: NotificationStatus.Sent,
        sentTo: email,
        message,
        sentDocumentIds: documentIds
     };
     updateProcessState(selectedProcess.id, p => ({ ...p, documents: [...p.documents, newNotification] }));
     setIsSendNotificationModalOpen(false);
  };

  const handleSimulateEmailRead = (processId: string, notificationId: number) => {
      updateProcessState(processId, p => ({
          ...p,
          documents: p.documents.map(d => d.id === notificationId ? { ...d, notificationStatus: NotificationStatus.Read } : d)
      }));
  };
  
  const handleToggleMovementVisibility = (processId: string, movementId: number) => {
    updateProcessState(processId, p => ({
      ...p,
      movements: p.movements.map(m => m.id === movementId ? { ...m, isPublic: !m.isPublic } : m)
    }));
  };

  const handleRevertLastMovement = (processId: string) => {
    updateProcessState(processId, p => {
      if (p.movements.length <= 1) return p;
      const newMovements = p.movements.slice(0, -1);
      const previousDepartmentName = newMovements[newMovements.length - 1].to;
      const previousDepartment = mockDepartments.find(d => d.name === previousDepartmentName);
      return {
        ...p,
        movements: newMovements,
        department: previousDepartment || p.department,
        lastMoved: newMovements[newMovements.length - 1].date,
      };
    });
  };

  const handleDistributeProcess = (userNames: string[]) => {
    if (!selectedProcess || !currentUser) return;
    addMovement(selectedProcess.id, {
        from: selectedProcess.department.name,
        to: selectedProcess.department.name,
        action: ProcessAction.Distribution,
        user: currentUser.name,
        details: `Processo distribuído para: ${userNames.join(', ')}.`,
        isPublic: false,
    });
    setIsReceiveModalOpen(false);
  };
  
  const handleReturnProcess = () => {
    if (!selectedProcess || !currentUser || selectedProcess.movements.length < 2) return;
    const previousMovement = selectedProcess.movements[selectedProcess.movements.length-2];
    const targetDepartment = mockDepartments.find(d => d.name === previousMovement.to);
    if (targetDepartment) {
        addMovement(selectedProcess.id, {
            from: selectedProcess.department.name,
            to: targetDepartment.name,
            action: ProcessAction.Return,
            user: currentUser.name,
            isPublic: true,
        });
        updateProcessState(selectedProcess.id, { department: targetDepartment, lastMoved: new Date().toISOString().split('T')[0] });
    }
    setIsReceiveModalOpen(false);
  };

  const handleSendProcess = (processId: string, targetDepartmentId: number, allowedReceivers?: string[]) => {
      if (!currentUser) return;
      const targetDepartment = mockDepartments.find(d => d.id === targetDepartmentId);
      if (!targetDepartment) return;
      
      const currentDepartmentName = processes.find(p => p.id === processId)?.department.name || 'Desconhecido';

      addMovement(processId, {
          from: currentDepartmentName,
          to: targetDepartment.name,
          action: ProcessAction.Send,
          user: currentUser.name,
          isPublic: true,
      });
      updateProcessState(processId, {
          department: targetDepartment,
          lastMoved: new Date().toISOString().split('T')[0],
          status: ProcessStatus.Sent,
          allowedReceivers: allowedReceivers,
      });
  };

  // --- Signature Module Handlers ---

  const handleToggleSignatureDocFavorite = (docId: number) => {
      setSignatureDocs(docs => docs.map(doc => doc.id === docId ? {...doc, isFavorite: !doc.isFavorite} : doc));
  };
  
  const handleUploadSignatureDoc = (file: { name: string; type: 'PDF' | 'DOCX'; sizeMB: number }) => {
      if (!currentUser) return;
      const newId = Math.max(...signatureDocs.map(d => d.id), 0) + 1;
      const newDoc: SignatureDocument = {
          id: newId,
          name: file.name,
          uploaderId: currentUser.id,
          requestedAt: new Date().toISOString().split('T')[0],
          isFavorite: false,
          fileDetails: file,
          signatories: [], // Start with no signatories
      };
      setSignatureDocs(prev => [newDoc, ...prev]);
  };

  const handleDeleteSignatureDocs = (docIds: number[]) => {
      setSignatureDocs(prev => prev.filter(doc => !docIds.includes(doc.id)));
  };

  const handleSignSignatureDocs = (docIds: number[]) => {
      if (!currentUser) return;
      setSignatureDocs(docs => docs.map(doc => {
          if (docIds.includes(doc.id)) {
              const userAsSignatory: Signatory = {
                  id: String(currentUser.id),
                  name: currentUser.name,
                  type: SignatoryType.Internal,
                  status: SignatoryStatus.Signed,
              };

              const userIsAlreadySignatory = doc.signatories.some(sig => sig.id === String(currentUser.id));

              if (userIsAlreadySignatory) {
                  // User is in the list, just update their status to Signed
                  return {
                      ...doc,
                      signatories: doc.signatories.map(sig =>
                          sig.id === String(currentUser.id) ? { ...sig, status: SignatoryStatus.Signed } : sig
                      )
                  };
              } else {
                  // User is not in the list, add them as a new signatory who has signed
                  return {
                      ...doc,
                      signatories: [...doc.signatories, userAsSignatory]
                  };
              }
          }
          return doc;
      }));
  };

  const handleRequestSignatures = (docId: number, newSignatories: Pick<Signatory, 'id' | 'name' | 'type'>[]) => {
      setSignatureDocs(docs => docs.map(doc => {
          if (doc.id === docId) {
              const existingSignatoryIds = new Set(doc.signatories.map(s => s.id));
              const signatoriesToAdd = newSignatories
                  .filter(ns => !existingSignatoryIds.has(ns.id))
                  .map(ns => ({ ...ns, status: SignatoryStatus.Pending }));

              return { ...doc, signatories: [...doc.signatories, ...signatoriesToAdd] };
          }
          return doc;
      }));
  };

  // --- Render Logic ---

  if (!isAuthenticated || !currentUser) {
    switch (authView) {
      case 'register':
        return <RegisterPage onNavigate={setAuthView} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setAuthView} />;
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={setAuthView} />;
    }
  }

  const departmentProcesses = processes.filter(p => p.department.id === currentDepartmentId);

  const renderContent = () => {
    if (selectedProcess) {
      return (
        <ProcessDetail
          process={selectedProcess}
          currentUser={currentUser}
          allProcessTypes={processTypes}
          onBack={handleBackToList}
          onOpenRequestModal={() => setIsRequestModalOpen(true)}
          onOpenSendNotificationModal={() => setIsSendNotificationModalOpen(true)}
          onOpenReceiveModal={() => setIsReceiveModalOpen(true)}
          onOpenSendModal={() => setIsSendModalOpen(true)}
          onSimulateUpload={handleSimulateUpload}
          onSimulateEmailRead={handleSimulateEmailRead}
          currentDepartmentId={currentDepartmentId!}
          onToggleMovementVisibility={handleToggleMovementVisibility}
          onRevertLastMovement={handleRevertLastMovement}
        />
      );
    }

    switch (activeView) {
      case 'Enviados':
        return <ProcessTable title="Processos Enviados" processes={processes.filter(p => p.status === ProcessStatus.Sent)} onSelectProcess={handleSelectProcess} />;
      case 'Arquivados':
        return <ProcessTable title="Processos Arquivados" processes={processes.filter(p => p.status === ProcessStatus.Archived)} onSelectProcess={handleSelectProcess} />;
      case 'Favoritos':
        return <ProcessTable title="Processos Favoritos" processes={processes.filter(p => p.isFavorite)} onSelectProcess={handleSelectProcess} />;
      case 'Sigilosos':
        return <ProcessTable title="Processos Sigilosos" processes={processes.filter(p => p.isConfidential)} onSelectProcess={handleSelectProcess} />;
      case 'Assinatura Eletrônica':
        return <SignatureModule 
                  docs={signatureDocs}
                  users={users}
                  currentUser={currentUser}
                  onToggleFavorite={handleToggleSignatureDocFavorite}
                  onUpload={handleUploadSignatureDoc}
                  onDelete={handleDeleteSignatureDocs}
                  onSign={handleSignSignatureDocs}
                  onRequestSignature={handleRequestSignatures}
               />;
      case 'Meu Perfil':
        return <ProfilePage 
                    user={currentUser} 
                    department={mockDepartments.find(d => d.id === currentUser.departmentId)} 
                    onUpdateUser={handleUpdateUser}
                    onSignOutDevice={(deviceId) => handleSignOutDevice(currentUser.id, deviceId)}
                />;
      case 'Administração':
        return <AdminPage 
                    allUsers={users}
                    allDepartments={mockDepartments}
                    onUpdateUser={handleUpdateUser}
                    allProcessTypes={processTypes}
                    onUpdateProcessType={handleUpdateProcessType}
                />;
      case 'Caixa de Entrada':
      default:
        return <ProcessTable title="Caixa de Entrada" processes={departmentProcesses.filter(p => p.status !== ProcessStatus.Archived)} onSelectProcess={handleSelectProcess} />;
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-gray-900 ${theme}`}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={handleNavigate} 
        onNavigate={handleBackToList} 
        onNewProcessClick={() => setIsNewProcessModalOpen(true)}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={currentUser}
          allDepartments={mockDepartments}
          currentDepartmentId={currentDepartmentId!}
          onDepartmentChange={handleDepartmentChange}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      <NewProcessModal isOpen={isNewProcessModalOpen} onClose={() => setIsNewProcessModalOpen(false)} onCreate={handleCreateProcess} processTypes={processTypes} />
      {selectedProcess && (
        <>
            <RequestDocumentModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onCreate={handleRequestDocument} />
            <SendNotificationModal isOpen={isSendNotificationModalOpen} onClose={() => setIsSendNotificationModalOpen(false)} processDocuments={selectedProcess.documents} onSend={handleSendNotification} />
            <ReceiveProcessModal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} process={selectedProcess} usersInDepartment={users.filter(u => u.departmentId === currentDepartmentId && u.id !== currentUser.id)} onDistribute={handleDistributeProcess} onReturn={handleReturnProcess} />
            <SendProcessModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} process={selectedProcess} allDepartments={mockDepartments} allUsers={users} onSend={handleSendProcess} />
        </>
      )}
    </div>
  );
};

export default App;