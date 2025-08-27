import React, { useState, useRef, useEffect } from 'react';
import type { Department, User } from '../../types';
import { BuildingOfficeIcon, ChevronUpDownIcon, CheckIcon } from '../icons/Icons';

interface DepartmentSelectorProps {
  user: User;
  allDepartments: Department[];
  currentDepartmentId: number;
  onDepartmentChange: (departmentId: number) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ user, allDepartments, currentDepartmentId, onDepartmentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentDepartment = allDepartments.find(d => d.id === currentDepartmentId);
  const allowedDepartments = allDepartments.filter(d => user.allowedDepartmentIds.includes(d.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (id: number) => {
    onDepartmentChange(id);
    setIsOpen(false);
  }

  if (!currentDepartment) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <BuildingOfficeIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        <div className="text-left hidden md:block">
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{currentDepartment.organization}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{currentDepartment.acronym}</p>
        </div>
        <ChevronUpDownIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 hidden md:block" />
      </button>

      {isOpen && (
        <div 
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-10 border border-slate-200 dark:border-slate-700"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
        >
          <div className="p-2">
            <p className="px-2 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500">TROCAR LOTAÇÃO</p>
            <ul role="none">
              {allowedDepartments.map(dept => (
                <li key={dept.id} role="none">
                  <button 
                    onClick={() => handleSelect(dept.id)}
                    className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    role="menuitem"
                  >
                    <span>{dept.name} <span className="text-slate-500 dark:text-slate-400">({dept.acronym})</span></span>
                    {/* FIX: Corrected truncated className and completed component structure. */}
                    {dept.id === currentDepartmentId && <CheckIcon className="w-5 h-5 text-blue-600" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSelector;
