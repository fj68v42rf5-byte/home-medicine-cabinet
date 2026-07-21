import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import MedCard from './components/MedCard';
import AddMedModal from './components/AddMedModal';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import ExpiredFolder from './components/ExpiredFolder';
import ShoppingList from './components/ShoppingList';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { getActiveMedications, getExpiredMedications, getExpiringSoonMedications } from './services/expiryService';
import { PRESET_CATEGORIES } from './data/mockMedDatabase';
import { Pill, Plus, Filter, ShieldCheck, Sparkles, Inbox, Search } from 'lucide-react';

function MainApp() {
  const {
    currentUser,
    medications,
    addMedication,
    editMedication,
    deleteMedication,
    updateQuantity
  } = useAuth();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'expiring' | 'expired' | 'shopping'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [scannedInitialData, setScannedInitialData] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Categorize medications using expiry service
  const activeMeds = getActiveMedications(medications);
  const expiredMeds = getExpiredMedications(medications);
  const expiringSoonMeds = getExpiringSoonMedications(medications);

  // Filter based on active tab, search query, and category filter
  let displayedMeds = activeMeds;
  if (activeTab === 'expiring') {
    displayedMeds = expiringSoonMeds;
  }

  if (categoryFilter !== 'All') {
    displayedMeds = displayedMeds.filter(m => m.category === categoryFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedMeds = displayedMeds.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.brand?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.notes?.toLowerCase().includes(q)
    );
  }

  // Handlers
  const handleSaveMedication = (formData) => {
    if (editingMed) {
      editMedication(editingMed.id, formData);
      showToast(`Updated "${formData.name}" details successfully.`, 'success');
    } else {
      addMedication(formData);
      showToast(`Added "${formData.name}" to your medicine cabinet.`, 'success');
    }
    setEditingMed(null);
    setScannedInitialData(null);
  };

  const handleDeleteMedication = (id) => {
    deleteMedication(id);
    showToast('Medication record removed.', 'info');
  };

  const handleUpdateQuantity = (id, delta) => {
    updateQuantity(id, delta);
  };

  const handleBarcodeFound = (lookupResult) => {
    if (lookupResult.found) {
      setScannedInitialData(lookupResult.medication);
      setIsAddModalOpen(true);
      showToast(`Found "${lookupResult.medication.name}" via ${lookupResult.source}! Form pre-filled.`, 'success');
    } else {
      setScannedInitialData(lookupResult.medication);
      setIsAddModalOpen(true);
      showToast(`Barcode ${lookupResult.medication.barcode} not found in database. Please enter details manually.`, 'warning');
    }
  };

  const handleRestockMedication = (id, restockData) => {
    editMedication(id, {
      quantity: restockData.quantity,
      expiryDate: restockData.expiryDate
    });
    showToast('Medication restocked and returned to active cabinet!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      
      {/* Light Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingMed(null);
          setScannedInitialData(null);
          setIsAddModalOpen(true);
        }}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Stats Overview Bar */}
        <StatsOverview
          medications={medications}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab 1 & Tab 2: Active Cabinet & Expiring Soon */}
        {(activeTab === 'active' || activeTab === 'expiring') && (
          <div className="space-y-6">
            
            {/* Filter & Category Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Category:
                </span>

                <button
                  onClick={() => setCategoryFilter('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    categoryFilter === 'All'
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>

                {PRESET_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs font-medium text-slate-500 shrink-0">
                Showing <strong className="font-bold text-slate-900">{displayedMeds.length}</strong> items
              </div>
            </div>

            {/* Grid of Medication Cards */}
            {displayedMeds.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Medications Found</h3>
                <p className="text-sm text-slate-500 mb-6">
                  {searchQuery || categoryFilter !== 'All'
                    ? 'No medications match your search criteria or category filter.'
                    : 'Your home cabinet is empty. Add your first medication manually or scan a barcode box.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsScanModalOpen(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    Scan Barcode
                  </button>
                  <button
                    onClick={() => {
                      setEditingMed(null);
                      setScannedInitialData(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    + Add Medication
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedMeds.map((med) => (
                  <MedCard
                    key={med.id}
                    medication={med}
                    onEdit={(m) => {
                      setEditingMed(m);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteMedication}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Dedicated Expired Folder */}
        {activeTab === 'expired' && (
          <ExpiredFolder
            expiredMeds={expiredMeds}
            onDelete={handleDeleteMedication}
            onAddToShoppingList={(med) => {
              setActiveTab('shopping');
            }}
          />
        )}

        {/* Tab 4: Smart Shopping / Restock List */}
        {activeTab === 'shopping' && (
          <ShoppingList
            medications={medications}
            onRestockMedication={handleRestockMedication}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-600">
            Curamed © {new Date().getFullYear()} • Home Medicine Cabinet & Expiry Tracker
          </p>
          <p className="text-slate-400">
            Logged in as <strong className="text-slate-700 font-bold">{currentUser?.name}</strong> • Isolated User Database
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddMedModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMed(null);
          setScannedInitialData(null);
        }}
        onSave={handleSaveMedication}
        editingMed={editingMed}
        initialData={scannedInitialData}
        onScanClick={() => setIsScanModalOpen(true)}
      />

      <BarcodeScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onBarcodeFound={handleBarcodeFound}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
