import React from 'react';
import { ShieldCheck, AlertTriangle, Archive, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { getActiveMedications, getExpiredMedications, getExpiringSoonMedications } from '../services/expiryService';

export default function StatsOverview({ medications, activeTab, setActiveTab }) {
  const activeMeds = getActiveMedications(medications);
  const expiredMeds = getExpiredMedications(medications);
  const expiringSoonMeds = getExpiringSoonMedications(medications);
  const lowStockMeds = medications.filter(m => (m.quantity || 0) === 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Active Medications */}
      <div
        onClick={() => setActiveTab('active')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
          activeTab === 'active'
            ? 'bg-white border-brand-500 shadow-soft ring-2 ring-brand-500/20'
            : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-xs hover:shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Meds</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900">{activeMeds.length}</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Safe to use <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Expiring Soon */}
      <div
        onClick={() => setActiveTab('expiring')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
          activeTab === 'expiring'
            ? 'bg-amber-50/50 border-amber-500 shadow-soft ring-2 ring-amber-500/20'
            : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-xs hover:shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Expiring Soon</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900">{expiringSoonMeds.length}</span>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Next 30 days <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Expired Folder (Isolated) */}
      <div
        onClick={() => setActiveTab('expired')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
          activeTab === 'expired'
            ? 'bg-red-50/50 border-red-500 shadow-soft ring-2 ring-red-500/20'
            : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-xs hover:shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Expired Folder</span>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Archive className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900">{expiredMeds.length}</span>
          <span className="text-xs font-semibold text-red-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Auto-isolated <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Low Stock / Restock */}
      <div
        onClick={() => setActiveTab('shopping')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
          activeTab === 'shopping'
            ? 'bg-brand-50/50 border-brand-500 shadow-soft ring-2 ring-brand-500/20'
            : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-xs hover:shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Restock Needed</span>
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-slate-900">{lowStockMeds.length + expiredMeds.length}</span>
          <span className="text-xs font-semibold text-brand-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Avoid duplicates <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
}
