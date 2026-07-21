import React, { useState, useEffect } from 'react';
import { X, Pill, Calendar, MapPin, Tag, Barcode, Check, Scan } from 'lucide-react';
import { PRESET_CATEGORIES, PRESET_FORMS, PRESET_LOCATIONS } from '../data/mockMedDatabase';

export default function AddMedModal({ isOpen, onClose, onSave, editingMed = null, initialData = null, onScanClick }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Pain Relief',
    form: 'Tablets',
    quantity: 1,
    unit: 'pills',
    expiryDate: '',
    location: 'Medicine Cabinet',
    barcode: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingMed) {
      setFormData({ ...editingMed });
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        quantity: initialData.defaultQuantity || initialData.quantity || 1
      }));
    } else {
      // Reset form
      setFormData({
        name: '',
        brand: '',
        category: 'Pain Relief',
        form: 'Tablets',
        quantity: 20,
        unit: 'pills',
        expiryDate: '',
        location: 'Medicine Cabinet',
        barcode: '',
        notes: ''
      });
    }
    setErrors({});
  }, [editingMed, initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required.';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiration date is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingMed ? 'Edit Medication' : 'Add Medication'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingMed ? 'Update medication details and stock count' : 'Enter medication information to track in your home pharmacy'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scan Barcode Callout */}
        {!editingMed && (
          <div className="px-6 py-3 bg-brand-50/60 border-b border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-brand-900 font-medium">
              <Scan className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Have a medication box with a barcode?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onScanClick();
              }}
              className="text-xs font-bold text-brand-700 hover:text-brand-900 underline flex items-center gap-1"
            >
              Scan with Camera
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          
          {/* Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Medication Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g. Tylenol, Bayer, Advil"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Expiration Date & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                  errors.expiryDate ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.expiryDate && <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remaining Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unit Type
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="pills">pills / tablets</option>
                  <option value="doses">doses</option>
                  <option value="bottles">bottles</option>
                  <option value="packs">packs</option>
                  <option value="sachets">sachets</option>
                  <option value="ml">ml (liquid)</option>
                  <option value="sprays">sprays</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category & Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {PRESET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dosage Form
              </label>
              <select
                value={formData.form}
                onChange={(e) => handleChange('form', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {PRESET_FORMS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cabinet Location & Barcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Storage Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {PRESET_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Barcode / EAN (Optional)
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                placeholder="e.g. 5000223456789"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Usage Instructions / Notes
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Take 1 tablet twice a day with meal. For high fever."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
            ></textarea>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingMed ? 'Save Changes' : 'Add Medication'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
