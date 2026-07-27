import React, { useState } from 'react';
import { Pill, Scan, ShieldCheck, ShoppingCart, UserCheck, ChevronRight, ChevronLeft, ArrowRight, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OnboardingView({ onRegisterSuccess }) {
  const { users, registerUser, loginUser } = useAuth();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');

  const slides = [
    {
      title: "Your Smart Personal Medicine Cabinet",
      subtitle: "Curamed solves home pharmacy headaches: no more forgetting what drugs you have, buying expensive duplicate boxes, or letting expiration dates slip by.",
      icon: <Pill className="w-16 h-16 text-teal-600 stroke-[2.2]" />,
      bgColor: "from-teal-50 to-emerald-50/40",
      accentColor: "border-teal-200 bg-teal-50 text-teal-700"
    },
    {
      title: "Camera Barcode Auto-Fill",
      subtitle: "Scan drug barcodes with your device camera to instantly retrieve names, forms, and suggested counts. Includes fallback manual EAN lookup and instant database lookup.",
      icon: <Scan className="w-16 h-16 text-sky-600 stroke-[2.2]" />,
      bgColor: "from-sky-50 to-blue-50/40",
      accentColor: "border-sky-200 bg-sky-50 text-sky-700"
    },
    {
      title: "Smart Expiry Auto-Segregation",
      subtitle: "Curamed tracks current dates and compares them to your inventory. Any drug that expires is automatically moved out of your active cabinet to a dedicated warning folder.",
      icon: <ShieldCheck className="w-16 h-16 text-emerald-600 stroke-[2.2]" />,
      bgColor: "from-emerald-50 to-teal-50/40",
      accentColor: "border-emerald-200 bg-emerald-50 text-emerald-700"
    },
    {
      title: "Smart Restock & Purchase Lists",
      subtitle: "Items that run out (quantity reaches 0) or expire are automatically listed on a smart Restock List. Check off items as you buy them to return them to the cabinet.",
      icon: <ShoppingCart className="w-16 h-16 text-indigo-600 stroke-[2.2]" />,
      bgColor: "from-indigo-50 to-violet-50/40",
      accentColor: "border-indigo-200 bg-indigo-50 text-indigo-700"
    },
    {
      title: "100% Isolated & Private Cabinets",
      subtitle: "Your medicine data is bound exclusively to your local profile. Different family members can maintain separate cabinets on the same device with complete privacy.",
      icon: <UserCheck className="w-16 h-16 text-violet-600 stroke-[2.2]" />,
      bgColor: "from-violet-50 to-rose-50/40",
      accentColor: "border-violet-200 bg-violet-50 text-violet-700"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowRegisterForm(true);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill in both name and email.');
      return;
    }

    const res = registerUser(name, email);
    if (res.success) {
      if (onRegisterSuccess) onRegisterSuccess(name);
    } else {
      setError(res.error);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedUser) {
      setError('Please select a profile to log in.');
      return;
    }

    const res = loginUser(selectedUser);
    if (res.success) {
      if (onRegisterSuccess) onRegisterSuccess('User');
    } else {
      setError(res.error);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden transition-all duration-300">
        
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-sm">
              💊
            </div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-brand-700 bg-clip-text text-transparent">
              Curamed
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            Personal Onboarding
          </span>
        </div>

        {/* Dynamic Area */}
        {!showRegisterForm && !showLoginForm ? (
          /* Onboarding Carousel Slider */
          <div className="p-6 flex flex-col items-center text-center space-y-6">
            
            {/* Visual Icon Box */}
            <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${slide.bgColor} flex items-center justify-center border border-slate-100 shadow-xs animate-bounce-short`}>
              {slide.icon}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {slide.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium px-2 leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? 'w-5 bg-brand-600' : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="w-full pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/10 flex items-center gap-1 transition-all"
              >
                <span>{currentSlide === slides.length - 1 ? "Get Started" : "Next"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Login Option */}
            {users.length > 0 && (
              <button
                type="button"
                onClick={() => setShowLoginForm(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 pt-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Or log in to an existing profile</span>
              </button>
            )}

          </div>
        ) : showRegisterForm ? (
          /* Profile Registration Form */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
            <div className="text-center space-y-1 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Create Personal Cabinet</h2>
              <p className="text-xs text-slate-500">Your profile stores only your medicine cabinet details</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@home.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-medium">
                  {error}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRegisterForm(false);
                  setCurrentSlide(slides.length - 1);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/10 flex items-center gap-1"
              >
                <span>Create Cabinet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {users.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowRegisterForm(false);
                  setShowLoginForm(true);
                }}
                className="w-full text-center text-xs font-bold text-brand-600 hover:text-brand-800 pt-2 border-t border-slate-100/50"
              >
                Already have a profile? Select profile
              </button>
            )}
          </form>
        ) : (
          /* Profile Selection Login Form */
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="text-center space-y-1 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Select Profile</h2>
              <p className="text-xs text-slate-500">Choose a personal profile to open its medicine cabinet</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Choose Profile:</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUser(u.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      selectedUser === u.id
                        ? 'border-brand-500 bg-brand-50/30 font-bold'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${u.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white text-xs font-bold`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-medium">
                  {error}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLoginForm(false);
                  setShowRegisterForm(true);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Register New
              </button>
              
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/10 flex items-center gap-1"
              >
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
