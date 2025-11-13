import React, { useState } from 'react';
// FIX: Import Page from types.ts to break circular dependency.
import { Page } from '../types';
import Logo from '../components/Logo';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<string>;
  onGoogleSignIn: () => void;
  setCurrentPage: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoogleSignIn, setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await onLogin(email, password);
    if (result !== 'success') {
      setError(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-black p-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
            <Logo theme="light" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <button onClick={() => setCurrentPage('Signup')} className="font-medium text-byd-red hover:text-byd-red-dark">
              create a new account
            </button>
          </p>
        </div>
        <div className="space-y-6">
          <button
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 68.7C305.8 97.4 278.2 82 248 82c-73.4 0-133.4 59.9-133.4 133.4s60 133.4 133.4 133.4c77.8 0 112.5-52.5 116.5-79.9H248v-65.7h239.5c1.4 11.2 2.5 22.8 2.5 34.6z"></path></svg>
            Sign in with Google
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                Or continue with
                </span>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleUserLogin}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password_login" className="sr-only">Password</label>
              <input
                id="password_login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-byd-red hover:bg-byd-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-byd-red-dark disabled:bg-byd-red/50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;