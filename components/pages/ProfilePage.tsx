import React, { useState } from 'react';
import type { User, Department, ConnectedDevice } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { UserCircleIcon, AtSymbolIcon, PhoneIcon, MapPinIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '../icons/Icons';

interface ProfilePageProps {
  user: User;
  department?: Department;
  onUpdateUser: (user: User) => void;
  onSignOutDevice: (deviceId: string) => void;
}

const ProfileInput: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}> = ({ icon, label, value, onChange, placeholder, disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`block w-full rounded-md border-slate-300 dark:border-slate-600 py-2 pl-10 pr-3 text-sm shadow-sm
                           focus:border-blue-500 focus:ring-blue-500
                           ${disabled ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}
            />
        </div>
    </div>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ user, department, onUpdateUser, onSignOutDevice }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({
            ...user,
            name,
            email,
            phone,
            address,
        });
    };

    const DeviceItem: React.FC<{ device: ConnectedDevice, onSignOut: () => void }> = ({ device, onSignOut }) => (
        <li className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center">
                {device.type === 'desktop' ? <ComputerDesktopIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" /> : <DevicePhoneMobileIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />}
                <div className="ml-4">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{device.browser} on {device.os}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.location} - Último acesso: {device.lastAccess}</p>
                </div>
            </div>
            {device.isCurrent ? (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full dark:bg-green-900/50 dark:text-green-300">Dispositivo Atual</span>
            ) : (
                <Button variant="danger" size="sm" onClick={onSignOut}>
                    Desconectar
                </Button>
            )}
        </li>
    );

  return (
    <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Meu Perfil</h1>
        <div className="space-y-8">
            <form onSubmit={handleSubmit}>
                <Card className="overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center space-x-4">
                             <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-700 shadow-md"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
                                <Button variant="secondary" size="sm" className="mt-2">
                                    Trocar foto
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Dados Pessoais */}
                        <section>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileInput
                                    icon={<UserCircleIcon className="h-5 w-5 text-slate-400" />}
                                    label="Nome Completo"
                                    value={name}
                                    onChange={setName}
                                />
                                 <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Cargo</label>
                                    <p className="text-sm text-slate-800 dark:text-slate-100 p-2">{user.role}</p>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Setor Responsável</label>
                                    <p className="text-sm text-slate-800 dark:text-slate-100 p-2">{department?.name ?? 'Não definido'}</p>
                                </div>
                            </div>
                        </section>
                        
                         {/* Informações de Contato */}
                        <section>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Informações de Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <ProfileInput
                                    icon={<AtSymbolIcon className="h-5 w-5 text-slate-400" />}
                                    label="Email"
                                    value={email}
                                    onChange={setEmail}
                                />
                                 <ProfileInput
                                    icon={<PhoneIcon className="h-5 w-5 text-slate-400" />}
                                    label="Telefone"
                                    value={phone}
                                    onChange={setPhone}
                                />
                            </div>
                        </section>

                        {/* Endereço */}
                        <section>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Endereço</h3>
                            <div className="grid grid-cols-1">
                                 <ProfileInput
                                    icon={<MapPinIcon className="h-5 w-5 text-slate-400" />}
                                    label="Endereço Completo"
                                    value={address}
                                    onChange={setAddress}
                                />
                            </div>
                        </section>
                    </div>
                    
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <Button type="submit" size="md">
                            Salvar Alterações
                        </Button>
                    </div>
                </Card>
            </form>

            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Dispositivos Conectados</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Esta é uma lista de dispositivos que acessaram sua conta. Desconecte as sessões que você não reconhece.</p>
                    {user.connectedDevices.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {user.connectedDevices.map(device => (
                                <DeviceItem key={device.id} device={device} onSignOut={() => onSignOutDevice(device.id)} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">Nenhum dispositivo conectado encontrado.</p>
                    )}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default ProfilePage;