import React from 'react';
import { Pill, Plus, Scan, User, LogOut, Download, AlertTriangle, ShieldCheck, ShoppingCart, Archive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getExpiredMedications, getExpiringSoonMedications } from '../services/expiryService';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenScanModal,
  onOpenAuthModal,
  searchQuery,
  setSearchQuery
}) {
  const { currentUser, medications, exportUserData } = useAuth();

  const expiredCount = getExpiredMedications(medications).length;
  const expiringSoonCount = getExpiringSoonMedications(medications).length;
  const lowStockCount = medications.filter(m => (m.quantity || 0) === 0).length;
  const shoppingCount = expiredCount + lowStockCount;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('active')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Pill className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 bg-clip-text text-transparent">
                Curamed
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Home Cabinet
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medication name, category, or location..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scan Barcode */}
            <button
              onClick={onOpenScanModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 rounded-xl transition-colors"
              title="Scan medication barcode"
            >
              <Scan className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">Scan Barcode</span>
            </button>

            {/* Add Medication */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm shadow-brand-600/20 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Med</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Account Switcher Badge */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left group"
              title="Switch user account"
            >
              <div className={`w-7 h-7 rounded-lg ${currentUser?.avatarColor || 'bg-teal-500'} flex items-center justify-center text-white text-xs font-bold shadow-xs`}>
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">Personal Cabinet</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 overflow-x-auto no-scrollbar py-2 text-sm font-semibold">
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Active Cabinet */}
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Active Cabinet</span>
            </button>

            {/* Expiring Soon */}
            <button
              onClick={() => setActiveTab('expiring')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all relative ${
                activeTab === 'expiring'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Expiring Soon</span>
              {expiringSoonCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-500 text-white">
                  {expiringSoonCount}
                </span>
              )}
            </button>

            {/* Dedicated Expired Folder */}
            <button
              onClick={() => setActiveTab('expired')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all relative ${
                activeTab === 'expired'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Expired Folder</span>
              {expiredCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-extrabold rounded-full bg-red-100 text-red-700">
                  {expiredCount}
                </span>
              )}
            </button>

            {/* Smart Shopping / Restock List */}
            <button
              onClick={() => setActiveTab('shopping')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'shopping'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Restock List</span>
              {shoppingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-extrabold rounded-full bg-brand-100 text-brand-800">
                  {shoppingCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Export Backup */}
          <button
            onClick={exportUserData}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Download JSON Backup of your medicine cabinet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </header>
  );
}
