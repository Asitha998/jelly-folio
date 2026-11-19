import React, { useState, useEffect } from 'react';
import { Theme } from './types';
import { GooeyFilter } from './components/GooeyFilter';
import { CursorLight } from './components/CursorLight';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhatIBuild } from './components/WhatIBuild';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SoundManager } from './components/SoundManager';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme') as Theme | null;
    const nextTheme = savedTheme ?? 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  return (
    <div
      className={`min-h-screen relative overflow-x-clip selection:bg-[#8ee850]/30 selection:text-white transition-colors duration-500 font-sans ${
        theme === 'dark'
          ? 'bg-[#080a0a] text-[#f4f5ee]'
          : 'bg-[#f4f5ee] text-[#18201b]'
      }`}
    >
      <GooeyFilter />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className={`absolute -top-52 right-[8%] w-[42rem] h-[42rem] rounded-full blur-[150px] ${theme === 'dark' ? 'bg-[#b6ff67]/[0.08]' : 'bg-[#91d65b]/[0.10]'}`} />
        <div className={`absolute top-[38%] -left-52 w-[36rem] h-[36rem] rounded-full blur-[170px] ${theme === 'dark' ? 'bg-[#5fa7ff]/[0.045]' : 'bg-[#73a6ea]/[0.07]'}`} />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.065] portfolio-grid" />
      </div>

      <CursorLight theme={theme} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1">
          <Hero theme={theme} />
          <About theme={theme} />
          <Skills theme={theme} />
          <Experience theme={theme} />
          <WhatIBuild theme={theme} />
          <Projects theme={theme} />
          <Contact theme={theme} />
        </main>
        <Footer theme={theme} />
        <SoundManager theme={theme} />
      </div>
    </div>
  );
}
