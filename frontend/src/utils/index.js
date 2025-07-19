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

// Generate random password
export const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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