
import React from 'react';
import { Student } from '../types';

interface Props {
  view: string;
  setView: (v: any) => void;
  user: Student | null;
  isOps: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ view, setView, user, isOps, onLogout }) => {
  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-blue-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center font-black text-blue-900 text-2xl shadow-xl transform group-hover:rotate-12 transition-transform">A</div>
            <div className="ml-4">
              <span className="text-2xl font-black block leading-none tracking-tight">ADITYA</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-black">Coaching Classes</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => scrollToSection('courses')} className="text-sm font-bold text-slate-300 hover:text-white transition uppercase tracking-widest">Courses</button>
            <button onClick={() => scrollToSection('faculty')} className="text-sm font-bold text-slate-300 hover:text-white transition uppercase tracking-widest">Faculty</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-300 hover:text-white transition uppercase tracking-widest">Contact</button>
          </div>

          <div className="flex items-center space-x-4">
            {view === 'home' && !user && !isOps && (
              <button 
                onClick={() => setView('auth')} 
                className="bg-yellow-500 text-blue-900 px-7 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-400 transition shadow-[0_4px_20px_rgba(234,179,8,0.4)]"
              >
                STUDENT LOGIN
              </button>
            )}
            {(user || isOps) && (
              <button 
                onClick={onLogout} 
                className="bg-red-500/10 border border-red-500/50 text-red-500 px-5 py-2 rounded-xl text-xs font-black hover:bg-red-500 hover:text-white transition"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
