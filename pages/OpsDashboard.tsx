
import React, { useState } from 'react';
import { AppState, Student, Payment, Notice, Performer, AttendanceRecord, SkipRecord, LeaveRequest, Advertisement, FacultyMember } from '../types';
import { SUBJECTS, MONTHS } from '../constants';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const OpsDashboard: React.FC<Props> = ({ state, setState }) => {
  const [activeMenu, setActiveMenu] = useState<'students' | 'payments' | 'attendance' | 'leaves' | 'performers' | 'scorecards' | 'notices' | 'feedback' | 'callbacks' | 'trials' | 'webfeedbacks' | 'ads' | 'faculty'>('students');
  const [search, setSearch] = useState('');
  const [showHiddenFee, setShowHiddenFee] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Stats
  const totalStudents = state.students.length;
  const totalCollected = state.payments.filter(p => p.status === 'acknowledged').reduce((acc, p) => acc + p.totalAmount, 0);
  const pendingAcks = state.payments.filter(p => p.status === 'pending').length;
  const pendingLeaves = state.leaveRequests.filter(lr => lr.status === 'Pending').length;
  const pendingCallbacks = state.callbackRequests.filter(c => c.status === 'Pending').length;
  const pendingTrials = state.freeTrialLeads.filter(t => t.status === 'Pending').length;

  const filteredStudents = state.students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAcknowledge = (paymentId: string) => {
    setState(prev => ({
      ...prev,
      payments: prev.payments.map(p => p.id === paymentId ? { ...p, status: 'acknowledged' } : p)
    }));
  };

  const handleCallbackStatus = (id: string, status: string) => {
    setState(prev => ({
      ...prev,
      callbackRequests: prev.callbackRequests.map(c => c.id === id ? { ...c, status } : c)
    }));
  };

  const handleTrialStatus = (id: string, status: string) => {
    setState(prev => ({
      ...prev,
      freeTrialLeads: prev.freeTrialLeads.map(t => t.id === id ? { ...t, status } : t)
    }));
  };

  const handleWebFeedbackUpdate = (id: string, update: Partial<{ status: string, called: boolean }>) => {
    setState(prev => ({
      ...prev,
      websiteFeedbacks: prev.websiteFeedbacks.map(f => f.id === id ? { ...f, ...update } : f)
    }));
  };

  const handleAddNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const content = fd.get('content') as string;
    if (!content) return;
    const newNotice: Notice = { id: `N${Date.now()}`, content, date: new Date().toLocaleDateString() };
    setState(prev => ({ ...prev, notices: [newNotice, ...prev.notices] }));
    (e.target as HTMLFormElement).reset();
    alert("Notice Published!");
  };

  const handleAddPerformer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = (fd.get('photo') as File);
    const name = fd.get('name') as string;
    const achievement = fd.get('achievement') as string;

    const reader = new FileReader();
    reader.onloadend = () => {
        const newPerformer = {
            id: `BP${Date.now()}`,
            name,
            achievement,
            photo: reader.result as string
        };
        setState(prev => ({ ...prev, bestPerformers: [...(prev.bestPerformers || []), newPerformer] }));
        (e.target as HTMLFormElement).reset();
        alert("Performer added to Hall of Fame!");
    };
    if (file && file.size > 0) reader.readAsDataURL(file);
    else alert("Please select a photo");
  };

  const handleAddAd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = (fd.get('image') as File);
    const title = fd.get('title') as string;
    const description = fd.get('description') as string;

    const reader = new FileReader();
    reader.onloadend = () => {
        const newAd: Advertisement = {
            id: `AD${Date.now()}`,
            title,
            description,
            image: reader.result as string,
            active: true
        };
        setState(prev => ({ ...prev, advertisements: [...(prev.advertisements || []), newAd] }));
        (e.target as HTMLFormElement).reset();
        alert("Advertisement published to Home Page!");
    };
    if (file && file.size > 0) reader.readAsDataURL(file);
    else alert("Please select an image");
  };

  const handleUpdateFacultyPhoto = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
       const base64 = reader.result as string;
       setState(prev => ({
          ...prev,
          faculty: prev.faculty.map(f => f.id === id ? { ...f, image: base64 } : f)
       }));
       alert("Faculty photo updated in real-time!");
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleUpdateFeedback = (studentId: string, text: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, feedback: text } : s)
    }));
    alert("Personal feedback updated!");
  };

  const handleUploadScore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sId = fd.get('studentId') as string;
    const scores = SUBJECTS.map(sub => ({
      subject: sub,
      marks: parseInt(fd.get(sub) as string || '0')
    }));
    if (!state.students.find(s => s.id === sId)) return alert("Invalid Student ID");
    const newScoreCard = { studentId: sId, scores, uploadedAt: new Date().toISOString() };
    setState(prev => ({ ...prev, scoreCards: [...prev.scoreCards.filter(sc => sc.studentId !== sId), newScoreCard] }));
    (e.target as HTMLFormElement).reset();
    alert("Scorecard uploaded successfully!");
  };

  const [skipInputs, setSkipInputs] = useState<SkipRecord[]>([]);

  const handleAddSkip = () => {
    setSkipInputs([...skipInputs, { date: '', reason: 'General Leave', comment: '' }]);
  };

  const handleUpdateSkip = (idx: number, field: keyof SkipRecord, value: string) => {
    const newSkips = [...skipInputs];
    (newSkips[idx] as any)[field] = value;
    setSkipInputs(newSkips);
  };

  const handleMarkAttendance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sId = fd.get('studentId') as string;
    const month = fd.get('month') as string;
    const workingDays = parseInt(fd.get('workingDays') as string);
    const presentDays = parseInt(fd.get('presentDays') as string);

    if (!state.students.find(s => s.id === sId)) return alert("Invalid Student ID");

    const newAttendance: AttendanceRecord = {
       studentId: sId,
       month,
       totalWorkingDays: workingDays,
       attendedDays: presentDays,
       skips: skipInputs.filter(s => s.date !== '')
    };

    setState(prev => ({
       ...prev,
       attendanceRecords: [...prev.attendanceRecords.filter(ar => !(ar.studentId === sId && ar.month === month)), newAttendance]
    }));
    setSkipInputs([]);
    (e.target as HTMLFormElement).reset();
    alert("Attendance marked for " + sId);
  };

  const handleLeaveDecision = (leaveId: string, status: 'Approved' | 'Rejected') => {
     setState(prev => ({
        ...prev,
        leaveRequests: prev.leaveRequests.map(lr => lr.id === leaveId ? { ...lr, status } : lr)
     }));
     alert(`Leave ${status}!`);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 pb-20">
      <div className="bg-slate-800 border-b border-slate-700 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OPS CONTROL CENTER</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">ADITYA COACHING MANAGEMENT</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Total Collection</p>
              <button onClick={() => setShowHiddenFee(!showHiddenFee)} className="text-2xl font-black text-green-500 hover:text-green-400 tabular-nums">
                {showHiddenFee ? `₹${totalCollected}` : '₹ •••••'}
              </button>
            </div>
            <div className="h-12 w-[1px] bg-slate-700"></div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Total Students</p>
              <p className="text-2xl font-black text-white tabular-nums">{totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 space-y-1">
          <div className="pb-4 mb-4 border-b border-slate-800">
             <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-4 mb-2">Management</p>
             {(['students', 'payments', 'attendance', 'leaves', 'scorecards'] as const).map(m => (
               <button key={m} onClick={() => { setActiveMenu(m); setSelectedStudentId(null); }} className={`w-full text-left px-4 py-3 rounded-2xl transition font-bold capitalize flex items-center justify-between ${activeMenu === m ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-800 text-slate-400'}`}>
                 {m}
                 {m === 'payments' && pendingAcks > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingAcks}</span>}
                 {m === 'leaves' && pendingLeaves > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingLeaves}</span>}
               </button>
             ))}
          </div>

          <div className="pb-4 mb-4 border-b border-slate-800">
             <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-4 mb-2">Leads & Interaction</p>
             {(['callbacks', 'trials', 'webfeedbacks'] as const).map(m => (
               <button key={m} onClick={() => { setActiveMenu(m); setSelectedStudentId(null); }} className={`w-full text-left px-4 py-3 rounded-2xl transition font-bold capitalize flex items-center justify-between ${activeMenu === m ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-800 text-slate-400'}`}>
                 {m === 'webfeedbacks' ? 'Web Feedbacks' : m === 'trials' ? 'Free Trials' : 'Callback Reqs'}
                 {m === 'callbacks' && pendingCallbacks > 0 && <span className="bg-yellow-500 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black">{pendingCallbacks}</span>}
                 {m === 'trials' && pendingTrials > 0 && <span className="bg-yellow-500 text-slate-900 text-[10px] px-2 py-0.5 rounded-full font-black">{pendingTrials}</span>}
               </button>
             ))}
          </div>

          <div>
             <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] px-4 mb-2">Public Info</p>
             {(['performers', 'ads', 'faculty', 'notices', 'feedback'] as const).map(m => (
               <button key={m} onClick={() => { setActiveMenu(m); setSelectedStudentId(null); }} className={`w-full text-left px-4 py-3 rounded-2xl transition font-bold capitalize ${activeMenu === m ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-800 text-slate-400'}`}>
                 {m === 'performers' ? 'Toppers Hall' : m === 'ads' ? 'Manage Ads' : m === 'faculty' ? 'Manage Faculty' : m === 'feedback' ? 'Student Personal Feed' : m}
               </button>
             ))}
          </div>
        </aside>

        <main className="flex-1 bg-slate-800/40 rounded-[40px] border border-slate-800 p-6 md:p-10 min-h-[700px]">
          {activeMenu === 'faculty' && (
             <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-white mb-8">Manage Faculty Profiles</h3>
                <div className="grid gap-6">
                   {state.faculty.map(f => (
                      <div key={f.id} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700 flex flex-col md:flex-row gap-8 items-center">
                         <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                            {f.image ? (
                               <img src={f.image} className="w-full h-full object-cover" alt={f.name} />
                            ) : (
                               <span className="text-4xl font-black text-slate-600">{f.name[0]}</span>
                            )}
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <h4 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{f.name}</h4>
                            <p className="text-blue-500 font-bold mb-4">{f.degree} | {f.experience}</p>
                            <label className="inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm cursor-pointer hover:bg-blue-500 transition shadow-xl shadow-blue-600/20">
                               UPLOAD PHOTO
                               <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                     const file = e.target.files?.[0];
                                     if (file) handleUpdateFacultyPhoto(f.id, file);
                                  }}
                               />
                            </label>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeMenu === 'students' && !selectedStudentId && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-white">Student Information Center</h3>
                <input type="text" placeholder="Search by ID or Name..." className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="grid gap-4">
                {filteredStudents.length === 0 ? <p className="text-center text-slate-500 py-10">No students found.</p> : filteredStudents.map(s => (
                  <div key={s.id} onClick={() => setSelectedStudentId(s.id)} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center group cursor-pointer hover:border-blue-600 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-400 overflow-hidden">
                        {s.profilePhoto ? <img src={s.profilePhoto} className="w-full h-full object-cover" alt="Profile" /> : s.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold">{s.name}</p>
                        <p className="text-xs font-mono text-slate-500">{s.id} | {s.phone}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View Details</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Pending Fee Approvals</h3>
              <div className="grid gap-4">
                {state.payments.length === 0 ? <p className="text-slate-500 italic text-center py-20">No fee history found.</p> : 
                  state.payments.sort((a,b) => b.submittedAt.localeCompare(a.submittedAt)).map(p => {
                    const student = state.students.find(s => s.id === p.studentId);
                    return (
                      <div key={p.id} className="bg-slate-800 p-6 rounded-[30px] border border-slate-700 flex justify-between items-center">
                        <div>
                          <p className="text-white font-black text-lg">{student?.name || 'Unknown'} <span className="text-xs font-mono text-slate-500 ml-2">({p.studentId})</span></p>
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{p.subjects.join(', ')} | {p.months.join(', ')}</p>
                          <p className="text-[10px] text-blue-500 font-mono mt-1 tracking-widest uppercase">TXN: {p.transactionId}</p>
                        </div>
                        <div className="text-right space-y-4">
                          <p className="text-2xl font-black text-white tabular-nums">₹{p.totalAmount}</p>
                          {p.status === 'pending' ? (
                            <button onClick={() => handleAcknowledge(p.id)} className="bg-blue-600 text-white px-8 py-2.5 rounded-2xl text-xs font-black hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">APPROVE</button>
                          ) : <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">VERIFIED ✓</span>}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}

          {activeMenu === 'attendance' && (
             <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-white mb-8">Mark Monthly Attendance</h3>
                <form onSubmit={handleMarkAttendance} className="bg-slate-800 p-6 md:p-10 rounded-[40px] border border-slate-700 space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div><label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Student ID</label>
                        <input name="studentId" required placeholder="e.g. ACC1" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500" />
                      </div>
                      <div><label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Month</label>
                        <select name="month" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500">
                           {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div><label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Total Working Days</label>
                        <input type="number" name="workingDays" placeholder="25" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none" required />
                      </div>
                      <div><label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Days Present</label>
                        <input type="number" name="presentDays" placeholder="20" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none" required />
                      </div>
                   </div>
                   <div className="border-t border-slate-700 pt-8">
                      <div className="flex justify-between items-center mb-6">
                         <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Detailed Skip Records</h4>
                         <button type="button" onClick={handleAddSkip} className="bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-600">+ Add Skip Day</button>
                      </div>
                      <div className="space-y-4">
                        {skipInputs.map((skip, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                             <input type="date" className="bg-slate-800 rounded-lg px-3 py-2 text-xs outline-none" value={skip.date} onChange={e => handleUpdateSkip(idx, 'date', e.target.value)} />
                             <select className="bg-slate-800 rounded-lg px-3 py-2 text-xs outline-none" value={skip.reason} onChange={e => handleUpdateSkip(idx, 'reason', e.target.value as any)}>
                                <option value="Bunk">Bunk</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="General Leave">General Leave</option>
                                <option value="Other">Other</option>
                             </select>
                             <div className="flex gap-2">
                                <input type="text" placeholder="Reason details..." className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-xs outline-none" value={skip.comment} onChange={e => handleUpdateSkip(idx, 'comment', e.target.value)} />
                                <button type="button" onClick={() => setSkipInputs(skipInputs.filter((_, i) => i !== idx))} className="text-red-500">×</button>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all">SAVE ATTENDANCE</button>
                </form>
             </div>
          )}

          {activeMenu === 'leaves' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Leave Requests Approval</h3>
              <div className="grid gap-4">
                {state.leaveRequests.length === 0 ? <p className="text-slate-500 italic text-center py-20">No pending leave requests.</p> : 
                  state.leaveRequests.sort((a,b) => b.submittedAt.localeCompare(a.submittedAt)).map(lr => (
                    <div key={lr.id} className="bg-slate-800 p-6 rounded-[30px] border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-white font-black text-lg">Student ID: <span className="text-blue-500 font-mono">{lr.studentId}</span></p>
                        <p className="text-xs text-slate-400 mt-1">Requested Dates: <span className="text-yellow-500 font-bold">{lr.dates.join(', ')}</span></p>
                        <p className="text-sm italic text-slate-400 mt-2">"{lr.reason}"</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 min-w-[150px]">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${lr.status === 'Approved' ? 'bg-green-500/20 text-green-500' : lr.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{lr.status}</span>
                        {lr.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleLeaveDecision(lr.id, 'Approved')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black">APPROVE</button>
                            <button onClick={() => handleLeaveDecision(lr.id, 'Rejected')} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black">REJECT</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {activeMenu === 'scorecards' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Upload Student Scorecard</h3>
              <form onSubmit={handleUploadScore} className="bg-slate-800 p-10 rounded-[40px] border border-slate-700 space-y-8 max-w-2xl">
                <div><label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Student ID (ACCX)</label>
                  <input name="studentId" required placeholder="e.g. ACC1" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {SUBJECTS.map(sub => (
                    <div key={sub}>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{sub} Marks</label>
                      <input type="number" name={sub} min="0" max="100" placeholder="0-100" className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all">PUBLISH SCORECARD</button>
              </form>
            </div>
          )}

          {activeMenu === 'performers' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Manage Hall of Fame</h3>
              <form onSubmit={handleAddPerformer} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700 space-y-6 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="name" required placeholder="Student Name" className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-2xl outline-none" />
                  <input name="achievement" required placeholder="Achievement (JEE/Board Result)" className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-2xl outline-none" />
                </div>
                <input name="photo" type="file" required accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-sm file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500">ADD TO SUCCESS STORIES</button>
              </form>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 {state.bestPerformers?.map(p => (
                   <div key={p.id} className="relative group rounded-3xl overflow-hidden border border-slate-700">
                     <img src={p.photo} className="w-full h-48 object-cover" alt={p.name} />
                     <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition p-4 text-center">
                        <p className="font-black text-white uppercase">{p.name}</p>
                        <p className="text-[10px] text-yellow-500 font-bold mt-1">{p.achievement}</p>
                        <button onClick={() => setState(v => ({...v, bestPerformers: v.bestPerformers.filter(x => x.id !== p.id)}))} className="text-red-500 text-xs font-black mt-4 hover:underline">REMOVE</button>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeMenu === 'ads' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Manage Homepage Ads</h3>
              <form onSubmit={handleAddAd} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700 space-y-6 mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="title" required placeholder="Promotion Title" className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-2xl outline-none" />
                  <input name="description" required placeholder="Description (e.g. 50% Off)" className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-2xl outline-none" />
                </div>
                <input name="image" type="file" required accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-sm file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all">PUBLISH PROMOTION</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {state.advertisements?.map(ad => (
                   <div key={ad.id} className="bg-slate-800 p-4 rounded-3xl border border-slate-700">
                     <img src={ad.image} className="w-full h-40 object-cover rounded-2xl mb-4" alt={ad.title} />
                     <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{ad.title}</h4>
                     <p className="text-xs text-slate-500 mb-4">{ad.description}</p>
                     <div className="flex justify-between items-center">
                        <span className={`text-[8px] px-3 py-1 rounded font-black uppercase tracking-widest ${ad.active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{ad.active ? 'ACTIVE' : 'INACTIVE'}</span>
                        <button onClick={() => setState(v => ({...v, advertisements: v.advertisements.filter(x => x.id !== ad.id)}))} className="text-red-500 text-xs font-black hover:underline">REMOVE</button>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeMenu === 'notices' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Broadcast Notice</h3>
              <form onSubmit={handleAddNotice} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700 flex gap-4">
                <input name="content" required placeholder="Type broadcast message..." className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 outline-none focus:border-blue-500" />
                <button type="submit" className="bg-blue-600 px-10 rounded-2xl font-black text-white hover:bg-blue-500">POST</button>
              </form>
              <div className="space-y-4 mt-8">
                {state.notices.map(n => (
                  <div key={n.id} className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800 flex justify-between items-center">
                    <div><p className="text-slate-300 font-bold">{n.content}</p><p className="text-[10px] text-slate-600 font-black uppercase mt-2">{n.date}</p></div>
                    <button onClick={() => setState(v => ({ ...v, notices: v.notices.filter(x => x.id !== n.id) }))} className="text-red-500/50 hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'feedback' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Student Personal Feedbacks</h3>
              <div className="grid gap-6">
                {state.students.map(s => (
                  <div key={s.id} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700">
                    <p className="text-white font-black text-lg mb-4">{s.name} <span className="text-xs text-slate-500 font-mono">[{s.id}]</span></p>
                    <textarea defaultValue={s.feedback} placeholder="Private feedback for this student..." className="w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 text-sm outline-none focus:border-blue-500 min-h-[120px]" onBlur={(e) => handleUpdateFeedback(s.id, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedStudentId && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelectedStudentId(null)} className="text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4">← Back to Directory</button>
                {(() => {
                    const s = state.students.find(x => x.id === selectedStudentId);
                    if (!s) return null;
                    const scores = state.scoreCards.find(sc => sc.studentId === s.id);
                    const payments = state.payments.filter(p => p.studentId === s.id);
                    const paidMonths = payments.filter(p => p.status === 'acknowledged').flatMap(p => p.months);
                    const attendance = state.attendanceRecords.filter(ar => ar.studentId === s.id);

                    return (
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-24 bg-slate-700 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-600">
                                    {s.profilePhoto ? <img src={s.profilePhoto} className="w-full h-full object-cover" alt="Profile" /> : <span className="text-3xl font-bold">{s.name[0]}</span>}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-white uppercase">{s.name}</h2>
                                    <p className="text-blue-500 font-mono tracking-widest">{s.id}</p>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div><p className="text-[10px] text-slate-500 uppercase font-black">Parents</p><p className="text-white">{s.parentsName || '---'}</p></div>
                                        <div><p className="text-[10px] text-slate-500 uppercase font-black">Contact</p><p className="text-white">{s.phone}</p></div>
                                        <div className="col-span-2"><p className="text-[10px] text-slate-500 uppercase font-black">Address</p><p className="text-white">{s.address || '---'}</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-700">
                                <h4 className="text-xs font-black text-white mb-4 uppercase tracking-widest">Attendance</h4>
                                {attendance.map((a, i) => (
                                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-800 last:border-0">
                                    <span className="text-slate-400">{a.month}</span><span className="font-bold">{a.attendedDays}/{a.totalWorkingDays}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-700">
                                <h4 className="text-xs font-black text-white mb-4 uppercase tracking-widest">Score History</h4>
                                {scores?.scores.map((sc, i) => (
                                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-800 last:border-0">
                                    <span className="text-slate-400">{sc.subject}</span><span className="font-bold text-blue-500">{sc.marks}%</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-700">
                                <h4 className="text-xs font-black text-white mb-4 uppercase tracking-widest">Fee Status</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {MONTHS.map(m => (
                                    <div key={m} className={`text-[8px] px-1 py-1 rounded text-center font-bold ${paidMonths.includes(m) ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{m.substring(0,3)}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
          )}

          {activeMenu === 'webfeedbacks' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <h3 className="text-2xl font-black text-white mb-8">Landing Page Feedbacks</h3>
               <div className="grid gap-4">
                 {state.websiteFeedbacks?.map(f => (
                   <div key={f.id} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700">
                      <div className="flex justify-between items-start mb-6">
                         <div><p className="text-white font-black text-xl">{f.name}</p><p className="text-blue-500 font-mono text-sm">{f.phone}</p></div>
                         <button onClick={() => handleWebFeedbackUpdate(f.id, { called: !f.called })} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all ${f.called ? 'bg-green-500 text-white' : 'bg-slate-900 text-slate-500 border border-slate-700'}`}>{f.called ? 'Called ✓' : 'Mark Called'}</button>
                      </div>
                      <p className="text-slate-400 italic bg-slate-900/50 p-6 rounded-3xl">"{f.feedback}"</p>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeMenu === 'callbacks' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Callback Reqs</h3>
              <div className="grid gap-4">
                {state.callbackRequests?.map(c => (
                  <div key={c.id} className="bg-slate-800 p-6 rounded-[30px] border border-slate-700 flex justify-between items-center group">
                    <div><p className="text-white font-black text-lg">{c.name}</p><p className="text-blue-500 font-mono text-sm tracking-widest">{c.phone}</p></div>
                    <select className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-3 text-xs font-bold outline-none" value={c.status} onChange={(e) => handleCallbackStatus(c.id, e.target.value)}>
                      <option>Pending</option><option>Called</option><option>Converted</option><option>Not Interested</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'trials' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-2xl font-black text-white mb-8">Free Trial Leads</h3>
              <div className="grid gap-4">
                {state.freeTrialLeads?.map(t => (
                  <div key={t.id} className="bg-slate-800 p-8 rounded-[40px] border border-slate-700 flex justify-between items-center">
                    <div><p className="text-white font-black text-lg">{t.name}</p><p className="text-blue-500 font-mono text-sm">{t.phone}</p>
                      <p className="text-xs text-slate-400 mt-2">Start: <span className="text-white font-bold">{t.trialDate}</span></p>
                    </div>
                    <select className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-3 text-xs font-bold outline-none" value={t.status} onChange={(e) => handleTrialStatus(t.id, e.target.value)}>
                      <option>Pending</option><option>Approved</option><option>Joined</option><option>Closed</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OpsDashboard;
