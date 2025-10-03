// pages/Home.js (Updated)
import React, { useState } from 'react';
import { BsChatDotsFill } from 'react-icons/bs';
import { FiArrowRight } from 'react-icons/fi';
import { RiGlobalLine, RiShieldKeyholeLine, RiBrainLine } from 'react-icons/ri';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-white antialiased font">
        
        {/* Background Layers */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.92)), url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.1&auto=format&fit=crop&w=2070&q=80')`,
          }}
        />

        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' fill='none' stroke='rgb(255 255 255)' stroke-width='0.5'%3e%3cpath d='M0 .5H63.5V64'/%3e%3c/svg%3e")`,
          }}
        />

        {/* Content */}
        <main className="relative z-20 flex h-full flex-col items-center justify-center px-6">
          <div className="h-[5vh] w-full shrink-0" aria-hidden="true"></div>

          <div className="w-full max-w-6xl text-center">
            
            {/* Pre-header Pill */}
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Enterprise Grade
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.1] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Source Smarter.
              <br />
              <span className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">
                Scale Your Retail Empire.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
              Access exclusive global inventory with unified payments and AI-driven procurement intelligence. The definitive platform for modern retailers.
            </p>
            
            {/* Value Props */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8">
              <GlassPill icon={RiGlobalLine} text="Global Supplier Network" />
              <GlassPill icon={RiBrainLine} text="Predictive Inventory AI" />
              <GlassPill icon={RiShieldKeyholeLine} text="Escrow-Secured Payments" />
            </div>

          </div>
        </main>

        {/* Chatbot Button */}
        <button
          onClick={handleChatbotToggle}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-indigo-600/90 text-white shadow-lg shadow-indigo-900/50 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-indigo-500"
          aria-label="Open Concierge Support"
        >
          <BsChatDotsFill className="h-6 w-6" />
          {/* Notification dot */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-slate-900"></span>
          </span>
        </button>
      </div>

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} onClose={handleChatbotToggle} />
    </>
  );
};

// Sub-component for the Glassmorphic Value Pills
const GlassPill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-5 py-3 backdrop-blur-sm transition-colors hover:bg-white/10">
    <Icon className="h-5 w-5 text-indigo-300" />
    <span className="text-sm font-medium text-slate-100 tracking-wide">{text}</span>
  </div>
);

export default Home;