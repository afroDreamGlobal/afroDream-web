'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AfroDreamLogo from '@/components/AfroDreamLogo';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@afrodreamglobal.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple demo authentication matching configured env credentials
    if (
      (email === 'admin@afrodreamglobal.com' && password === 'admin123') ||
      (email === 'admin@afrodreamglobal.com' && password === 'AfroDream2026!Secure')
    ) {
      // Set admin session cookie
      document.cookie = `adg_admin_token=active_session_${Date.now()}; path=/; max-age=86400`;
      router.push('/admin');
    } else {
      setError('Invalid administrator email or password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#091422] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-dark border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <AfroDreamLogo variant="white" size="md" withLink={false} />
          </div>
          <h1 className="text-2xl font-heading uppercase text-white tracking-wider">
            ADMINISTRATOR PORTAL
          </h1>
          <p className="text-xs text-gray-400 font-light">
            Authorized logistics management & content administration
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#182638] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-[#273F5B] focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#182638] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg border border-[#273F5B] focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#182638] border border-[#273F5B]/70 text-[11px] text-gray-400">
            <span className="font-semibold text-brand-blue">Default Credentials: </span>
            admin@afrodreamglobal.com / admin123
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
