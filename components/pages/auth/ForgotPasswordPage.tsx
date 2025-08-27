import React, { useState } from 'react';
import Button from '../../ui/Button';

interface ForgotPasswordPageProps {
  onNavigate: (view: 'login') => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code and new password
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending recovery code to:', email);
    setStep(2);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Resetting password with code:', code);
    alert('Senha alterada com sucesso!');
    onNavigate('login');
  };

  const baseInputClasses = `mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
            {step === 1 && (
                <>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Recuperar Senha</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Insira seu e-mail e enviaremos um código de verificação.</p>
                    </div>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input
                                id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className={baseInputClasses}
                            />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full" size="lg">Enviar Código</Button>
                        </div>
                    </form>
                </>
            )}
            {step === 2 && (
                 <>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Verifique seu E-mail</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Insira o código que enviamos e sua nova senha.</p>
                    </div>
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Código de Verificação</label>
                            <input
                                id="code" type="text" required value={code} onChange={(e) => setCode(e.target.value)}
                                className={baseInputClasses}
                            />
                        </div>
                         <div>
                            <label htmlFor="newPassword"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nova Senha</label>
                            <input
                                id="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className={baseInputClasses}
                            />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full" size="lg">Redefinir Senha</Button>
                        </div>
                    </form>
                </>
            )}
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                Lembrou a senha?{' '}
                <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Voltar para o Login
                </button>
            </p>
        </div>
    </div>
  );
};

export default ForgotPasswordPage;