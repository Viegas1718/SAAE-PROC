export interface ConnectedDevice {
  id: string;
  type: 'desktop' | 'mobile';
  browser: string;
  os: string;
  location: string;
  lastAccess: string;
  isCurrent: boolean;
}

export enum UserType {
    Internal = 'Usuário Interno',
    Company = 'Empresa',
    Citizen = 'Cidadão',
    Admin = 'Admin',
}

export interface UserPermissions {
    canAccessSignatureModule: boolean;
    signatureRoles: string[]; // e.g., ['Diretor', 'Gerente']
    canRequestSignatureFromDeptIds: 'all' | number[];
}

export interface User {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  departmentId: number; // The user's primary department
  currentDepartmentId: number;
  allowedDepartmentIds: number[];
  email: string;
  phone: string;
  address: string;
  cpfCnpj: string;
  connectedDevices: ConnectedDevice[];
  userType: UserType;
  permissions: UserPermissions;
}

export interface Department {
  id: number;
  name: string;
  acronym: string;
  organization: string;
}

export enum ProcessStatus {
  InProgress = 'Em Andamento',
  Sent = 'Enviado',
  Archived = 'Arquivado',
  Pending = 'Pendente',
}

export enum ProcessAction {
    Creation = 'Criação de Processo',
    Send = 'Envio para Outro Setor',
    Distribution = 'Distribuição Interna',
    Return = 'Devolvido',
    Analysis = 'Análise de Documentos',
    Archive = 'Arquivado',
}


export interface ProcessMovement {
  id: number;
  date: string;
  time: string;
  from: string;
  to: string;
  action: ProcessAction;
  user: string;
  details?: string;
  isPublic: boolean;
}

export enum DocumentType {
  File = 'File',
  ExternalRequest = 'ExternalRequest',
  ExternalNotification = 'ExternalNotification',
}

export enum RequestStatus {
  Pending = 'Pendente de Envio',
  Received = 'Recebido',
}

export enum NotificationStatus {
  Sent = 'Enviado',
  Read = 'Lido',
}

export interface ProcessDocument {
  id: number;
  docType: DocumentType;
  name: string;
  addedAt: string;
  addedBy: string;
  
  // Fields for docType = File
  type?: 'PDF' | 'Imagem' | 'Nota' | 'Email';
  isPublic?: boolean;

  // Fields for docType = ExternalRequest
  requestStatus?: RequestStatus;
  requestedTo?: string; // email of external user
  requestedDocuments?: string[]; // list of document names requested

  // Fields for docType = ExternalNotification
  notificationStatus?: NotificationStatus;
  sentTo?: string; // email of external user
  message?: string;
  sentDocumentIds?: number[];
}


export interface Process {
  id: string;
  typeId: number;
  subject: string;
  requester: string;
  requesterCPF: string;
  category: string;
  status: ProcessStatus;
  department: Department;
  lastMoved: string;
  isFavorite: boolean;
  isConfidential: boolean;
  movements: ProcessMovement[];
  documents: ProcessDocument[];
  interestedParties: string[];
  allowedReceivers?: string[]; // List of user names allowed to receive
  customFields?: { [key: string]: any };
}

// --- Signature Module Types ---

export enum SignatureStatus {
  Pending = 'Faltando Assinar',
  Signed = 'Assinado',
  Shared = 'Compartilhado',
}

export enum SignatoryStatus {
    Pending = 'Pendente',
    Signed = 'Assinado',
}

export enum SignatoryType {
    Internal = 'Internal',
    External = 'External',
}

export interface Signatory {
    id: string; // userId for internal, email for external
    name: string;
    type: SignatoryType;
    status: SignatoryStatus;
}

export interface SignatureDocument {
  id: number;
  name: string;
  uploaderId: number; // Link to the user who uploaded it
  requestedAt: string;
  isFavorite: boolean;
  fileDetails: {
      type: 'PDF' | 'DOCX';
      sizeMB: number;
  };
  signatories: Signatory[];
}


// --- Admin Panel Types ---
export enum FormFieldType {
    Text = 'Texto Curto',
    TextArea = 'Texto Longo',
    Number = 'Número',
    Date = 'Data',
}

export interface FormField {
    id: string;
    label: string;
    type: FormFieldType;
    required: boolean;
}

export interface AttachmentConfig {
    id: string;
    name: string;
    type: 'pdf' | 'image';
    required: boolean;
}

export interface ProcessType {
    id: number;
    name: string;
    type: 'internal' | 'external';
    coverConfig: {
        title: string;
        showLogo: boolean;
    };
    drawflowData: any; // Placeholder for draw.js data
    formFields: FormField[];
    attachments: AttachmentConfig[];
}