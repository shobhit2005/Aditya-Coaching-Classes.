
import React, { useState } from 'react';
import { SUBJECTS, ADDRESS, CONTACT_PHONE } from '../constants';
import { AppState, CallbackRequest, FreeTrialLead, WebsiteFeedback } from '../types';

interface Props {
  setView: (v: 'home' | 'auth' | 'student' | 'ops') => void;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Home: React.FC<Props> = ({ setView, state, setState }) => {
  const [showTrialForm, setShowTrialForm] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCallbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newReq: CallbackRequest = {
      id: `CB${Date.now()}`,
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, callbackRequests: [...prev.callbackRequests, newReq] }));
    (e.target as HTMLFormElement).reset();
    alert("Request Received! Our team will call you back shortly.");
  };

  const handleTrialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLead: FreeTrialLead = {
      id: `FT${Date.now()}`,
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      trialDate: fd.get('date') as string,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, freeTrialLeads: [...prev.freeTrialLeads, newLead] }));
    setShowTrialForm(false);
    alert("Our team will reach you shortly. Thank you.");
  };

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newFeedback: WebsiteFeedback = {
      id: `WF${Date.now()}`,
      name: fd.get('name') as string,
      phone: fd.get('phone') as string,
      feedback: fd.get('feedback') as string,
      status: 'Received',
      called: false,
      submittedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, websiteFeedbacks: [...prev.websiteFeedbacks, newFeedback] }));
    (e.target as HTMLFormElement).reset();
    alert("Thank you for your valuable feedback!");
  };

  const whyUs = [
    { title: "Expert Mentorship", desc: "One-on-one sessions with our highly qualified faculty members.", icon: "👨‍🏫" },
    { title: "Weekly Test Series", desc: "Regular mock tests designed exactly on the latest JEE & Board patterns.", icon: "📝" },
    { title: "Modern Facilities", desc: "Smart classrooms and a quiet digital library for self-study.", icon: "🏢" },
    { title: "Success Record", desc: "Highest JEE selections in Pratapgarh for 3 consecutive years.", icon: "🏆" }
  ];

  const courseDetails = [
    { 
      name: "JEE Advanced Path", 
      target: "IIT/NIT Aspirants", 
      features: ["Deep Concept Building", "Previous Year Solving", "Time Management Skills"],
      color: "blue"
    },
    { 
      name: "Board Excellence", 
      target: "Class 11th & 12th", 
      features: ["NCERT Masterclass", "Presentation Skills", "Concept Clarity"],
      color: "yellow"
    },
    { 
      name: "Foundation Course", 
      target: "Early Aspirants", 
      features: ["Logical Reasoning", "Science Fundamentals", "Analytical Skills"],
      color: "green"
    }
  ];

  const activeAds = state.advertisements?.filter(ad => ad.active) || [];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Free Trial Modal */}
      {showTrialForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-900 p-8 text-white text-center">
               <h3 className="text-2xl font-black mb-2 uppercase">Start Free Trial</h3>
               <p className="text-slate-400 text-sm italic">Unlock 3-Days Premium Access</p>
            </div>
            <form onSubmit={handleTrialSubmit} className="p-8 space-y-4">
              <input name="name" required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-yellow-500 transition" />
              <input name="phone" type="tel" required placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-yellow-500 transition" />
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Preferred Start Date</label>
                <input name="date" type="date" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-yellow-500 transition" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowTrialForm(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition">Cancel</button>
                <button type="submit" className="flex-[2] bg-yellow-500 text-blue-900 py-4 rounded-2xl font-black text-lg hover:bg-yellow-400 shadow-xl shadow-yellow-500/20">Get Trial Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center bg-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523050853064-8521a20f897c?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-15" alt="HeroBg" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
          <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm mb-6 animate-bounce">
            🚀 Admissions Open 2024-25
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
            The Best <span className="text-yellow-500">JEE Coaching</span> <br/> In Pratapgarh.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
            Join the legacy of toppers at <span className="text-white font-bold underline decoration-yellow-500">Ajeet Nagar's</span> most trusted coaching center. Master Physics, Chemistry, Math & English with specialized paths.
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => setShowTrialForm(true)} 
              className="bg-yellow-500 text-blue-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(234,179,8,0.3)]"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="bg-white/5 backdrop-blur-xl border-2 border-white/10 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all"
            >
              Explore Courses
            </button>
          </div>
        </div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute right-[-10%] top-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
      </section>

      {/* Advertisements Section */}
      {activeAds.length > 0 && (
        <section className="py-12 bg-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
             <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
                {activeAds.map((ad) => (
                  <div key={ad.id} className="min-w-[320px] md:min-w-[450px] bg-white rounded-3xl overflow-hidden shadow-xl snap-center border border-slate-200 group">
                    <div className="h-48 overflow-hidden relative">
                       <img src={ad.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={ad.title} />
                       <div className="absolute top-4 right-4 bg-yellow-500 text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">Featured Offer</div>
                    </div>
                    <div className="p-6">
                       <h3 className="font-black text-xl text-slate-900 mb-2">{ad.title}</h3>
                       <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{ad.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Why Aditya Coaching?</h2>
            <div className="h-2 w-32 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-10">
            {whyUs.map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Courses Section */}
      <section id="courses" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Explore Our Paths</h2>
              <p className="text-lg text-slate-600">Tailored curriculum designed for both competitive excellence and academic brilliance.</p>
            </div>
            <div className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-full font-bold text-sm shadow-lg">
              ₹1200 Per Subject
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courseDetails.map((course, idx) => (
              <div key={idx} className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full ${course.color === 'blue' ? 'bg-blue-600' : course.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-600'}`}></div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">{course.name}</h3>
                <p className="text-blue-600 font-bold mb-8">{course.target}</p>
                <ul className="space-y-4 mb-10">
                  {course.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-slate-600">
                      <span className="text-yellow-500 font-bold">✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setShowTrialForm(true)}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-colors"
                >
                  Start Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Expert Mentors</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg italic">"Teachers who inspire are the ones who change lives."</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {state.faculty.map((f, i) => (
              <div key={i} className="group relative rounded-[40px] overflow-hidden shadow-lg h-[450px]">
                {f.image ? (
                   <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                ) : (
                   <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white text-6xl font-black">{f.name[0]}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-black text-2xl text-white mb-1">{f.name}</h3>
                  <p className="text-yellow-400 font-bold text-sm mb-2 uppercase tracking-widest">{f.degree}</p>
                  <p className="text-white/70 text-sm italic">{f.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Performers Advert Section */}
      {state.bestPerformers && state.bestPerformers.length > 0 && (
        <section className="py-24 bg-blue-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Success Stories</h2>
              <p className="text-yellow-400 font-bold uppercase tracking-[0.3em] text-sm italic">PROVEN RESULTS • JEE • CBSE • UP BOARD</p>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              {state.bestPerformers.map((p) => (
                <div key={p.id} className="w-72 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[40px] transform hover:rotate-3 transition duration-300">
                  <div className="h-64 rounded-3xl overflow-hidden mb-6 border-4 border-white/10">
                    <img src={p.photo} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                  </div>
                  <h3 className="font-black text-xl text-white text-center mb-1 uppercase">{p.name}</h3>
                  <p className="text-yellow-400 font-black text-center text-sm">{p.achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* General Website Feedback Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Student & Parent Feedback</h2>
            <p className="text-slate-500">Your opinion helps us build a better academic future for everyone.</p>
          </div>
          <form onSubmit={handleFeedbackSubmit} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input name="name" required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-yellow-500 transition" />
              <input name="phone" required type="tel" placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-yellow-500 transition" />
            </div>
            <textarea name="feedback" required placeholder="Describe your experience or suggestion..." className="w-full bg-slate-50 border border-slate-200 p-6 rounded-2xl outline-none focus:border-yellow-500 transition min-h-[150px]" />
            <button className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-800 shadow-xl shadow-blue-900/20">Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8 leading-tight">Drop By Our <br/> <span className="text-yellow-500">Pratapgarh Campus</span></h2>
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">📍</div>
                <div>
                  <h4 className="font-black text-xl mb-1">Our Address</h4>
                  <p className="text-slate-400 text-lg">{ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">📞</div>
                <div>
                  <h4 className="font-black text-xl mb-1">Call Helpline</h4>
                  <p className="text-slate-400 text-lg">{CONTACT_PHONE}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-yellow-500 rounded-[50px] blur-2xl opacity-10 group-hover:opacity-20 transition"></div>
            <div className="relative bg-white/5 p-12 rounded-[50px] border border-white/10 backdrop-blur-xl">
              <h3 className="text-3xl font-black mb-6">Quick Inquiry</h3>
              <form onSubmit={handleCallbackSubmit} className="space-y-6">
                <input name="name" required type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-yellow-500 transition" />
                <input name="phone" required type="tel" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-yellow-500 transition" />
                <button type="submit" className="w-full bg-yellow-500 text-blue-900 py-4 rounded-xl font-black text-lg hover:bg-yellow-400">Request Callback</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
