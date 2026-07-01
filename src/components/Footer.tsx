'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Coffee, Phone, Mail, Clock, Send, MessageCircle
} from 'lucide-react';
import { useLanguageCurrency } from '@/context/LanguageCurrencyContext';

export default function Footer() {
  const { t } = useLanguageCurrency();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call to save email
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <footer className="bg-primary-dark text-white border-t border-primary-coffee/20">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-accent-gold rounded-full text-primary-dark">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-primary-cream">
                URBAN<span className="text-accent-gold">BREW</span>
              </span>
            </Link>
            <p className="text-sm text-primary-cream/65 leading-relaxed font-light">
              Crafting premium coffee experiences using organically farmed, master-roasted single-origin beans. Sip into your sweet moment today.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { name: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01', href: 'https://instagram.com' },
                { name: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', href: 'https://facebook.com' },
                { name: 'Youtube', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z', href: 'https://youtube.com' },
                { name: 'Linkedin', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z', href: 'https://linkedin.com' },
                { name: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', href: 'https://twitter.com' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/5 hover:bg-accent-gold hover:text-primary-dark rounded-full text-white/80 transition-all duration-300 transform hover:-translate-y-1"
                  title={social.name}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={social.path} />
                    {social.name === 'Instagram' && <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />}
                    {social.name === 'Linkedin' && <circle cx="4" cy="4" r="2" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details & Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-gold font-serif">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm text-primary-cream/70 font-light">
              <li className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-accent-gold shrink-0" />
                <span>
                  Mon - Fri: 7:00 AM - 10:00 PM <br />
                  Sat - Sun: 8:00 AM - 11:00 PM
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent-gold shrink-0" />
                <a href="tel:+15552345678" className="hover:text-accent-gold transition">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-accent-gold shrink-0" />
                <a 
                  href="https://wa.me/15552345678" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-1 transition"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent-gold shrink-0" />
                <a href="mailto:hello@urbanbrew.com" className="hover:text-accent-gold transition">
                  hello@urbanbrew.com
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-gold font-serif">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm font-light text-primary-cream/70">
              <Link href="/home" className="hover:text-accent-gold transition">Home</Link>
              <Link href="/about" className="hover:text-accent-gold transition">About Us</Link>
              <Link href="/menu" className="hover:text-accent-gold transition">Menu</Link>
              <Link href="/offers" className="hover:text-accent-gold transition">Offers</Link>
              <Link href="/reservations" className="hover:text-accent-gold transition">Reservations</Link>
              <Link href="/gallery" className="hover:text-accent-gold transition">Gallery</Link>
              <Link href="/blog" className="hover:text-accent-gold transition">Blog Posts</Link>
              <Link href="/contact" className="hover:text-accent-gold transition">Contact Us</Link>
              <Link href="/careers" className="hover:text-accent-gold transition">Careers</Link>
              <Link href="/legal/privacy" className="hover:text-accent-gold transition">Privacy Policy</Link>
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-gold font-serif">
              Join the Brew Club
            </h3>
            <p className="text-sm text-primary-cream/65 leading-relaxed font-light">
              Subscribe to receive updates on live events, latte art workshops, secret menus, and loyalty reward benefits.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full text-xs py-2.5 pl-3 pr-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold text-white font-medium placeholder-white/30"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-2 hover:text-accent-gold text-white/80 transition"
                  title="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {success && (
                <p className="text-xs text-green-400 font-semibold">
                  Successfully subscribed! Check your inbox soon.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Subfooter */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-primary-cream/50 leading-relaxed font-light text-center gap-4">
          <p>© {new Date().getFullYear()} Urban Brew Café Ltd. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <Link href="/legal/privacy" className="hover:text-accent-gold transition">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-accent-gold transition">Terms of Service</Link>
            <Link href="/legal/refund" className="hover:text-accent-gold transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
