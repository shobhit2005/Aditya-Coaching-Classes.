
import React, { useState } from 'react';

interface Props {
  onRegister: (name: string, email: string, phone: string, pass: string) => void;
  onLogin: (email: string, pass: string) => void;
  onOpsLogin: (email: string, pass: string) => void;
}

const Auth: React.FC<Props> = ({ onRegister, onLogin, onOpsLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'ops'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) return alert("Fill all fields");
      onRegister(formData.name, formData.email, formData.phone, formData.password);
    } else if (mode === 'login') {
      onLogin(formData.email, formData.password);
    } else {
      onOpsLogin(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-blue-900 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">
            {mode === 'register' ? 'Join Aditya Classes' : mode === 'ops' ? 'Ops Control Center' : 'Student Login'}
          </h2>
          <p className="text-slate-400 text-sm">Access your academic journey with us</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Ex: Rahul Sharma"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="name@email.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="99XXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{mode === 'ops' ? 'Passcode' : 'Password'}</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
            {mode === 'register' ? 'Create Account' : mode === 'ops' ? 'Verify Ops' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-2 pt-4">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-600 font-semibold hover:underline text-sm">
              {mode === 'login' ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
            <button type="button" onClick={() => setMode('ops')} className="text-slate-400 text-xs hover:text-slate-600 transition">
              Ops Entry Only
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
