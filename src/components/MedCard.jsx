import React from 'react';
import { Edit2, Trash2, Plus, Minus, Calendar, MapPin, Barcode, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getExpiryStatus, formatDate } from '../services/expiryService';

export default function MedCard({ medication, onEdit, onDelete, onUpdateQuantity }) {
  const {
    id,
    name,
    brand,
    category,
    form,
    quantity = 0,
    unit = 'pills',
    expiryDate,
    location,
    barcode,
    notes,
    image
  } = medication;

  const expiry = getExpiryStatus(expiryDate);
  const isOut = quantity <= 0;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-soft flex flex-col justify-between overflow-hidden group ${
      expiry.code === 'EXPIRED'
        ? 'border-red-200 bg-red-50/20'
        : expiry.code === 'EXPIRING_SOON'
        ? 'border-amber-200 bg-amber-50/10'
        : 'border-slate-200/90'
    }`}>
      
      {/* Top Header Card */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {category || 'General'}
              </span>
              {location && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {location}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
              {name}
            </h3>
            {brand && <p className="text-xs text-slate-500 font-medium">{brand}</p>}
          </div>

          {/* Expiry Badge */}
          <div className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 shrink-0 ${expiry.badgeBg}`}>
            {expiry.code === 'EXPIRED' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : expiry.code === 'EXPIRING_SOON' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{expiry.label}</span>
          </div>
        </div>

        {/* Notes preview */}
        {notes && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
            "{notes}"
          </p>
        )}

        {/* Metadata Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Exp: <strong className="font-semibold text-slate-800">{formatDate(expiryDate)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Form: <strong className="font-semibold text-slate-800">{form || 'Pills'}</strong></span>
          </div>
        </div>

        {barcode && (
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Barcode className="w-3.5 h-3.5" />
            <span>{barcode}</span>
          </div>
        )}
      </div>

      {/* Quantity & Controls Footer */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        
        {/* Quantity display & quick + / - buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(id, -1)}
            disabled={quantity <= 0}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold transition-all"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <div className="text-center min-w-[60px]">
            <span className={`text-sm font-extrabold ${isOut ? 'text-red-600' : 'text-slate-900'}`}>
              {quantity}
            </span>
            <span className="text-[11px] text-slate-500 font-medium ml-1">{unit}</span>
          </div>

          <button
            onClick={() => onUpdateQuantity(id, 1)}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Edit & Delete actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(medication)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Edit Medication"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Medication"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
