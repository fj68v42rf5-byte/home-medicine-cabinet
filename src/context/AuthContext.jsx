import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Saved user profiles - defaults to empty array to ensure complete privacy
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('curamed_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Current logged in user (null by default if no user is registered/active)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedId = localStorage.getItem('curamed_active_user_id');
    const allUsers = JSON.parse(localStorage.getItem('curamed_accounts') || '[]');
    return allUsers.find(u => u.id === savedId) || null;
  });

  // Current user's isolated medication list
  const [medications, setMedications] = useState([]);

  // Load medications for current active user
  useEffect(() => {
    if (!currentUser?.id) {
      setMedications([]);
      return;
    }
    
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
      // New user accounts start completely empty
      localStorage.setItem(userStorageKey, JSON.stringify([]));
      setMedications([]);
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
      localStorage.setItem('curamed_active_user_id', found.id);
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
      localStorage.setItem('curamed_active_user_id', existing.id);
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
    localStorage.setItem('curamed_active_user_id', newUser.id);

    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('curamed_active_user_id');
  };

  const switchAccount = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('curamed_active_user_id', target.id);
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
    if (!currentUser) return;
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
      logoutUser,
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
