import type { User, Process, Department, SignatureDocument, ProcessType, Signatory } from './types';
import { ProcessStatus, DocumentType, ProcessAction, UserType, FormFieldType, SignatoryStatus, SignatoryType } from './types';

export const mockDepartments: Department[] = [
  { id: 1, name: 'Recursos Humanos', acronym: 'RH', organization: 'Administrativo' },
  { id: 2, name: 'Financeiro', acronym: 'FIN', organization: 'Administrativo' },
  { id: 3, name: 'Tecnologia da Informação', acronym: 'TI', organization: 'Operacional' },
  { id: 4, name: 'Gabinete', acronym: 'GAB', organization: 'Estratégico' },
  { id: 5, name: 'Marketing', acronym: 'MKT', organization: 'Comercial' },
];

export const mockUsers: User[] = [
  { 
    id: 0, name: 'Admin SAAE', role: 'Admin', avatarUrl: 'https://i.pravatar.cc/100?u=admin', departmentId: 3, currentDepartmentId: 3, allowedDepartmentIds: [1,2,3,4,5], email: 'admin@saae.proc', phone: '(99) 99999-9999', address: 'Sede Administrativa', cpfCnpj: '00.000.000/0001-00',
    userType: UserType.Admin,
    permissions: { canAccessSignatureModule: true, signatureRoles: ['Admin', 'Diretor'], canRequestSignatureFromDeptIds: 'all' },
    connectedDevices: [
        { id: 'dev-admin', type: 'desktop', browser: 'Edge', os: 'Windows', location: 'Brasília, Brasil', lastAccess: '2024-08-01 11:00', isCurrent: true },
    ]
  },
  { 
    id: 1, name: 'Ana Oliveira', role: 'Analista de Processos', avatarUrl: 'https://i.pravatar.cc/100?u=ana', departmentId: 1, currentDepartmentId: 1, allowedDepartmentIds: [1, 4], email: 'ana.oliveira@empresa.com', phone: '(11) 98765-4321', address: 'Rua das Flores, 123, São Paulo, SP', cpfCnpj: '111.222.333-44',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: true, signatureRoles: ['Analista'], canRequestSignatureFromDeptIds: [1] },
    connectedDevices: [
        { id: 'dev1', type: 'desktop', browser: 'Chrome', os: 'Windows', location: 'São Paulo, Brasil', lastAccess: '2024-08-01 10:30', isCurrent: true },
        { id: 'dev2', type: 'mobile', browser: 'Safari', os: 'iOS', location: 'Rio de Janeiro, Brasil', lastAccess: '2024-07-31 20:15', isCurrent: false },
    ]
  },
  { 
    id: 2, name: 'Carlos Silva', role: 'Coordenador', avatarUrl: 'https://i.pravatar.cc/100?u=carlos', departmentId: 4, currentDepartmentId: 4, allowedDepartmentIds: [4], email: 'carlos.silva@empresa.com', phone: '(21) 91234-5678', address: 'Avenida Principal, 456, Rio de Janeiro, RJ', cpfCnpj: '222.333.444-55',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: true, signatureRoles: ['Coordenador'], canRequestSignatureFromDeptIds: [4, 5] },
    connectedDevices: [
        { id: 'dev3', type: 'desktop', browser: 'Firefox', os: 'macOS', location: 'Rio de Janeiro, Brasil', lastAccess: '2024-08-01 09:00', isCurrent: true },
    ]
  },
  { 
    id: 3, name: 'Beatriz Costa', role: 'Chefe de Gabinete', avatarUrl: 'https://i.pravatar.cc/100?u=beatriz', departmentId: 4, currentDepartmentId: 4, allowedDepartmentIds: [4], email: 'beatriz.costa@empresa.com', phone: '(31) 95555-8888', address: 'Praça da Matriz, 789, Belo Horizonte, MG', cpfCnpj: '333.444.555-66',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: false, signatureRoles: [], canRequestSignatureFromDeptIds: [] },
    connectedDevices: []
  },
  { 
    id: 4, name: 'Daniel Martins', role: 'Estagiário', avatarUrl: 'https://i.pravatar.cc/100?u=daniel', departmentId: 4, currentDepartmentId: 4, allowedDepartmentIds: [4], email: 'daniel.martins@empresa.com', phone: '(41) 94444-7777', address: 'Alameda dos Anjos, 101, Curitiba, PR', cpfCnpj: '444.555.666-77',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: false, signatureRoles: [], canRequestSignatureFromDeptIds: [] },
    connectedDevices: []
  },
  { 
    id: 5, name: 'Ricardo Souza', role: 'Advogado', avatarUrl: 'https://i.pravatar.cc/100?u=ricardo', departmentId: 1, currentDepartmentId: 1, allowedDepartmentIds: [1], email: 'ricardo.souza@empresa.com', phone: '(51) 93333-6666', address: 'Travessa dos Ventos, 212, Porto Alegre, RS', cpfCnpj: '555.666.777-88',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: true, signatureRoles: ['Advogado', 'Parecerista'], canRequestSignatureFromDeptIds: 'all' },
    connectedDevices: []
  },
  { 
    id: 6, name: 'Usuário Financeiro', role: 'Analista Financeiro', avatarUrl: 'https://i.pravatar.cc/100?u=financeiro', departmentId: 2, currentDepartmentId: 2, allowedDepartmentIds: [2], email: 'financeiro@saae.proc', phone: '(88) 88888-8888', address: 'Setor Financeiro', cpfCnpj: '999.888.777-66',
    userType: UserType.Internal,
    permissions: { canAccessSignatureModule: false, signatureRoles: [], canRequestSignatureFromDeptIds: [] },
    connectedDevices: []
  },
];

export const mockProcesses: Process[] = [
  {
    id: '2024-00123',
    typeId: 1,
    subject: 'Contratação de Novo Analista de Marketing Digital',
    requester: 'Juliana Costa',
    requesterCPF: '123.456.789-10',
    category: 'Recrutamento e Seleção',
    status: ProcessStatus.InProgress,
    department: mockDepartments[0], // RH
    lastMoved: '2024-07-29',
    isFavorite: true,
    isConfidential: false,
    interestedParties: ['Carlos Silva', 'Mariana Almeida'],
    customFields: {
        'field1': '2024-09-01',
        'field2': 15,
        'field3': 'Contratação urgente para a nova campanha de marketing.'
    },
    movements: [
      { id: 1, date: '2024-07-28', time: '14:30', from: 'Protocolo', to: 'Recursos Humanos', action: ProcessAction.Distribution, user: 'Sistema', isPublic: true },
      { id: 2, date: '2024-07-29', time: '09:15', from: 'Recursos Humanos', to: 'Recursos Humanos', action: ProcessAction.Analysis, user: 'Ana Oliveira', details: 'Verificação inicial dos documentos do candidato.', isPublic: false },
    ],
    documents: [
      { id: 1, docType: DocumentType.File, name: 'Formulário de Requisição.pdf', type: 'PDF', addedAt: '2024-07-28', addedBy: 'Sistema', isPublic: true },
      { id: 2, docType: DocumentType.File, name: 'Currículo do Candidato.pdf', type: 'PDF', addedAt: '2024-07-28', addedBy: 'Juliana Costa', isPublic: false },
      { id: 3, docType: DocumentType.File, name: 'Nota sobre entrevista', type: 'Nota', addedAt: '2024-07-29', addedBy: 'Ana Oliveira', isPublic: false },
    ],
  },
  {
    id: '2024-00124',
    typeId: 2,
    subject: 'Aquisição de 10 Licenças de Software de Design',
    requester: 'Departamento de Marketing',
    requesterCPF: 'N/A - Interno',
    category: 'Compras',
    status: ProcessStatus.InProgress,
    department: mockDepartments[3], // Gabinete
    lastMoved: '2024-07-27',
    isFavorite: false,
    isConfidential: true,
    interestedParties: [],
    movements: [
       { id: 1, date: '2024-07-27', time: '10:00', from: 'Marketing', to: 'Gabinete', action: ProcessAction.Send, user: 'Pedro Martins', isPublic: true },
    ],
    documents: [
       { id: 1, docType: DocumentType.File, name: 'Orçamento A.pdf', type: 'PDF', addedAt: '2024-07-27', addedBy: 'Pedro Martins', isPublic: false },
       { id: 2, docType: DocumentType.File, name: 'Orçamento B.pdf', type: 'PDF', addedAt: '2024-07-27', addedBy: 'Pedro Martins', isPublic: false },
    ],
    allowedReceivers: ['Carlos Silva'], // Only Carlos can receive this initially
  },
  {
    id: '2024-00125',
    typeId: 2,
    subject: 'Análise de Contrato Fornecedor XPTO',
    requester: 'Departamento de Compras',
    requesterCPF: 'N/A - Interno',
    category: 'Contratos',
    status: ProcessStatus.InProgress,
    department: mockDepartments[3], // Gabinete
    lastMoved: '2024-07-30',
    isFavorite: false,
    isConfidential: false,
    interestedParties: [],
    movements: [
      { id: 1, date: '2024-07-30', time: '11:00', from: 'Compras', to: 'Gabinete', action: ProcessAction.Send, user: 'Sistema', isPublic: true }
    ],
    documents: [
      { id: 1, docType: DocumentType.File, name: 'Minuta Contratual.pdf', type: 'PDF', addedAt: '2024-07-30', addedBy: 'Sistema', isPublic: false }
    ],
  }
];

export const mockSignatureDocs: SignatureDocument[] = [
  {
    id: 1,
    name: 'Contrato de Prestação de Serviços TI.pdf',
    uploaderId: 1,
    requestedAt: '2024-07-28',
    isFavorite: true,
    fileDetails: { type: 'PDF', sizeMB: 1.2 },
    signatories: [
      { id: '1', name: 'Ana Oliveira', type: SignatoryType.Internal, status: SignatoryStatus.Signed },
      { id: '2', name: 'Carlos Silva', type: SignatoryType.Internal, status: SignatoryStatus.Pending },
      { id: '6', name: 'Usuário Financeiro', type: SignatoryType.Internal, status: SignatoryStatus.Pending },
    ],
  },
  {
    id: 2,
    name: 'Proposta Comercial - Marketing.docx',
    uploaderId: 2,
    requestedAt: '2024-07-29',
    isFavorite: false,
    fileDetails: { type: 'DOCX', sizeMB: 0.8 },
    signatories: [
      { id: '2', name: 'Carlos Silva', type: SignatoryType.Internal, status: SignatoryStatus.Signed },
      { id: 'externo@cliente.com', name: 'Cliente Externo', type: SignatoryType.External, status: SignatoryStatus.Pending },
    ],
  },
  {
    id: 3,
    name: 'Termo de Confidencialidade (NDA).pdf',
    uploaderId: 5,
    requestedAt: '2024-07-30',
    isFavorite: false,
    fileDetails: { type: 'PDF', sizeMB: 0.5 },
    signatories: [
      { id: '5', name: 'Ricardo Souza', type: SignatoryType.Internal, status: SignatoryStatus.Signed },
    ],
  },
   {
    id: 4,
    name: 'Relatório Financeiro Q3.pdf',
    uploaderId: 6,
    requestedAt: '2024-08-01',
    isFavorite: true,
    fileDetails: { type: 'PDF', sizeMB: 2.5 },
    signatories: [
      { id: '6', name: 'Usuário Financeiro', type: SignatoryType.Internal, status: SignatoryStatus.Signed },
      { id: '2', name: 'Carlos Silva', type: SignatoryType.Internal, status: SignatoryStatus.Signed },
    ],
  },
  {
    id: 5,
    name: 'Política de Home Office.docx',
    uploaderId: 1,
    requestedAt: '2024-08-01',
    isFavorite: false,
    fileDetails: { type: 'DOCX', sizeMB: 0.2 },
    signatories: [
      { id: '1', name: 'Ana Oliveira', type: SignatoryType.Internal, status: SignatoryStatus.Pending },
    ],
  },
];

export const mockProcessTypes: ProcessType[] = [
    {
        id: 1,
        name: 'Solicitação de Férias',
        type: 'internal',
        coverConfig: { title: 'Capa Padrão de Férias', showLogo: true },
        drawflowData: null,
        formFields: [
            { id: 'field1', label: 'Data de Início', type: FormFieldType.Date, required: true },
            { id: 'field2', label: 'Quantidade de Dias', type: FormFieldType.Number, required: true },
            { id: 'field3', label: 'Observações', type: FormFieldType.TextArea, required: false },
        ],
        attachments: [
            { id: 'att1', name: 'Formulário de Férias Assinado', type: 'pdf', required: true },
        ]
    },
    {
        id: 2,
        name: 'Requisição de Compra',
        type: 'internal',
        coverConfig: { title: 'Capa Padrão de Compras', showLogo: true },
        drawflowData: null,
        formFields: [
            { id: 'field_compra_1', label: 'Item a ser comprado', type: FormFieldType.Text, required: true },
            { id: 'field_compra_2', label: 'Justificativa', type: FormFieldType.TextArea, required: true },
            { id: 'field_compra_3', label: 'Valor Estimado (R$)', type: FormFieldType.Number, required: true },
        ],
        attachments: [
            { id: 'att_compra_1', name: 'Orçamento 1', type: 'pdf', required: true },
            { id: 'att_compra_2', name: 'Orçamento 2', type: 'pdf', required: false },
        ]
    }
];
