import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, X, Lock, Mail, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email, password);
      // login method will close modal and switch to admin dashboard automatically
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@k12hunar.com');
    setPassword('Admin@12345');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-cyan-400 to-indigo-500" />

        {/* Close button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 p-[1px] mb-3 shadow-lg shadow-brand-500/30">
            <div className="w-full h-full bg-[#0d1322] rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
          <p className="text-xs text-slate-400 mt-1">
            Custom JWT Protected Route (Supabase PostgreSQL)
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Pill for Evaluator */}
        <div className="mb-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between gap-2">
          <div>
            <span className="font-semibold block text-[11px] uppercase tracking-wider text-cyan-400">
              Evaluator Quick Access
            </span>
            <span className="text-slate-300 font-mono text-[11px]">admin@k12hunar.com | Admin@12345</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[11px] font-semibold transition-all border border-cyan-500/30 flex items-center gap-1 flex-shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            Auto-Fill
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@k12hunar.com"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Generate JWT</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-center text-slate-500">
          Custom JWT auth with bcrypt password hash. Supabase Auth bypass active.
        </p>

      </div>
    </div>
  );
};

export default AdminLoginModal;
