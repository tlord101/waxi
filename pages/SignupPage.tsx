import React, { useState } from 'react';
import { Page } from '../App';
import Logo from '../components/Logo';

interface SignupPageProps {
  onSignup: (name: string, email: string, password: string) => boolean;
  setCurrentPage: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, setCurrentPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    const success = onSignup(name, email, password);
    if (!success) {
      setError('An account with this email already exists.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-black p-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        <div>
          <div className="mx-auto h-12 w-auto flex justify-center">
             <Logo theme="light" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <button onClick={() => setCurrentPage('Login')} className="font-medium text-byd-red hover:text-byd-red-dark">
              sign in to an existing account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
             <div>
              <label htmlFor="email-address-signup" className="sr-only">Email address</label>
              <input
                id="email-address-signup"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password_signup" className="sr-only">Password</label>
              <input
                id="password_signup"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
             <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-byd-red focus:border-byd-red focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-byd-red hover:bg-byd-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-byd-red-dark"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
