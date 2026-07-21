import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Search, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { lookupBarcode } from '../services/barcodeService';
import { MOCK_BARCODE_DATABASE } from '../data/mockMedDatabase';

export default function BarcodeScannerModal({ isOpen, onClose, onBarcodeFound }) {
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setErrorMessage('');
      setManualCode('');
      return;
    }

    // Auto-start camera when modal opens
    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage('');
    setCameraActive(true);

    try {
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode("reader");
      }

      const config = { fps: 10, qrbox: { width: 250, height: 150 } };
      
      await html5QrcodeRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Barcode successfully scanned!
          await stopCamera();
          handleLookup(decodedText);
        },
        () => {
          // Ignore scanning frame errors
        }
      );
    } catch (err) {
      console.warn("Camera access failed or unavailable:", err);
      setCameraActive(false);
      setErrorMessage("Camera access unavailable. You can enter or select a demo barcode below.");
    }
  };

  const stopCamera = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
    setCameraActive(false);
  };

  const handleLookup = async (codeToLookup) => {
    const code = (codeToLookup || manualCode).trim();
    if (!code) {
      setErrorMessage('Please enter or scan a barcode.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await lookupBarcode(code);
      onBarcodeFound(result);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to lookup barcode details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Scan Medication Barcode</h2>
              <p className="text-xs text-slate-500">Align barcode within frame or type manually</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner View */}
        <div className="p-6 space-y-4">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden min-h-[220px] flex items-center justify-center">
            
            {/* Target element for Html5Qrcode */}
            <div id="reader" className="w-full text-white"></div>

            {!cameraActive && (
              <div className="text-center p-6 text-slate-300">
                <Camera className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                <p className="text-xs text-slate-400">Camera preview inactive or disabled.</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-3 px-4 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
                >
                  Start Camera
                </button>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Barcode Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter Barcode (EAN / UPC / NDC)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g. 5000223456789"
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                onClick={() => handleLookup()}
                disabled={loading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                {loading ? 'Searching...' : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Lookup</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Demo Barcodes for Quick Testing */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Quick Demo Barcodes (Click to test auto-fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_BARCODE_DATABASE.slice(0, 4).map((item) => (
                <button
                  key={item.barcode}
                  onClick={() => handleLookup(item.barcode)}
                  className="p-2 text-left bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-xl transition-all group"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{item.barcode}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
