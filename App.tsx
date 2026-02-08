
import React, { useState, useEffect } from 'react';
import { AppState, Student, Payment, ScoreCard, Notice } from './types';
import { OPS_EMAIL, OPS_PASSCODE, FACULTY } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import OpsDashboard from './pages/OpsDashboard';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aditya_coaching_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure faculty data exists in saved state
      if (!parsed.faculty || parsed.faculty.length === 0) {
        parsed.faculty = FACULTY.map((f, i) => ({ ...f, id: `F${i}` }));
      }
      return parsed;
    }
    return {
      students: [],
      faculty: FACULTY.map((f, i) => ({ ...f, id: `F${i}` })),
      payments: [],
      scoreCards: [],
      bestPerformers: [],
      advertisements: [],
      attendanceRecords: [],
      leaveRequests: [],
      callbackRequests: [],
      freeTrialLeads: [],
      websiteFeedbacks: [],
      notices: [
        { id: 'n1', content: "Welcome to Aditya Coaching Classes! New JEE Batches starting soon.", date: new Date().toLocaleDateString() }
      ],
      currentUser: null,
      isOpsLoggedIn: false
    };
  });

  const [view, setView] = useState<'home' | 'auth' | 'student' | 'ops'>('home');

  useEffect(() => {
    localStorage.setItem('aditya_coaching_data', JSON.stringify(state));
  }, [state]);

  const handleRegister = (name: string, email: string, phone: string, pass: string) => {
    const newId = `ACC${state.students.length + 1}`;
    const newStudent: Student = {
      id: newId,
      name,
      email,
      phone,
      password: pass,
      role: 'student',
      registeredAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, students: [...prev.students, newStudent], currentUser: newStudent }));
    setView('student');
  };

  const handleLogin = (email: string, pass: string) => {
    const user = state.students.find(s => s.email === email && s.password === pass);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      setView('student');
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleOpsLogin = (email: string, pass: string) => {
    if (email === OPS_EMAIL && pass === OPS_PASSCODE) {
      setState(prev => ({ ...prev, isOpsLoggedIn: true }));
      setView('ops');
    } else {
      alert("Invalid Ops credentials!");
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null, isOpsLoggedIn: false }));
    setView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        view={view} 
        setView={setView} 
        user={state.currentUser} 
        isOps={state.isOpsLoggedIn} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        {view === 'home' && <Home setView={setView} state={state} setState={setState} />}
        {view === 'auth' && <Auth onRegister={handleRegister} onLogin={handleLogin} onOpsLogin={handleOpsLogin} />}
        {view === 'student' && state.currentUser && (
          <StudentDashboard 
            student={state.currentUser} 
            state={state} 
            setState={setState} 
          />
        )}
        {view === 'ops' && state.isOpsLoggedIn && (
          <OpsDashboard 
            state={state} 
            setState={setState} 
          />
        )}
      </main>

      <Footer setView={setView} />
    </div>
  );
};

export default App;
