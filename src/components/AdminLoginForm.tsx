'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AfroDreamLogo from '@/components/AfroDreamLogo';
import {
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

interface AdminLoginFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

export default function AdminLoginForm({ onSuccess, redirectUrl }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    setIsLoading(true);
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (onSuccess) {
          onSuccess();
        }
        // Sanitize redirectUrl to guarantee an internal relative path (prevents Open Redirect)
        const safeRedirect =
          redirectUrl &&
          redirectUrl.startsWith('/') &&
          !redirectUrl.startsWith('//') &&
          !redirectUrl.includes(':')
            ? redirectUrl
            : '/admin';
        window.location.href = safeRedirect;
        return;
      } else {
        setError(data.message || 'Invalid administrator email or password.');
      }
    } catch {
      setError('Unable to reach the authentication server. Please check your network connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070E18] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#E5A93C]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 max-w-md w-full bg-[#0D1826]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-7 sm:p-9 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <AfroDreamLogo variant="color" size="md" withLink={false} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-[11px] font-bold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Operations Portal</span>
            </div>
            <h1 className="text-2xl font-heading uppercase text-white tracking-wide">
              Administrator Sign In
            </h1>
            <p className="text-xs text-slate-400 font-light mt-1">
              Authorized access only. Enter your credentials to manage operations.
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center space-x-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Enter administrator email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#142234] text-white placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#142234] text-white placeholder-slate-500 text-sm pl-10 pr-11 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 text-sm shadow-lg shadow-brand-blue/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Home Link */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
          <span className="text-[11px] text-slate-500">256-bit SSL</span>
        </div>
      </div>

      {/* Security Disclaimer Note */}
      <p className="relative z-10 text-[11px] text-slate-500 text-center mt-6 max-w-sm">
        Afro Dream Global Logistics Management System &copy; 2026.
        Unauthorized access attempts are monitored and logged.
      </p>
    </div>
  );
}
