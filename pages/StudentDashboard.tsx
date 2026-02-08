
import React, { useState, useRef } from 'react';
import { Student, AppState, Payment, ScoreCard, LeaveRequest } from '../types';
import { SUBJECTS, MONTHS, FEE_PER_SUBJECT, ADDRESS, CONTACT_PHONE } from '../constants';
import html2canvas from 'html2canvas';

interface Props {
  student: Student;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const StudentDashboard: React.FC<Props> = ({ student, state, setState }) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'score' | 'notices' | 'feedback' | 'profile' | 'idcard' | 'attendance' | 'leave'>('fees');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [transId, setTransId] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  // Leave App state
  const [leaveDates, setLeaveDates] = useState<string[]>(['']);
  const [leaveReason, setLeaveReason] = useState('');
  const [parentTalked, setParentTalked] = useState(false);

  const totalFee = selectedSubjects.length * selectedMonths.length * FEE_PER_SUBJECT;

  const handlePaymentSubmit = () => {
    if (!transId || selectedSubjects.length === 0 || selectedMonths.length === 0) {
      alert("Please select subjects, months and enter transaction ID");
      return;
    }

    const newPayment: Payment = {
      id: `P${Date.now()}`,
      studentId: student.id,
      subjects: selectedSubjects,
      months: selectedMonths,
      totalAmount: totalFee,
      transactionId: transId,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      payments: [...prev.payments, newPayment]
    }));

    setIsPaying(false);
    setSelectedSubjects([]);
    setSelectedMonths([]);
    setTransId('');
    alert("OUR TEAM WILL ACKNOWLEDGE AND CONSIDER PLEASE WAIT FOR 6 HRS");
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...student,
      parentsName: fd.get('parentsName') as string,
      address: fd.get('address') as string,
      schoolName: fd.get('schoolName') as string,
      altPhone: fd.get('altPhone') as string,
    };
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === student.id ? updated : s),
      currentUser: updated
    }));
    alert("Profile updated successfully!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updated = { ...student, profilePhoto: base64 };
        setState(prev => ({
          ...prev,
          students: prev.students.map(s => s.id === student.id ? updated : s),
          currentUser: updated
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentTalked) {
      alert("Please confirm that you have talked with your parents.");
      return;
    }
    const newRequest: LeaveRequest = {
      id: `LR${Date.now()}`,
      studentId: student.id,
      dates: leaveDates.filter(d => d !== ''),
      reason: leaveReason,
      parentTalked: true,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      leaveRequests: [...prev.leaveRequests, newRequest]
    }));
    setLeaveDates(['']);
    setLeaveReason('');
    setParentTalked(false);
    alert("Leave application submitted for approval!");
  };

  const downloadIdCard = async () => {
    if (!idCardRef.current) return;
    const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
    });
    const link = document.createElement('a');
    link.download = `${student.name}_ID_Card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const myPayments = state.payments.filter(p => p.studentId === student.id);
  const myScoreCard = state.scoreCards.find(sc => sc.studentId === student.id);
  const myAttendance = state.attendanceRecords.filter(ar => ar.studentId === student.id);
  const myLeaveRequests = state.leaveRequests.filter(lr => lr.studentId === student.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Info */}
      <div className="md:w-1/4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-2xl overflow-hidden border-2 border-blue-900">
                {student.profilePhoto ? (
                  <img src={student.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : student.name[0]}
              </div>
              <label className="absolute bottom-0 right-0 bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white hover:bg-yellow-400 transition">
                <span className="text-xs">📷</span>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            <h2 className="font-bold text-xl text-slate-900">{student.name}</h2>
            <p className="text-blue-600 font-mono text-sm">{student.id}</p>
          </div>
          <div className="space-y-1">
            {(['fees', 'score', 'attendance', 'leave', 'notices', 'feedback', 'profile', 'idcard'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition capitalize ${activeTab === tab ? 'bg-blue-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {tab === 'score' ? 'Score Card' : tab === 'idcard' ? 'Generate ID Card' : tab === 'leave' ? 'Apply Leave' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 space-y-6">
        {activeTab === 'fees' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Fee Management</h3>
              <button onClick={() => setIsPaying(true)} className="bg-yellow-500 text-blue-900 px-6 py-2 rounded-xl font-bold hover:scale-105 transition shadow-lg">Pay Fees</button>
            </div>

            {isPaying ? (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">1. Select Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map(s => (
                        <button key={s} onClick={() => setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} className={`px-4 py-2 rounded-lg text-sm border transition ${selectedSubjects.includes(s) ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200'}`}>{s}</button>
                      ))}
                    </div>
                    <h4 className="font-bold text-lg">2. Select Months</h4>
                    <div className="flex flex-wrap gap-2">
                      {MONTHS.map(m => (
                        <button key={m} onClick={() => setSelectedMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])} className={`px-3 py-1.5 rounded-lg text-xs border transition ${selectedMonths.includes(m) ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200'}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <h4 className="font-bold mb-4 text-blue-900">Scan & Pay</h4>
                    <div className="bg-white p-4 rounded-2xl shadow-inner mb-4">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=aditya@upi&pn=AdityaClasses&am=" className="w-32 h-32 rounded-lg" alt="QR" />
                    </div>
                    <p className="text-3xl font-extrabold text-blue-900 mb-4">₹{totalFee}</p>
                    <input type="text" placeholder="Enter Transaction ID" className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4 outline-none focus:ring-2 focus:ring-blue-500" value={transId} onChange={e => setTransId(e.target.value)} />
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setIsPaying(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-white transition">Cancel</button>
                      <button onClick={handlePaymentSubmit} className="flex-2 bg-blue-900 text-white py-3 px-8 rounded-xl font-bold hover:bg-blue-800 transition">Submit Payment</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {myPayments.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No fee history found.</p>
                  </div>
                ) : (
                  myPayments.map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="flex gap-2 mb-1">{p.subjects.map(s => <span key={s} className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase">{s}</span>)}</div>
                        <p className="font-bold text-slate-800">{p.months.join(', ')}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">TXN: {p.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">₹{p.totalAmount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${p.status === 'acknowledged' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status === 'acknowledged' ? 'ACKNOWLEDGED' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <h3 className="text-2xl font-bold">Monthly Attendance Record</h3>
             <div className="grid gap-6">
                {myAttendance.length === 0 ? (
                   <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 text-slate-400 italic">
                      No attendance records found yet.
                   </div>
                ) : (
                  myAttendance.map((ar, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-xl font-bold text-blue-900">{ar.month}</h4>
                          <div className="flex gap-4">
                             <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Working Days</p>
                                <p className="text-lg font-bold">{ar.totalWorkingDays}</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Attended</p>
                                <p className="text-lg font-bold text-green-600">{ar.attendedDays}</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Absent</p>
                                <p className="text-lg font-bold text-red-600">{ar.totalWorkingDays - ar.attendedDays}</p>
                             </div>
                          </div>
                       </div>

                       {ar.skips.length > 0 && (
                         <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase">Absence Details</p>
                            <div className="grid gap-2">
                               {ar.skips.map((skip, sIdx) => (
                                 <div key={sIdx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                       <span className="text-sm font-mono text-slate-500">{skip.date}</span>
                                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                          skip.reason === 'Bunk' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                       }`}>
                                          {skip.reason}
                                       </span>
                                    </div>
                                    <p className="text-xs italic text-slate-500">{skip.comment || 'No comment'}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                       )}
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold mb-6">Apply for Leave</h3>
                <form onSubmit={handleApplyLeave} className="space-y-6">
                   <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-500 uppercase">Select Dates</p>
                      {leaveDates.map((date, idx) => (
                        <div key={idx} className="flex gap-2">
                           <input 
                              type="date" 
                              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" 
                              value={date}
                              onChange={(e) => {
                                 const newDates = [...leaveDates];
                                 newDates[idx] = e.target.value;
                                 setLeaveDates(newDates);
                              }}
                           />
                           {idx === leaveDates.length - 1 && (
                              <button 
                                 type="button" 
                                 onClick={() => setLeaveDates([...leaveDates, ''])}
                                 className="bg-slate-100 px-4 rounded-xl text-blue-900 font-bold hover:bg-slate-200"
                              >
                                 + Add
                              </button>
                           )}
                        </div>
                      ))}
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Reason for Leave</label>
                      <textarea 
                        className="w-full px-4 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Please describe why you need leave..."
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        required
                      />
                   </div>

                   <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <input 
                        type="checkbox" 
                        id="parentTalked" 
                        className="w-5 h-5 accent-blue-900" 
                        checked={parentTalked}
                        onChange={(e) => setParentTalked(e.target.checked)}
                      />
                      <label htmlFor="parentTalked" className="text-sm text-blue-900 font-semibold">
                         I have discussed this leave with my parents and they are aware.
                      </label>
                   </div>

                   <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg">
                      Submit Leave Application
                   </button>
                </form>
             </div>

             <div className="space-y-4">
                <h4 className="text-xl font-bold">Previous Applications</h4>
                <div className="grid gap-4">
                   {myLeaveRequests.length === 0 ? (
                      <p className="text-slate-400 italic">No previous applications.</p>
                   ) : (
                      myLeaveRequests.map((lr, idx) => (
                         <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                               <p className="font-bold text-slate-800">{lr.dates.join(', ')}</p>
                               <p className="text-sm text-slate-500 italic line-clamp-1">{lr.reason}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                               lr.status === 'Approved' ? 'bg-green-100 text-green-700' :
                               lr.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                               'bg-yellow-100 text-yellow-700'
                            }`}>
                               {lr.status.toUpperCase()}
                            </span>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-bold mb-6">Complete Your Profile</h3>
            <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parents Name</label>
                <input name="parentsName" defaultValue={student.parentsName} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Father's/Mother's Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                <input name="schoolName" defaultValue={student.schoolName} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your School Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alternate Phone Number</label>
                <input name="altPhone" defaultValue={student.altPhone} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Second Contact" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Permanent Address</label>
                <input name="address" defaultValue={student.address} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Current Residence" />
              </div>
              <div className="md:col-span-2">
                 <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition">Save Profile Information</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'idcard' && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Student Identity Card</h3>
              <p className="text-slate-500 text-sm">Valid for Academic Session 2024-25</p>
            </div>

            <div ref={idCardRef} className="w-80 h-[480px] bg-white rounded-2xl shadow-2xl border-2 border-blue-900 overflow-hidden relative flex flex-col">
              <div className="bg-blue-900 p-4 text-center text-white">
                <p className="font-bold text-sm tracking-widest">ADITYA COACHING CLASSES</p>
                <p className="text-[8px] uppercase tracking-tighter text-yellow-500">Excellence in Board & JEE Preparation</p>
              </div>
              <div className="flex-1 p-6 flex flex-col items-center">
                <div className="w-28 h-28 border-4 border-yellow-500 rounded-xl mb-4 overflow-hidden bg-slate-100 flex items-center justify-center">
                  {student.profilePhoto ? (
                    <img src={student.profilePhoto} className="w-full h-full object-cover" alt="ID Profile" />
                  ) : (
                    <span className="text-4xl text-slate-300 font-bold">{student.name[0]}</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-blue-900 mb-1 text-center uppercase">{student.name}</h2>
                <div className="bg-blue-900 text-white px-3 py-1 rounded-full text-[10px] font-mono mb-6">{student.id}</div>
                <div className="w-full space-y-3 text-left">
                   <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Guardian</span>
                      <span className="text-[10px] font-bold text-slate-700">{student.parentsName || '---'}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Contact</span>
                      <span className="text-[10px] font-bold text-slate-700">{student.phone}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Blood Group</span>
                      <span className="text-[10px] font-bold text-slate-700">O+</span>
                   </div>
                   <div className="flex flex-col border-b border-slate-100 pb-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Address</span>
                      <span className="text-[9px] font-bold text-slate-700 line-clamp-1">{student.address || 'Pratapgarh, UP'}</span>
                   </div>
                </div>
                <div className="mt-auto flex justify-between w-full items-end">
                   <div className="text-center">
                      <div className="w-12 h-12 bg-slate-100 border border-slate-200 mb-1">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${student.id}`} alt="QR" className="w-full h-full" />
                      </div>
                      <p className="text-[6px] font-bold text-slate-400">IDENTITY QR</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-bold text-blue-900 italic mb-1">Verified By</p>
                      <div className="w-16 h-4 border-b border-blue-900"></div>
                      <p className="text-[6px] text-slate-400 mt-1">PRINCIPAL SIGN</p>
                   </div>
                </div>
              </div>
              <div className="bg-blue-900 p-2 text-center">
                <p className="text-[7px] text-slate-300">{ADDRESS}</p>
                <p className="text-[7px] text-yellow-500 font-bold">{CONTACT_PHONE}</p>
              </div>
            </div>
            <button onClick={downloadIdCard} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 transition shadow-lg flex items-center gap-2">
              <span>⬇️</span> Download ID Card (PNG)
            </button>
          </div>
        )}

        {activeTab === 'score' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-bold mb-6">Academic Score Card</h3>
            {myScoreCard ? (
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b pb-4 border-slate-100">
                  <div><p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Issued on</p><p className="font-bold text-slate-900">{new Date(myScoreCard.uploadedAt).toLocaleDateString()}</p></div>
                  <div className="text-right"><p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Result</p><p className="font-bold text-green-600">PASS</p></div>
                </div>
                <div className="grid gap-4">
                  {myScoreCard.scores.map(s => (
                    <div key={s.subject} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                      <span className="font-bold text-slate-700">{s.subject}</span>
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${s.marks}%` }}></div></div>
                        <span className="font-bold text-blue-900">{s.marks}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 italic">Score card not uploaded yet.</div>
            )}
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-bold mb-2">General Notices</h3>
            {state.notices.map(n => (
              <div key={n.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-yellow-500 border border-slate-100">
                <p className="text-slate-800 text-lg">{n.content}</p>
                <p className="text-slate-400 text-xs mt-3 font-bold uppercase tracking-widest">{n.date}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-bold mb-6">Personal Faculty Feedback</h3>
            {student.feedback ? (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-900 text-white flex items-center justify-center rounded-lg font-bold">"</div>
                <p className="text-blue-900 italic text-lg leading-relaxed">{student.feedback}</p>
                <p className="mt-4 text-xs font-bold text-blue-400 text-right uppercase tracking-widest">— Managing Director</p>
              </div>
            ) : (
              <p className="text-slate-400 italic text-center py-8">No feedback recorded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
