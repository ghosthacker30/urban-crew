'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, User, Mail, Lock, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('ub_session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/home');
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }, [router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Save the new user in localStorage so login can authenticate them
      const existingUsers: any[] = JSON.parse(localStorage.getItem('ub_users') || '[]');
      const alreadyExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (alreadyExists) {
        setErrorMsg('An account with this email already exists. Please log in.');
        setLoading(false);
        return;
      }

      existingUsers.push({ name, email, password, role: 'USER' });
      localStorage.setItem('ub_users', JSON.stringify(existingUsers));

      setLoading(false);
      setSuccess(true);

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        router.push('/auth/login?registered=true');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#201512] w-full max-w-md rounded-3xl overflow-hidden shadow-xl border border-primary-coffee/10 dark:border-white/5 p-6 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-accent-gold/15 text-accent-gold border border-accent-gold/30 rounded-full inline-block">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary-coffee dark:text-white">
            Create Account
          </h1>
          <p className="text-[10px] text-primary-coffee/60 dark:text-white/40">
            Join the Rewards Club. Get a free butter croissant on your first order.
          </p>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="p-3 bg-green-500/15 text-green-500 rounded-full inline-block">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-primary-coffee dark:text-white">Account Created!</h3>
            <p className="text-xs text-primary-coffee/60 dark:text-white/45 max-w-xs mx-auto">
              Welcome to Urban Brew. Redirecting you to the catalog floor...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-coffee/40 dark:text-white/30" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-coffee/40 dark:text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-primary-cream/35 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Password</label>
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
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] text-primary-coffee/50 dark:text-white/40 pt-4 border-t border-primary-coffee/10 dark:border-white/5">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="text-accent-gold font-bold hover:underline">Login</Link>
        </div>

      </div>
    </div>
  );
}
