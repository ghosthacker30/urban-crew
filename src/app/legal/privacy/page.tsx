import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3 mb-10">
        <div className="p-3 bg-accent-gold/15 border border-accent-gold/30 text-accent-gold rounded-full inline-block">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary-coffee dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-primary-coffee/60 dark:text-white/40">Last updated: July 1, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-primary-coffee/85 dark:text-primary-cream/80 leading-relaxed font-light space-y-6">
        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">1. Information We Collect</h2>
        <p>
          At Urban Brew Café, we collect personal information necessary to manage reservations, order transactions, payment validations, and general correspondence. This includes your name, email address, physical billing address, telephone number, and payment option tokens.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">2. How We Use Your Information</h2>
        <p>
          We use your personal details strictly to process online orders, verify reservation slots, administer loyalty rewards club points, and notify you regarding order delivery statuses or store promotions. We do not sell or trade your details with third-party advertising companies.
        </p>

        <h2 className="text-base font-bold text-primary-coffee dark:text-white font-serif">3. Security</h2>
        <p>
          We enforce enterprise-grade security protocols including TLS/SSL data transmission encryption, bcrypt password hashing, and secure HTTPOnly/SameSite session cookies to safeguard customer accounts against database intrusions and cross-site scripting vulnerabilities.
        </p>
      </div>
    </div>
  );
}
