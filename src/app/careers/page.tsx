'use client';

import React, { useState } from 'react';
import { Award, Briefcase, FileText, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CareersPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Specialty Barista');
  const [resumeName, setResumeName] = useState('');
  const [cover, setCover] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const jobs = [
    { title: 'Specialty Barista', type: 'Full-time / Part-time', location: 'Flagship Salon', salary: '$18 - $24 / hr', desc: 'Craft micro-foam latte arts and operate high-end espresso machinery. Requires 1+ year specialty coffee experience.' },
    { title: 'Head Pastry Chef', type: 'Full-time', location: 'Central Kitchen', salary: '$55,000 - $65,000 / yr', desc: 'Oversee morning baking operations for butter croissants, cheesecakes, and chocolate tarts. Requires culinary degree.' },
    { title: 'Shift Supervisor', type: 'Full-time', location: 'Flagship Salon', salary: '$22 - $28 / hr', desc: 'Lead front-of-house staff, coordinate table reservation slots, and handle daily payment reconciliations.' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !resumeName) {
      alert('Please fill out details and upload a simulated resume file.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 }
      });
      // reset
      setName('');
      setEmail('');
      setPhone('');
      setResumeName('');
      setCover('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold">Work With Us</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-primary-coffee dark:text-white">
          Join the Brew Team
        </h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-primary-coffee/60 dark:text-white/50 font-light">
          Build your career in specialty coffee. We offer premium training, health benefits, and flexible work timings.
        </p>
      </div>

      {/* 2. Open Positions */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary-coffee dark:text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-accent-gold" />
          <span>Open Openings</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div 
              key={job.title} 
              className="p-6 bg-white dark:bg-[#201512] rounded-2xl border border-primary-coffee/10 dark:border-white/5 shadow-sm space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase bg-accent-gold/15 text-accent-gold px-2 py-0.5 rounded-full inline-block">
                  {job.type}
                </span>
                <h3 className="text-base font-bold font-serif text-primary-coffee dark:text-white">
                  {job.title}
                </h3>
                <div className="text-[10px] text-primary-coffee/50 dark:text-white/40 font-bold">
                  {job.location} | {job.salary}
                </div>
              </div>
              <p className="text-xs text-primary-coffee/75 dark:text-primary-cream/65 leading-relaxed font-light">
                {job.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Apply Form */}
      <section className="max-w-3xl mx-auto bg-white dark:bg-[#201512] p-6 sm:p-8 rounded-3xl border border-primary-coffee/10 dark:border-white/5 shadow-md space-y-6">
        <div>
          <h2 className="text-lg font-bold font-serif text-primary-coffee dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent-gold" />
            <span>Submit Application</span>
          </h2>
          <p className="text-[10px] text-primary-coffee/60 dark:text-white/40 leading-relaxed font-light mt-1">
            Fill out your details and upload your PDF resume to start the screening process.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="p-3 bg-green-500/15 text-green-500 rounded-full inline-block">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-bold text-primary-coffee dark:text-white">Application Received!</h3>
            <p className="text-xs text-primary-coffee/60 dark:text-white/40 max-w-sm mx-auto">
              Thank you for applying. Our talent coordinator will review your profile and reach out via email shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="text-xs font-bold text-accent-gold underline hover:text-accent-gold/90"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Full Name</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Position of Interest</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold"
                >
                  <option value="Specialty Barista">Specialty Barista</option>
                  <option value="Head Pastry Chef">Head Pastry Chef</option>
                  <option value="Shift Supervisor">Shift Supervisor</option>
                </select>
              </div>
            </div>

            {/* Resume Upload (Simulated file click picker) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Upload Resume (PDF/Word)</label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-primary-coffee text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-primary-coffee/90 transition shadow-sm shrink-0">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-primary-coffee/60 dark:text-white/45 truncate">
                  {resumeName || 'No file selected (Required)'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-coffee/60 dark:text-white/40 uppercase">Cover Letter / Note</label>
              <textarea
                rows={3}
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="Why do you want to brew with us? Share brief details..."
                className="w-full text-xs font-medium p-2.5 bg-primary-cream/30 dark:bg-white/5 border border-primary-coffee/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-accent-gold resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Submitting Profile...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
