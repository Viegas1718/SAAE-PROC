import React from 'react';
import { ProcessStatus, SignatureStatus, RequestStatus, NotificationStatus, UserType } from '../../types';

interface TagProps {
  status: ProcessStatus | SignatureStatus | RequestStatus | NotificationStatus | UserType;
}

const Tag: React.FC<TagProps> = ({ status }) => {
  const statusStyles: { [key in ProcessStatus | SignatureStatus | RequestStatus | NotificationStatus | UserType]: string } = {
    [ProcessStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [ProcessStatus.Sent]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    [ProcessStatus.Archived]: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    [ProcessStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [SignatureStatus.Pending]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    [SignatureStatus.Signed]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [SignatureStatus.Shared]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    [RequestStatus.Pending]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    [RequestStatus.Received]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    // FIX: Removed duplicate key 'Enviado'. The key was defined for both `ProcessStatus.Sent` and `NotificationStatus.Sent`.
    [NotificationStatus.Read]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [UserType.Internal]: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
    [UserType.Company]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    [UserType.Citizen]: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
    [UserType.Admin]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  };

  const style = statusStyles[status] || 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
};

export default Tag;
