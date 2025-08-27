import React, { useState, useMemo } from 'react';
import type { Process } from '../types';
import Tag from './ui/Tag';
import { StarIcon, LockClosedIcon, ChevronUpDownIcon } from './icons/Icons';

interface ProcessTableProps {
  title: string;
  processes: Process[];
  onSelectProcess: (process: Process) => void;
}

const ProcessTableRow: React.FC<{ process: Process; onSelect: () => void; }> = ({ process, onSelect }) => {
  return (
    <tr onClick={onSelect} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-150">
      <td className="py-4 px-6 text-sm font-medium text-slate-800 dark:text-slate-100">
        {process.id}
        <div className="flex items-center mt-1">
          {process.isFavorite && <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />}
          {process.isConfidential && <LockClosedIcon className="w-4 h-4 text-red-500" />}
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-medium text-slate-800 dark:text-slate-100">{process.requester}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">CPF: {process.requesterCPF}</p>
      </td>
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate" title={process.subject}>
        {process.subject}
      </td>
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{process.department.name}</td>
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">{process.lastMoved}</td>
      <td className="py-4 px-6">
        <Tag status={process.status} />
      </td>
    </tr>
  );
};

const ProcessTable: React.FC<ProcessTableProps> = ({ title, processes, onSelectProcess }) => {
  type SortableKeys = 'id';
  type SortConfig = { key: SortableKeys; direction: 'ascending' | 'descending' } | null;

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedProcesses = useMemo(() => {
    let sortableItems = [...processes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [processes, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {processes.length > 0
            ? `Exibindo ${processes.length} processo(s).`
            : 'Nenhum processo encontrado nesta caixa.'
          }
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                 <button className="flex items-center group" onClick={() => requestSort('id')}>
                    Nº Processo
                    <ChevronUpDownIcon className="w-4 h-4 ml-1 text-slate-400 group-hover:text-slate-300" />
                </button>
              </th>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Requerente
              </th>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assunto
              </th>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Departamento Atual
              </th>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Última Mov.
              </th>
              <th scope="col" className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
            {sortedProcesses.map((process) => (
              <ProcessTableRow
                key={process.id}
                process={process}
                onSelect={() => onSelectProcess(process)}
              />
            ))}
          </tbody>
        </table>
        {processes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Não há processos para exibir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTable;