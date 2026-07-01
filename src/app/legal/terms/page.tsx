import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3 mb-10">
        <div className="p-3 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold rounded-full inline-block">
          <FileText className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">Terms of Service</h1>
        <p className="text-xs text-primary-coffee/60 dark:text-white/40">Last updated: July 1, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/80 leading-relaxed font-light space-y-6">
        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">1. Ordering and Payments</h2>
        <p>
          By placing an order online via Urban Brew Café, you agree to pay the listed item costs, sales taxes, and delivery fees. Payments are validated securely. In cases of payment failure or duplicate debits, please contact hello@urbanbrew.com.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">2. Table Reservations</h2>
        <p>
          Reservations require accurate contact details. If you need to change your reservation date, time, or visual table selection, please do so at least 2 hours prior to the slot using your dashboard or contact phone number.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">3. Disclaimers</h2>
        <p>
          Ingredients listings (calories, components) are provided for nutritional guides. While we take maximum precautions, allergy cross-contaminations may occur inside our kitchens. Customers with extreme sensitivities should alert servers prior to placing orders.
        </p>
      </div>
    </div>
  );
}
