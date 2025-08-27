import React, { useState, useRef, useEffect } from 'react';
import type { User, Department } from '../../types';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowRightOnRectangleIcon, SunIcon, MoonIcon } from '../icons/Icons';
import DepartmentSelector from './DepartmentSelector';

interface HeaderProps {
  user: User;
  allDepartments: Department[];
  currentDepartmentId: number;
  onDepartmentChange: (departmentId: number) => void;
  onNavigate: (view: string) => void;
  onSignOut: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, allDepartments, currentDepartmentId, onDepartmentChange, onNavigate, onSignOut, theme, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <header className="bg-white dark:bg-slate-900 h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar processo por número ou assunto..."
            className="bg-slate-100 dark:bg-slate-800 rounded-full py-2 pl-10 pr-4 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        <button onClick={onThemeToggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400" title="Alternar tema">
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        <DepartmentSelector
          user={user}
          allDepartments={allDepartments}
          currentDepartmentId={currentDepartmentId}
          onDepartmentChange={onDepartmentChange}
        />
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700"
            />
            <div className="ml-3 hidden md:block text-left">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border border-slate-200 dark:border-slate-700 animate-fade-in-scale-sm">
              <div className="p-2">
                <button onClick={() => { onNavigate('Meu Perfil'); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
                  <UserCircleIcon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                  Meu Perfil
                </button>
                <div className="my-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <button onClick={onSignOut} className="w-full text-left flex items-center px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:hover:text-red-500">
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale-sm {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale-sm { animation: fade-in-scale-sm 0.1s ease-out forwards; }
      `}</style>
    </header>
  );
};

export default Header;