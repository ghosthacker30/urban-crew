'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, Mail, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        setRegisteredSuccess(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Check hardcoded seed accounts first
      if (email === 'admin@urbanbrew.com' && password === 'admin123') {
        const session = { name: 'Brew Master', role: 'ADMIN', email: 'admin@urbanbrew.com' };
        localStorage.setItem('ub_session', JSON.stringify(session));
        confetti({ particleCount: 60, spread: 40 });
        router.push('/admin');
        setTimeout(() => window.location.reload(), 100);
        return;
      }
      if (email === 'customer@urbanbrew.com' && password === 'customer123') {
        const session = { name: 'Shardul', role: 'USER', email: 'customer@urbanbrew.com' };
        localStorage.setItem('ub_session', JSON.stringify(session));
        confetti({ particleCount: 60, spread: 40 });
        router.push('/home');
        setTimeout(() => window.location.reload(), 100);
        return;
      }

      // Check registered users saved by the signup form
      const registeredUsers: any[] = JSON.parse(localStorage.getItem('ub_users') || '[]');
      const found = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (found) {
        const session = { name: found.name, role: found.role || 'USER', email: found.email };
        localStorage.setItem('ub_session', JSON.stringify(session));
        confetti({ particleCount: 60, spread: 40 });
        router.push('/home');
        setTimeout(() => window.location.reload(), 100);
      } else {
        setErrorMsg('Invalid email or password. If you just registered, make sure you use the same credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#201512] w-full max-w-md rounded-3xl overflow-hidden shadow-xl border border-primary-coffee/10 dark:border-white/5 p-6 sm:p-10 space-y-6">
        
        {registeredSuccess && (
          <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 animate-bounce">
            <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            <p>Account created successfully! Please log in to enter the sanctuary.</p>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-accent-gold/15 text-accent-gold border border-accent-gold/30 rounded-full inline-block">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary-coffee dark:text-white">
            Login to Urban Brew
          </h1>
          <p className="text-[10px] text-primary-coffee/60 dark:text-white/40">
            Welcome back! Enter credentials to manage orders and rewards.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-coffee/40 dark:text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@urbanbrew.com"
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Password</label>
              <Link href="/auth/forgot" className="text-[10px] font-bold text-accent-gold hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-coffee/40 dark:text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs font-mono pl-10 pr-4 py-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Secure Login</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-[10px] text-primary-coffee/50 dark:text-white/40 pt-4 border-t border-primary-coffee/10 dark:border-white/5">
          <span>Don't have an account? </span>
          <Link href="/auth/signup" className="text-accent-gold font-bold hover:underline">Create Account</Link>
        </div>

      </div>
    </div>
  );
}
