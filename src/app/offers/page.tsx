'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Gift, Coins, Share2, Sparkles, UserPlus } from 'lucide-react';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const loyaltyTiers = [
    { title: 'Bronze Member', points: '0 - 199 pts', perk: 'Free extra shot of espresso on birthdays, 5% point cashback on orders.' },
    { title: 'Silver Member', points: '200 - 499 pts', perk: 'Free beverage sizes upgrades, double point rewards on weekends.' },
    { title: 'Gold Reserve', points: '500+ pts', perk: 'Priority table reservations, invitation to private cuppings, 15% point cashback.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Page Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Urban Brew Club</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white">
          Exclusive Offers & Rewards
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-coffee/60 dark:text-white/50 font-light">
          Enjoy premium moments at a special value. Apply promo codes in your cart, join our loyalty program, or gift your friends.
        </p>
      </div>

      {/* 2. Coupons Grid */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary-coffee dark:text-white flex items-center gap-2">
          <Tag className="h-5 w-5 text-accent-gold" />
          <span>Active Promo Coupons</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              code: 'BREW20',
              discount: '20% OFF',
              minSpend: '$15.00 min purchase',
              desc: 'Enjoy a premium discount across all hot and cold coffee crafts on your cart.',
              tag: 'Best Seller'
            },
            {
              code: 'WELCOME10',
              discount: 'FLAT $10 OFF',
              minSpend: '$25.00 min purchase',
              desc: 'Our welcome gift to you. Applies to any menu items including breakfasts and lunch.',
              tag: 'New User'
            },
            {
              code: 'GOLDENHOUR',
              discount: '15% OFF',
              minSpend: '$10.00 min purchase',
              desc: 'Brew your mornings correctly. Valid for all orders placed between 8:00 AM and 11:00 AM.',
              tag: 'Morning Special'
            }
          ].map((promo) => (
            <div 
              key={promo.code} 
              className="p-6 bg-white dark:bg-[#201512] rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm relative group overflow-hidden"
            >
              <span className="absolute top-0 right-0 bg-accent-gold text-primary-dark font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-bl-xl shadow-sm">
                {promo.tag}
              </span>
              <div className="space-y-4">
                <span className="text-2xl font-serif font-black text-primary-coffee dark:text-white block">
                  {promo.discount}
                </span>
                <p className="text-xs text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light">
                  {promo.desc}
                </p>
                <div className="text-[10px] text-primary-coffee/50 dark:text-white/40 font-bold uppercase tracking-wider">
                  {promo.minSpend}
                </div>
                
                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(promo.code)}
                  className="w-full flex items-center justify-center space-x-2 py-2 border border-dashed border-primary-coffee/30 dark:border-white/20 hover:border-accent-gold text-xs font-bold rounded-xl transition bg-primary-cream/25 dark:bg-black/10 text-primary-coffee dark:text-white"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Code: {promo.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Loyalty Program Details */}
      <section className="bg-primary-coffee/5 dark:bg-black/20 p-8 sm:p-12 rounded-3xl border border-primary-coffee/10 dark:border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="p-3 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold inline-flex rounded-full">
            <Coins className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-coffee dark:text-white leading-tight">
            Urban Loyalty Rewards
          </h2>
          <p className="text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/70 font-light leading-relaxed">
            Every sip earns you reward points. For every $1.00 spent, you earn 1 reward point. Redeem points during checkout for free espresso cups, croissants, or custom hazelnut milkshakes.
          </p>
          <div className="space-y-4">
            {loyaltyTiers.map((tier, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="p-1.5 bg-accent-gold rounded-full text-primary-dark shrink-0 font-serif font-bold text-xs mt-0.5">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-primary-coffee dark:text-white uppercase tracking-wider">
                    {tier.title} ({tier.points})
                  </h4>
                  <p className="text-[11px] text-primary-coffee/70 dark:text-primary-cream/65 leading-relaxed font-light">
                    {tier.perk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg border border-primary-coffee/10 dark:border-white/5 bg-[#150c0a] flex items-center justify-center p-8 text-center text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-25"></div>
          <div className="relative z-10 space-y-4">
            <Sparkles className="h-10 w-10 text-accent-gold mx-auto animate-pulse" />
            <h3 className="text-lg font-serif font-bold">Start Earning Points</h3>
            <p className="text-xs text-primary-cream/70 leading-relaxed font-light max-w-xs mx-auto">
              Create an account or login during checkout. Points are tracked automatically to your profile.
            </p>
            <div className="pt-2">
              <a href="/auth/signup" className="px-6 py-2 bg-accent-gold text-primary-dark text-xs font-bold rounded-full hover:bg-accent-gold/90 transition shadow">
                Join Rewards Club
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Gift Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-accent-gold/30 bg-[#251512] flex flex-col justify-between p-6 sm:p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-accent-gold" />
              <span className="font-serif tracking-wider font-extrabold text-sm uppercase">Urban Brew Card</span>
            </div>
            <span className="text-xl font-bold font-serif text-accent-gold">$100</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[8px] text-white/50 uppercase tracking-widest">Cardholder ID</span>
            <span className="block text-xs font-mono font-bold tracking-widest">UB-9402-1823-9922</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-3 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold inline-flex rounded-full">
            <Gift className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-coffee dark:text-white leading-tight">
            Purchase a Gift Card
          </h2>
          <p className="text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/70 font-light leading-relaxed">
            Surprise your loved ones with the gift of specialty coffee. Choose a denomination ($25, $50, $100, $250) and email it directly as a digital barcode QR coupon.
          </p>
          <div className="flex gap-2">
            {['$25', '$50', '$100', '$250'].map((val) => (
              <button 
                key={val}
                className="flex-1 py-2 text-xs font-bold border border-primary-coffee/20 dark:border-white/10 hover:border-accent-gold rounded-xl transition text-primary-coffee dark:text-white"
              >
                {val}
              </button>
            ))}
          </div>
          <button className="px-6 py-2.5 bg-accent-gold text-primary-dark font-black text-xs rounded-full hover:bg-accent-gold/90 transition shadow">
            Purchase Gift Voucher
          </button>
        </div>
      </section>

      {/* 5. Referral System */}
      <section className="bg-primary-coffee/5 dark:bg-black/20 p-8 sm:p-12 rounded-3xl border border-primary-coffee/10 dark:border-white/5 flex flex-col md:flex-row gap-8 justify-between items-center text-center md:text-left">
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-serif text-primary-coffee dark:text-white flex items-center gap-2 justify-center md:justify-start">
            <UserPlus className="h-5 w-5 text-accent-gold" />
            <span>Refer a Coffee Friend</span>
          </h3>
          <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/65 max-w-xl font-light">
            Share your unique invite link. When your friend places their first online order or reserves a table, they receive a free butter croissant, and you receive $5.00 credit (50 points) directly.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-primary-coffee hover:bg-primary-coffee/95 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 shrink-0">
          <Share2 className="h-4 w-4" />
          <span>Copy Invite Link</span>
        </button>
      </section>

    </div>
  );
}
