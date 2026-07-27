import React, { useState } from 'react';
import { X, UserPlus, LogIn, UserCheck, Shield, Sparkles, Check, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { users, currentUser, registerUser, switchAccount, logoutUser } = useAuth();
  
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');

    const res = registerUser(name, email);
    if (!res.success) {
      setError(res.error);
      return;
    }

    setName('');
    setEmail('');
    setIsCreating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Accounts & Profiles</h2>
              <p className="text-xs text-slate-500">Isolated medicine cabinets per user</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          
          {/* Active Account Banner */}
          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${currentUser?.avatarColor || 'bg-brand-500'} flex items-center justify-center text-white text-base font-bold shadow-xs`}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-brand-800 font-bold uppercase tracking-wider">Active Personal Cabinet</p>
              <h4 className="text-sm font-extrabold text-slate-900 truncate">{currentUser?.name}</h4>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-brand-600 text-white shadow-2xs">
              Active
            </span>
          </div>

          {/* User Account Switcher List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select or Switch Profile:
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {users.map(u => {
                const isActive = u.id === currentUser?.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchAccount(u.id);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'border-brand-500 bg-brand-50/30 font-bold'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${u.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white text-xs font-bold`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </div>

                    {isActive && <Check className="w-4 h-4 text-brand-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Register Form */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-brand-600" />
              <span>Create New Personal Account</span>
            </button>
          ) : (
            <form onSubmit={handleCreateUser} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">New Personal Profile</h4>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs"
                >
                  Create Profile
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-red-100 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Lock Cabinet</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
