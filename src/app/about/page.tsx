import React from 'react';
import { Award, ShieldCheck, Leaf, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HEADER BANNER */}
      <section className="relative h-[40vh] flex items-center justify-center bg-[#150c0a] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-25"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C110E]/90"></div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">Our Story</h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-cream/70 font-light">
            The heritage of Urban Brew Café: From organic soil to your premium cup.
          </p>
        </div>
      </section>

      {/* 2. OUR JOURNEY (TWO COLUMN TEXT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Since 2020</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white leading-tight">
            Elevating the Coffee Experience
          </h2>
          <p className="text-xs sm:text-sm text-primary-coffee/80 dark:text-primary-cream/70 font-light leading-relaxed">
            Urban Brew Café was founded with a single mission: to create a sanctuary where coffee is not just a drink, but a luxury ritual. We noticed that in the rush of the modern city, people were losing their moments of stillness. We wanted to design a cozy, high-end environment that served the most exquisite specialty coffees, sourced transparently and sustainably.
          </p>
          <p className="text-xs sm:text-sm text-primary-coffee/80 dark:text-primary-cream/70 font-light leading-relaxed">
            Every bean we purchase is direct-trade. We travel directly to farms in Colombia, Ethiopia, Costa Rica, and Indonesia to handshake with local growers, verifying they receive fair pay while enforcing organic farming conditions. This direct link allows us to bring rare, single-origin micro-lots straight to our roastery, ready to be prepared with passion by our certified baristas.
          </p>
        </div>
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl border border-primary-coffee/10 dark:border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop" 
            alt="Hand roasting coffee beans" 
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop'; }}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. CORE MISSION / VALUES */}
      <section className="bg-primary-coffee/5 dark:bg-black/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">What We Stand For</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">
              Our Core Pillars
            </h2>
            <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                Icon: Leaf,
                title: '100% Organic Sourcing',
                desc: 'No chemical pesticides or heavy fertilizers. Our coffee and menu ingredients are sourced from organic agricultural farms.'
              },
              {
                Icon: ShieldCheck,
                title: 'Direct & Fair Trade',
                desc: 'We support local coffee farming communities by buying directly at premium prices, ensuring social and economic stability.'
              },
              {
                Icon: Award,
                title: 'Award-Winning Roasts',
                desc: 'Roasted in-house weekly in micro-batches to extract peak aromatics and chocolatey flavor, checked by certified tasters.'
              },
              {
                Icon: Heart,
                title: 'Gourmet Environment',
                desc: 'Minimal luxury architecture with premium wood-work, warm lighting, and acoustic sessions for optimal relaxation.'
              }
            ].map((pillar, i) => (
              <div 
                key={i}
                className="p-6 bg-white dark:bg-[#201512] rounded-2xl border border-primary-coffee/10 dark:border-white/5 text-center space-y-3 shadow-sm hover:shadow-md transition"
              >
                <div className="p-3 bg-primary-cream dark:bg-white/5 rounded-full inline-block text-accent-gold">
                  <pillar.Icon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-primary-coffee dark:text-white font-serif">{pillar.title}</h4>
                <p className="text-[11px] text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
