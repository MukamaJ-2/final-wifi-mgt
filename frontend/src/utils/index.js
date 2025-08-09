// Date formatting utility
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate password in format "guest@ucu.ac.XXXX"
export const generatePassword = () => {
  const uniqueDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `guest@ucu.ac.${uniqueDigits}`;
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation for admin (letters@numbers format)
export const isValidAdminPassword = (password) => {
  const passwordRegex = /^[a-zA-Z]+@\d+$/;
  return passwordRegex.test(password);
};

// Admin email validation (accepts all valid email formats)
export const isValidAdminEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Add days to date
export const addDaysToDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Check if date is expired
export const isExpired = (date) => {
  return new Date(date) < new Date();
};

// Get user status
export const getUserStatus = (user) => {
  if (isExpired(user.expires_at)) return 'expired';
  if (!user.is_active) return 'inactive';
  return 'active';
};

// Get status color classes
export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    case 'inactive':
      return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700';
    case 'expired':
      return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    default:
      return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700';
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Calendar-style expiration formatter
export const formatDateTimeCountdown = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;

  if (isNaN(target.getTime())) return 'Invalid date';
  if (diff <= 0) {
    return 'Expired';
  }

  // Calculate time left
  let seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  // Unique calendar-like display
  return (
    `<span style="display:inline-block;text-align:center;min-width:60px;">
      <span style="display:inline-block;background:#e0e7ff;color:#3730a3;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${days}d</span>
      <span style="display:inline-block;background:#f1f5f9;color:#0f172a;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${hours}h</span>
      <span style="display:inline-block;background:#fef9c3;color:#92400e;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${minutes}m</span>
      <span style="display:inline-block;background:#fee2e2;color:#991b1b;font-weight:bold;padding:2px 8px;border-radius:6px;margin:0 2px;">${seconds}s</span>
    </span>`
  );
};