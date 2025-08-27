import React from 'react';
import type { User } from '../../types';
import { UserType } from '../../types';
import { 
  InboxIcon, 
  PaperAirplaneIcon, 
  ArchiveBoxIcon, 
  StarIcon, 
  LockClosedIcon, 
  PlusCircleIcon,
  PencilSquareIcon,
  Cog6ToothIcon
} from '../icons/Icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNavigate: () => void;
  onNewProcessClick: () => void;
  currentUser: User;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium text-sm">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onNavigate, onNewProcessClick, currentUser }) => {
  const handleNavClick = (view: string) => {
    setActiveView(view);
    onNavigate();
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 flex-shrink-0 p-4 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-3">SAAE-proc</h1>
      </div>

      <button onClick={onNewProcessClick} className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm mb-6">
        <PlusCircleIcon className="w-5 h-5" />
        <span className="ml-2 font-semibold text-sm">Novo Processo</span>
      </button>

      <nav className="flex-1">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-3">Processos</p>
        <ul>
          <NavItem
            icon={<InboxIcon className="w-5 h-5" />}
            label="Caixa de Entrada"
            isActive={activeView === 'Caixa de Entrada'}
            onClick={() => handleNavClick('Caixa de Entrada')}
          />
          <NavItem
            icon={<PaperAirplaneIcon className="w-5 h-5" />}
            label="Enviados"
            isActive={activeView === 'Enviados'}
            onClick={() => handleNavClick('Enviados')}
          />
          <NavItem
            icon={<ArchiveBoxIcon className="w-5 h-5" />}
            label="Arquivados"
            isActive={activeView === 'Arquivados'}
            onClick={() => handleNavClick('Arquivados')}
          />
          <NavItem
            icon={<StarIcon className="w-5 h-5" />}
            label="Favoritos"
            isActive={activeView === 'Favoritos'}
            onClick={() => handleNavClick('Favoritos')}
          />
          <NavItem
            icon={<LockClosedIcon className="w-5 h-5" />}
            label="Sigilosos"
            isActive={activeView === 'Sigilosos'}
            onClick={() => handleNavClick('Sigilosos')}
          />
        </ul>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Ferramentas</p>
         <ul>
          <NavItem
            icon={<PencilSquareIcon className="w-5 h-5" />}
            label="Assinatura Eletrônica"
            isActive={activeView === 'Assinatura Eletrônica'}
            onClick={() => handleNavClick('Assinatura Eletrônica')}
          />
        </ul>
        
        {currentUser.userType === UserType.Admin && (
            <>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-2 px-3">Sistema</p>
                 <ul>
                  <NavItem
                    icon={<Cog6ToothIcon className="w-5 h-5" />}
                    label="Administração"
                    isActive={activeView === 'Administração'}
                    onClick={() => handleNavClick('Administração')}
                  />
                </ul>
            </>
        )}
      </nav>
      
      <div className="mt-auto">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Precisa de Ajuda?</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consulte nossa documentação ou entre em contato com o suporte.</p>
          <button className="mt-3 w-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
            Ver Documentação
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;