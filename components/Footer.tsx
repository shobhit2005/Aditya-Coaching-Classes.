
import React from 'react';
import { ADDRESS, CONTACT_PHONE } from '../constants';

interface Props {
  setView: (v: any) => void;
}

const Footer: React.FC<Props> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-white text-2xl font-bold mb-4">Aditya Coaching Classes</h3>
        <p className="mb-2">{ADDRESS}</p>
        <p className="text-yellow-500 font-bold text-lg mb-6">Contact: {CONTACT_PHONE}</p>
        <div className="flex justify-center space-x-8 text-sm uppercase tracking-widest border-t border-slate-800 pt-8">
          <button onClick={() => setView('home')} className="hover:text-white transition">Home</button>
          <button onClick={() => setView('auth')} className="hover:text-white transition">Portal</button>
          <button onClick={() => setView('auth')} className="hover:text-white transition">Ops Control</button>
        </div>
        <p className="mt-8 text-xs text-slate-500">© 2024 Aditya Coaching Classes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
