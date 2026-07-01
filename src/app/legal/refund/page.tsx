import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3 mb-10">
        <div className="p-3 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold rounded-full inline-block">
          <RefreshCw className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-5xl font-serif font-bold text-primary-coffee dark:text-white">Refund Policy</h1>
        <p className="text-xs text-primary-coffee/60 dark:text-white/40">Last updated: July 1, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/80 leading-relaxed font-light space-y-6">
        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">1. Perishable Items (Coffee & Bakery)</h2>
        <p>
          Due to the fresh, perishable nature of our specialty coffees and baked items, we do not accept returns or offer refunds for completed orders once they leave our cafe bar or have been marked delivered. However, if there was an order preparing error or quality defect, please alert us immediately at +1 (555) 234-5678, and we will issue a replacement or store credit.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">2. Table Booking Fees</h2>
        <p>
          Standard table reservations are free of charge. If we initiate table booking fees for special events (e.g. cupping masterclass or live acoustic sessions), tickets are refundable up to 24 hours prior to the event starting.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">3. Processing Refunds</h2>
        <p>
          Approved refunds are processed back to the original payment source (Stripe, Razorpay, or UPI gateway) within 5 to 7 bank business days.
        </p>
      </div>
    </div>
  );
}
