'use client';

import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageCircle, Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSentSuccess(true);
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 }
      });
      // Clear
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Reach Out</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white">
          Contact Urban Brew
        </h1>
        <div className="w-16 h-1 bg-accent-gold mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Form Details */}
        <div className="space-y-8 bg-white dark:bg-[#201512] p-6 sm:p-8 rounded-3xl border border-primary-coffee/10 dark:border-white/5 shadow-sm">
          <div>
            <h2 className="text-lg font-bold font-serif text-primary-coffee dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent-gold" />
              <span>Send Us A Message</span>
            </h2>
            <p className="text-[10px] text-primary-coffee/60 dark:text-white/40 leading-relaxed font-light mt-1">
              Have questions regarding franchising, corporate catering, or recipe feedbacks? Drop us a note below!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
              >
                <option value="Feedback">Recipe Feedback</option>
                <option value="Franchise">Franchise Queries</option>
                <option value="Catering">Corporate Catering</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write details of your message here..."
                className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>

          {sentSuccess && (
            <div className="bg-green-500/10 text-green-500 p-3 rounded-xl text-xs font-bold text-center animate-pulse">
              Message Sent Successfully! We will respond within 24 hours.
            </div>
          )}
        </div>

        {/* Right Column: Contact Details & Visual Map */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-primary-dark text-white p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl space-y-6">
            <h3 className="font-serif text-lg font-bold tracking-wide">Contact Details</h3>
            
            <ul className="space-y-4 text-xs font-light text-primary-cream/80">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent-gold shrink-0" />
                <span>456 Premium Brew Avenue, Luxury District</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-gold shrink-0" />
                <a href="tel:+15552345678" className="hover:text-accent-gold transition">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-accent-gold shrink-0" />
                <a 
                  href="https://wa.me/15552345678" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-green-400 font-bold hover:text-green-300 flex items-center gap-1.5 transition"
                >
                  WhatsApp Direct Chat
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-gold shrink-0" />
                <a href="mailto:hello@urbanbrew.com" className="hover:text-accent-gold transition">
                  hello@urbanbrew.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Opening Hours:</strong><br />
                  Mon - Fri: 7:00 AM - 10:00 PM<br />
                  Sat - Sun: 8:00 AM - 11:00 PM
                </span>
              </li>
            </ul>

            {/* Social connections */}
            <div className="flex space-x-3 pt-4 border-t border-white/10">
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
                  className="p-2 bg-white/5 hover:bg-accent-gold hover:text-primary-dark rounded-full text-white/80 transition"
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

          {/* Embed Google Maps */}
          <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-primary-coffee/10 dark:border-white/5 bg-[#f1efe8]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617540458694!2d-73.98785312344795!3d40.74844047138908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="w-full h-full border-none filter grayscale contrast-125 dark:invert"
              loading="lazy"
              title="Google Map Locator"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
