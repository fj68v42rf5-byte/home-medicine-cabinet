/**
 * Service handling medication expiration dates and auto-folder segregation logic
 */

/**
 * Calculates remaining days until expiration date
 * @param {string} expiryDateStr - YYYY-MM-DD or YYYY-MM
 * @returns {number} Days difference (negative if past expiry date)
 */
export function getDaysUntilExpiry(expiryDateStr) {
  if (!expiryDateStr) return 999;
  
  // Standardize date input to end of month if only YYYY-MM is provided
  let targetDateStr = expiryDateStr;
  if (/^\d{4}-\d{2}$/.test(expiryDateStr)) {
    const [year, month] = expiryDateStr.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    targetDateStr = `${expiryDateStr}-${String(lastDay).padStart(2, '0')}`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(targetDateStr);
  expiryDate.setHours(23, 59, 59, 999);

  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines expiry status classification and badge styles
 * @param {string} expiryDateStr 
 * @returns {{ code: 'EXPIRED'|'EXPIRING_SOON'|'FRESH', label: string, days: number, color: string, badgeBg: string }}
 */
export function getExpiryStatus(expiryDateStr) {
  const days = getDaysUntilExpiry(expiryDateStr);

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      code: 'EXPIRED',
      label: absDays === 1 ? 'Expired yesterday' : `Expired ${absDays} days ago`,
      days,
      color: 'red',
      badgeBg: 'bg-red-50 text-red-700 border-red-200 shadow-sm'
    };
  }

  if (days === 0) {
    return {
      code: 'EXPIRED',
      label: 'Expires today!',
      days: 0,
      color: 'red',
      badgeBg: 'bg-red-50 text-red-700 border-red-200 shadow-sm animate-pulse'
    };
  }

  if (days <= 30) {
    return {
      code: 'EXPIRING_SOON',
      label: days === 1 ? 'Expires tomorrow' : `Expires in ${days} days`,
      days,
      color: 'amber',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
    };
  }

  // Fresh items
  return {
    code: 'FRESH',
    label: `Valid (${formatDate(expiryDateStr)})`,
    days,
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };
}

/**
 * Formats YYYY-MM-DD into readable English date like "Oct 2026" or "15 Oct 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  } catch (e) {
    return dateStr;
  }
}

/**
 * Returns active (non-expired) medications
 */
export function getActiveMedications(medications = []) {
  return medications.filter(med => getDaysUntilExpiry(med.expiryDate) > 0);
}

/**
 * Returns expired medications for the isolated Expired Folder
 */
export function getExpiredMedications(medications = []) {
  return medications.filter(med => getDaysUntilExpiry(med.expiryDate) <= 0);
}

/**
 * Returns medications expiring within 30 days
 */
export function getExpiringSoonMedications(medications = []) {
  return medications.filter(med => {
    const days = getDaysUntilExpiry(med.expiryDate);
    return days > 0 && days <= 30;
  });
}
