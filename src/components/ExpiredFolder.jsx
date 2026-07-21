import React from 'react';
import { Archive, AlertOctagon, Trash2, ShoppingCart, Info, ShieldAlert, CheckCircle } from 'lucide-react';
import { formatDate, getDaysUntilExpiry } from '../services/expiryService';

export default function ExpiredFolder({ expiredMeds, onDelete, onAddToShoppingList }) {
  if (expiredMeds.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Expired Folder is Clear</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          All medications in your cabinet are fresh and safe to use. Any items that reach their expiration date will automatically appear in this isolated folder.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Safety Warning Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white shadow-md shadow-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Auto-Isolated Expired Folder ({expiredMeds.length})</h2>
            <p className="text-xs text-red-100 font-medium">
              These medications passed their expiration date and were automatically moved out of your active cabinet.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 whitespace-nowrap">
          ⚠️ Do Not Consume
        </div>
      </div>

      {/* Expired Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expiredMeds.map((med) => {
          const daysAgo = Math.abs(getDaysUntilExpiry(med.expiryDate));

          return (
            <div
              key={med.id}
              className="bg-white rounded-2xl border border-red-200/80 shadow-xs hover:shadow-soft transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200">
                      {med.category || 'Medication'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{med.name}</h3>
                    {med.brand && <p className="text-xs text-slate-500">{med.brand}</p>}
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">
                    Expired {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <p><strong>Expired On:</strong> {formatDate(med.expiryDate)}</p>
                  <p><strong>Remaining Qty:</strong> {med.quantity} {med.unit}</p>
                  <p><strong>Location:</strong> {med.location}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onAddToShoppingList(med)}
                  className="flex-1 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl border border-brand-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Restock / Buy Fresh</span>
                </button>

                <button
                  onClick={() => onDelete(med.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors"
                  title="Remove from record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safe Disposal Guide */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">Safe Medication Disposal Guidelines</h4>
          <p>
            • Drop off expired medications at local community pharmacy take-back locations.
          </p>
          <p>
            • If disposing at home: mix uncrushed pills with undesirable matter (like used coffee grounds or cat litter) in a sealed bag before household trash disposal.
          </p>
        </div>
      </div>

    </div>
  );
}
