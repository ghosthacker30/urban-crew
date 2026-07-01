import React from 'react';
import Link from 'next/link';
import { Coffee, RotateCcw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      
      {/* Visual icon */}
      <div className="p-5 bg-accent-gold/15 text-accent-gold border border-accent-gold/30 rounded-full inline-block animate-bounce">
        <Coffee className="h-14 w-14" />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-serif font-black text-primary-coffee dark:text-white">404</h1>
        <h2 className="text-xl font-bold font-serif text-primary-coffee/95 dark:text-white/90">Brew Not Found!</h2>
        <p className="text-xs text-primary-coffee/60 dark:text-white/40 max-w-sm mx-auto leading-relaxed">
          The coffee flavor profile or page layout you are looking for has been moved or is currently out of season.
        </p>
      </div>

      <div className="pt-4">
        <Link 
          href="/" 
          className="px-6 py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-full transition shadow-md inline-flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Return to Salon</span>
        </Link>
      </div>

    </div>
  );
}
