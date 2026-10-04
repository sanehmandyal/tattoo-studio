import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter admin credentials');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res?.success) {
      if (res.user.role === 'admin') {
        toast.success('Welcome to Studio Master Control, ' + (res.user.name || 'Admin'));
        navigate('/admin');
      } else {
        // Reject non-admin users
        logout();
        toast.error('Access Denied: Only studio administrators are permitted to sign in.');
      }
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-studio-bg flex items-center justify-center px-4 lg:pl-12">
      <Helmet>
        <title>Master Studio Control Access — LAND OF GOD TATTOO STUDIO</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-md w-full glass-panel-dark p-8 rounded-2xl border border-studio-bronze/60 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ancient subtle header accent */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-studio-bronze/40 to-black/90 border border-studio-gold/60 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-6 h-6 text-studio-gold" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-studio-bronzeLight">
            ॥ RESTRICTED MASTER ACCESS ॥
          </span>
          <h1 className="ancient-carved-heading text-2xl font-black uppercase tracking-wider text-studio-textMain">
            Studio Master Portal
          </h1>
          <p className="text-xs text-studio-textMuted font-serif">
            Authorized administrator access for Land of God Tattoo Studio. Clients can explore artworks and book directly via WhatsApp without requiring an account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1.5 font-display tracking-wider">
              Admin Email / Identifier
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-studio-textMuted absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="Enter admin identifier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border focus:border-studio-gold rounded pl-9 pr-3 py-2 text-xs text-studio-textMain focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-studio-textMuted uppercase mb-1.5 font-display tracking-wider">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-studio-textMuted absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-studio-secondary border border-studio-border focus:border-studio-gold rounded pl-9 pr-3 py-2 text-xs text-studio-textMain focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-studio-bronze to-amber-700 hover:from-amber-600 hover:to-studio-bronze text-white font-display font-bold py-3 text-xs uppercase tracking-[0.2em] rounded shadow-lg transition-all border border-amber-400/30 flex items-center justify-center gap-2"
          >
            {submitting ? 'Verifying Authority...' : 'Enter Master Control'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-studio-textMuted/70 border-t border-studio-border/20 pt-3">
          <Link to="/" className="text-studio-bronzeLight hover:text-studio-gold transition-colors">
            ← Return to Public Studio Sanctum
          </Link>
        </div>
      </div>
    </div>
  );
};
