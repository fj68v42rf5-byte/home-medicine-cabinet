import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Sample seed data for brand-new user accounts to demonstrate functionality
const SEED_MEDICATIONS = [
  {
    id: 'med_seed_1',
    name: 'Ibuprofen 400mg',
    brand: 'Advil',
    category: 'Pain Relief',
    form: 'Tablets',
    quantity: 28,
    unit: 'pills',
    expiryDate: '2027-08-15',
    location: 'Medicine Cabinet',
    barcode: '5000223456789',
    notes: 'Take 1 tablet after meals for pain relief.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med_seed_2',
    name: 'Cetirizine 10mg',
    brand: 'Zyrtec',
    category: 'Allergy',
    form: 'Tablets',
    quantity: 6,
    unit: 'pills',
    expiryDate: '2026-08-10', // Expiring soon! (3 weeks away from July 21 2026)
    location: 'Bedside Drawer',
    barcode: '4008400000000',
    notes: 'Daily antihistamine for seasonal hay fever.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med_seed_3',
    name: 'Amoxicillin 500mg',
    brand: 'Amoxil',
    category: 'Antibiotics',
    form: 'Capsules',
    quantity: 12,
    unit: 'pills',
    expiryDate: '2025-11-20', // Already Expired! Will auto-move to Expired folder
    location: 'Refrigerator',
    barcode: '300450449087',
    notes: 'Old antibiotic prescription from last winter.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med_seed_4',
    name: 'Vitamin C 1000mg',
    brand: 'Emergen-C',
    category: 'Vitamins',
    form: 'Packs / Sachets',
    quantity: 0, // Depleted! Shows in Shopping List
    unit: 'sachets',
    expiryDate: '2027-12-31',
    location: 'Kitchen Shelf',
    barcode: '8712345678901',
    notes: 'Immune support supplement.',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ACCOUNTS = [
  {
    id: 'usr_default',
    name: 'Sarah Jenkins',
    email: 'sarah@home.org',
    avatarColor: 'bg-teal-500'
  },
  {
    id: 'usr_family',
    name: 'Michael (Dad)',
    email: 'michael@home.org',
    avatarColor: 'bg-indigo-500'
  }
];

export function AuthProvider({ children }) {
  // Saved user profiles
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('curamed_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    const savedId = localStorage.getItem('curamed_active_user_id');
    const allUsers = JSON.parse(localStorage.getItem('curamed_accounts') || JSON.stringify(DEFAULT_ACCOUNTS));
    return allUsers.find(u => u.id === savedId) || allUsers[0];
  });

  // Current user's isolated medication list
  const [medications, setMedications] = useState([]);

  // Load medications for current active user
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const userStorageKey = `curamed_meds_${currentUser.id}`;
    const savedMeds = localStorage.getItem(userStorageKey);

    if (savedMeds) {
      try {
        setMedications(JSON.parse(savedMeds));
      } catch (e) {
        console.error('Error parsing stored medications', e);
        setMedications([]);
      }
    } else {
      // Only pre-seed the very first default profile (Sarah Jenkins) with sample data.
      // Other profiles (like Dad or new signups) start with an empty, clean cabinet.
      if (currentUser.id === 'usr_default') {
        localStorage.setItem(userStorageKey, JSON.stringify(SEED_MEDICATIONS));
        setMedications(SEED_MEDICATIONS);
      } else {
        localStorage.setItem(userStorageKey, JSON.stringify([]));
        setMedications([]);
      }
    }

    localStorage.setItem('curamed_active_user_id', currentUser.id);
  }, [currentUser]);

  // Persist medications to current user's isolated storage
  const saveMedications = (newMeds) => {
    if (!currentUser?.id) return;
    setMedications(newMeds);
    const userStorageKey = `curamed_meds_${currentUser.id}`;
    localStorage.setItem(userStorageKey, JSON.stringify(newMeds));
  };

  // Auth Operations
  const loginUser = (emailOrId) => {
    const found = users.find(u => u.email.toLowerCase() === emailOrId.toLowerCase() || u.id === emailOrId);
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, error: 'User account not found.' };
  };

  const registerUser = (name, email) => {
    if (!name || !email) {
      return { success: false, error: 'Name and email are required.' };
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return { success: true, message: 'Account already exists. Switched profile.' };
    }

    const colors = ['bg-teal-500', 'bg-sky-500', 'bg-emerald-500', 'bg-cyan-600', 'bg-violet-500', 'bg-rose-500'];
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('curamed_accounts', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);

    return { success: true };
  };

  const switchAccount = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Medication CRUD Operations
  const addMedication = (medData) => {
    const newMed = {
      ...medData,
      id: `med_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newMed, ...medications];
    saveMedications(updated);
    return newMed;
  };

  const editMedication = (id, updatedData) => {
    const updated = medications.map(m => m.id === id ? { ...m, ...updatedData } : m);
    saveMedications(updated);
  };

  const deleteMedication = (id) => {
    const updated = medications.filter(m => m.id !== id);
    saveMedications(updated);
  };

  const updateQuantity = (id, delta) => {
    const updated = medications.map(m => {
      if (m.id === id) {
        const newQty = Math.max(0, (m.quantity || 0) + delta);
        return { ...m, quantity: newQty };
      }
      return m;
    });
    saveMedications(updated);
  };

  // Export / Import Backup Data
  const exportUserData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: currentUser,
      medications: medications,
      exportedAt: new Date().toISOString()
    }, null, 2));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `med_cabinet_${currentUser.name.replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importUserData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.medications)) {
        saveMedications(parsed.medications);
        return { success: true, count: parsed.medications.length };
      }
      return { success: false, error: 'Invalid backup file structure.' };
    } catch (e) {
      return { success: false, error: 'Failed to parse JSON backup file.' };
    }
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      medications,
      registerUser,
      loginUser,
      switchAccount,
      addMedication,
      editMedication,
      deleteMedication,
      updateQuantity,
      exportUserData,
      importUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
