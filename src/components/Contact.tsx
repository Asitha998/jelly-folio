import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Twitter, Linkedin, Terminal, Send, Check, Copy, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Theme } from '../types';
import { soundEngine } from '../services/soundEngine';

interface ContactProps {
  theme: Theme;
}

export const Contact: React.FC<ContactProps> = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Full-Stack Architecture',
    message: '',
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    soundEngine.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playBlobBounce();
    setIsSubmitting(true);

    setTimeout(() => {
      soundEngine.playSuccess();
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', type: 'Full-Stack Architecture', message: '' });
      }, 4000);
    }, 1000);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      {/* Environmental Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#35D07F]/[0.025] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-3 ${
            theme === 'dark'
              ? 'bg-white/[0.04] text-slate-200 border border-white/[0.04]'
              : 'bg-black/[0.03] text-[#181c19] border border-black/[0.03]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
            Let’s Build Resilient Software.
          </h2>
          <p className="text-[#6e7670] dark:text-[#9ea8a0] text-sm sm:text-base mt-2 leading-relaxed">
            Currently discussing senior engineering roles, distributed systems consulting, and high-performance web applications.
          </p>
        </div>

        {/* Contact Container (Floating Glass Panels) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info & Direct Channels */}
          <div
            className={`lg:col-span-5 rounded-[24px] p-8 ${
              theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
            } space-y-8`}
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#35D07F] font-semibold">
                Direct Contact
              </span>
              <h3 className={`text-2xl font-bold tracking-tight mt-1 mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                Start a Conversation.
              </h3>
              <p className="text-xs sm:text-sm text-[#6e7670] dark:text-[#a1a1a6] leading-relaxed">
                Whether you need assistance architecting a distributed system, optimizing Core Web Vitals across a large codebase, or implementing clean, tactile interfaces — send a message.
              </p>
            </div>

            {/* Copy Email Pill Button */}
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#35D07F]/10 flex items-center justify-center text-[#35D07F]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-[#6e7670] dark:text-slate-400 font-mono">Email Directly</div>
                  <div className={`text-xs sm:text-sm font-semibold font-mono ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                    {PERSONAL_INFO.email}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={copyEmail}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                className={`p-2.5 rounded-full cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white text-[#181c19] shadow-sm hover:bg-slate-50'
                }`}
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-[#35D07F]" /> : <Copy className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Social Channels */}
            <div>
              <div className="text-xs font-semibold text-[#6e7670] dark:text-slate-400 uppercase tracking-wider mb-3">
                Developer Profiles
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'GitHub', icon: <Github className="w-4 h-4" />, url: PERSONAL_INFO.github },
                  { name: 'X / Twitter', icon: <Twitter className="w-4 h-4" />, url: PERSONAL_INFO.x },
                  { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, url: PERSONAL_INFO.linkedin },
                  { name: 'Terminal', icon: <Terminal className="w-4 h-4" />, url: 'https://github.com' },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundEngine.playTick()}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className={`px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200'
                        : 'bg-white hover:bg-slate-50 text-[#181c19] shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {social.icon}
                      <span>{social.name}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#6e7670] dark:text-slate-400" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Status & Availability Indicator */}
            <div className="pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#6e7670] dark:text-slate-400">
              <span>Base: {PERSONAL_INFO.location}</span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-[#35D07F] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.5)]" />
                Replies within 24h
              </span>
            </div>
          </div>

          {/* Right Message Composer Form */}
          <div
            className={`lg:col-span-7 rounded-[24px] p-8 sm:p-10 ${
              theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
            } relative`}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#35D07F]/10 flex items-center justify-center text-[#35D07F]">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-[#181c19] dark:text-white">
                  Message Dispatched!
                </h4>
                <p className="text-sm text-[#6e7670] dark:text-[#a1a1a6] max-w-sm">
                  Thank you for reaching out. Your transmission was received and I’ll review your note promptly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-[#181c19]'}`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#35D07F] transition-all placeholder:text-[#6e7670] dark:placeholder:text-slate-500 ${
                        theme === 'dark'
                          ? 'bg-white/[0.04] text-white border border-white/[0.04]'
                          : 'bg-black/[0.02] text-[#181c19] border border-black/[0.04]'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-[#181c19]'}`}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#35D07F] transition-all placeholder:text-[#6e7670] dark:placeholder:text-slate-500 ${
                        theme === 'dark'
                          ? 'bg-white/[0.04] text-white border border-white/[0.04]'
                          : 'bg-black/[0.02] text-[#181c19] border border-black/[0.04]'
                      }`}
                    />
                  </div>
                </div>

                {/* Project Focus */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-[#181c19]'}`}>
                    Topic of Discussion
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Full-Stack Architecture', 'Web Performance & WebGL', 'Engineering Advisory'].map((type) => (
                      <motion.button
                        key={type}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          soundEngine.playTick();
                          setFormData({ ...formData, type });
                        }}
                        className={`px-3 py-2 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
                          formData.type === type
                            ? 'bg-[#1a201c] dark:bg-white text-white dark:text-[#0e1214] font-semibold shadow-sm'
                            : theme === 'dark'
                              ? 'bg-white/[0.04] text-[#86868b] hover:text-white'
                              : 'bg-black/[0.02] text-[#6e7670] hover:text-[#181c19]'
                        }`}
                      >
                        {type}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-[#181c19]'}`}>
                    Project Goals / Role Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your technical requirements, architectural challenges, or timeline..."
                    className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#35D07F] transition-all placeholder:text-[#6e7670] dark:placeholder:text-slate-500 resize-none ${
                      theme === 'dark'
                        ? 'bg-white/[0.04] text-white border border-white/[0.04]'
                        : 'bg-black/[0.02] text-[#181c19] border border-black/[0.04]'
                    }`}
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => soundEngine.playBlob(20, 0.8)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                  className="apple-btn-forest w-full py-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                </motion.button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
