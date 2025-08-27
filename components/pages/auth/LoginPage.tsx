import React, { useState } from 'react';
import Button from '../../ui/Button';

interface LoginPageProps {
    onLogin: (email: string, pass: string) => void;
    onNavigate: (view: 'register' | 'forgot-password') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    const baseInputClasses = `mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100
                               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 ml-4">SAAE-proc</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">Acesse o sistema de processos eletrônicos</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={baseInputClasses}
                            placeholder="seu.email@empresa.com"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            <div className="text-sm">
                                <button type="button" onClick={() => onNavigate('forgot-password')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Esqueceu sua senha?
                                </button>
                            </div>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                             className={baseInputClasses}
                            placeholder="Sua senha"
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full" size="lg">Entrar</Button>
                    </div>
                </form>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                    Não tem uma conta?{' '}
                    <button onClick={() => onNavigate('register')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Cadastre-se
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;