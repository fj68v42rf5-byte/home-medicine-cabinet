import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, RefreshCw, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { getExpiredMedications } from '../services/expiryService';

export default function ShoppingList({ medications, onRestockMedication }) {
  const [selectedMed, setSelectedMed] = useState(null);
  const [restockQty, setRestockQty] = useState(30);
  const [restockExpiry, setRestockExpiry] = useState('');

  // Items needing restock: Depleted (qty=0), Expired, or Low Stock (qty <= 3)
  const expiredMeds = getExpiredMedications(medications);
  const depletedMeds = medications.filter(m => (m.quantity || 0) === 0);
  const lowStockMeds = medications.filter(m => (m.quantity || 0) > 0 && (m.quantity || 0) <= 3);

  // Combine unique items needing purchase
  const itemsToBuyMap = new Map();
  
  depletedMeds.forEach(m => itemsToBuyMap.set(m.id, { ...m, reason: 'Out of stock (0 left)' }));
  expiredMeds.forEach(m => {
    if (!itemsToBuyMap.has(m.id)) {
      itemsToBuyMap.set(m.id, { ...m, reason: 'Expired - Needs fresh replacement' });
    }
  });
  lowStockMeds.forEach(m => {
    if (!itemsToBuyMap.has(m.id)) {
      itemsToBuyMap.set(m.id, { ...m, reason: `Low stock (${m.quantity} left)` });
    }
  });

  const shoppingItems = Array.from(itemsToBuyMap.values());

  const handleOpenRestock = (med) => {
    setSelectedMed(med);
    setRestockQty(med.defaultQuantity || 30);
    // Set default next year expiry
    const defaultNextYear = new Date();
    defaultNextYear.setFullYear(defaultNextYear.getFullYear() + 2);
    setRestockExpiry(defaultNextYear.toISOString().split('T')[0]);
  };

  const handleConfirmRestock = () => {
    if (!selectedMed || !restockExpiry) return;
    onRestockMedication(selectedMed.id, {
      quantity: restockQty,
      expiryDate: restockExpiry
    });
    setSelectedMed(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600 text-white shadow-md shadow-brand-500/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Smart Pharmacy Restock List</h2>
            <p className="text-xs text-teal-100 font-medium">
              Prevents duplicate purchases by highlighting items that are empty, low, or expired.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
          {shoppingItems.length} Items Needed
        </span>
      </div>

      {shoppingItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Restocks Required!</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your home medicine cabinet is well-stocked and all medications are within their validity dates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shoppingItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-soft transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                      {item.category || 'General'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.name}</h3>
                    {item.brand && <p className="text-xs text-slate-500">{item.brand}</p>}
                  </div>

                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    {item.reason}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <p><strong>Form:</strong> {item.form}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenRestock(item)}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Purchased & Restock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restock Modal */}
      {selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Restock {selectedMed.name}</h3>
            <p className="text-xs text-slate-500">Enter updated pack details to restore item to active cabinet.</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Quantity Count</label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Expiration Date</label>
              <input
                type="date"
                value={restockExpiry}
                onChange={(e) => setRestockExpiry(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedMed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestock}
                className="px-5 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save & Restore to Cabinet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
