'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  // If already authenticated, redirect straight to the main page /home
  useEffect(() => {
    const session = localStorage.getItem('ub_session');
    if (session) {
      router.push('/home');
    } else {
      setCheckingSession(false);
    }
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#150c0a] text-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent-gold" />
        <span className="text-xs uppercase tracking-widest text-primary-cream/60 font-bold">Opening Sanctuary...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#110908] overflow-hidden p-4">
      {/* Background Cinematic coffee pour image overlay with zoom animation */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-[10s] scale-105 hover:scale-100"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#110908]/50 via-[#110908]/85 to-[#0b0403]"></div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-gold/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-gold/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-lg bg-[#1a100e]/80 border border-white/10 backdrop-blur-xl p-8 sm:p-12 rounded-[36px] shadow-2xl relative z-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Brand Stamp Crest */}
        <div className="relative inline-flex items-center justify-center p-4 bg-accent-gold/15 border border-accent-gold/30 rounded-full text-accent-gold shadow-lg hover:rotate-12 transition-transform duration-500 cursor-pointer">
          <Coffee className="h-9 w-9" />
          <div className="absolute inset-0 rounded-full border border-accent-gold/40 animate-ping opacity-25"></div>
        </div>

        {/* Header Text details */}
        <div className="space-y-3">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent-gold block">
            Specialty Roasters & Salon
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Urban Brew
          </h1>
          <div className="w-16 h-0.5 bg-accent-gold mx-auto rounded-full"></div>
          <p className="text-xs text-primary-cream/80 font-light max-w-xs mx-auto leading-relaxed italic">
            "Fresh Coffee. Fresh Moments."
          </p>
        </div>

        <p className="text-[11px] sm:text-xs text-primary-cream/60 max-w-sm mx-auto font-light leading-relaxed">
          Step into a digital sanctuary of organic single-origin roasts, visual table bookings, and loyalty rewards curated daily.
        </p>

        {/* Action Button Pills */}
        <div className="flex flex-col items-center justify-center gap-4 max-w-xs mx-auto pt-2">
          <Link
            href="/auth/signup"
            className="w-full py-3.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2 hover:scale-[1.03]"
          >
            <span>Enter the Sanctuary</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <div className="text-[10px] text-primary-cream/55 tracking-wider font-semibold uppercase pt-2">
            Already registered?{' '}
            <Link href="/auth/login" className="text-accent-gold hover:underline font-bold pl-0.5">
              Log In Here
            </Link>
          </div>
        </div>

        {/* Small badge footer */}
        <div className="pt-4 text-[8px] uppercase tracking-widest text-primary-cream/40 flex items-center justify-center gap-1.5 font-bold select-none border-t border-white/5">
          <Sparkles className="h-3 w-3 text-accent-gold" />
          <span>Voted #1 Specialty Brand 2026</span>
        </div>

      </div>
    </div>
  );
}
