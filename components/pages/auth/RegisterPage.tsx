import React, { useState } from 'react';
import Button from '../../ui/Button';

interface RegisterPageProps {
  onNavigate: (view: 'login') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call
    console.log('Registering user:', { name, email, cpfCnpj, phone, address });
    setIsSubmitted(true);
  };
  
  const baseInputClasses = `mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

  const FormInput: React.FC<{label: string, id: string, type: string, value: string, onChange: (val: string) => void, required?: boolean, placeholder?: string}> = 
  ({ label, id, type, value, onChange, required = true, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <input
            id={id} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
        />
    </div>
  );


  if (isSubmitted) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verifique seu E-mail</h2>
                 <p className="text-slate-600 dark:text-slate-300">
                    Enviamos um link de ativação para <span className="font-semibold text-slate-800 dark:text-slate-100">{email}</span>. 
                    Por favor, clique no link para ativar sua conta.
                 </p>
                 <Button onClick={() => onNavigate('login')} className="w-full" size="lg">Voltar para o Login</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 py-12">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Crie sua Conta</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">É rápido e fácil.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <fieldset className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-md">
                        <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">Dados Pessoais</legend>
                        <FormInput label="Nome Completo" id="name" type="text" value={name} onChange={setName} placeholder="Seu nome completo" />
                        <FormInput label="CPF ou CNPJ" id="cpfCnpj" type="text" value={cpfCnpj} onChange={setCpfCnpj} placeholder="000.000.000-00 ou 00.000.000/0001-00" />
                    </fieldset>

                     <fieldset className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-md">
                        <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">Informações de Contato</legend>
                        <FormInput label="Telefone" id="phone" type="tel" value={phone} onChange={setPhone} placeholder="(00) 00000-0000" />
                        <FormInput label="Endereço Completo" id="address" type="text" value={address} onChange={setAddress} placeholder="Rua, número, bairro, cidade, estado" />
                    </fieldset>

                     <fieldset className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-md">
                        <legend className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">Dados de Acesso</legend>
                        <FormInput label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="seu.email@exemplo.com" />
                        <FormInput label="Senha" id="password" type="password" value={password} onChange={setPassword} placeholder="Crie uma senha forte"/>
                    </fieldset>
                </div>
                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg">Cadastrar</Button>
                </div>
            </form>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                Já tem uma conta?{' '}
                <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Faça o login
                </button>
            </p>
        </div>
    </div>
  );
};

export default RegisterPage;