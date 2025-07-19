import React, { useState } from 'react';
import { Plus, RefreshCw, Calendar, User, Key, Mail, Phone, UserCheck } from 'lucide-react';
import { generatePassword } from '../utils';

const UserForm = ({ onCreateUser, adminEmail }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [baseUsername, setBaseUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expirationDays, setExpirationDays] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !baseUsername.trim() || !password.trim()) return;

    setIsSubmitting(true);
    setError('');
    
    const result = await onCreateUser(
      baseUsername.trim(), 
      password.trim(), 
      expirationDays, 
      adminEmail,
      fullName.trim(),
      email.trim(),
      phoneNumber.trim()
    );
    
    if (result.success) {
      // Reset form
      setTimeout(() => {
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setBaseUsername('');
        setPassword('');
        setExpirationDays(14);
        setIsSubmitting(false);
      }, 500);
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  const getDomainPrefix = () => {
    if (!adminEmail || !adminEmail.includes('@')) {
      return 'domain';
    }
    return adminEmail.split('@')[1].split('.')[0];
  };

  const expirationOptions = [
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks (Default)' },
    { value: 30, label: '1 Month' },
    { value: 60, label: '2 Months' },
    { value: 90, label: '3 Months' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg mr-4">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create New User
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Generate guest access credentials with contact information
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <UserCheck className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="mukama joseph"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              id="userEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="mukamajoseph@gmail.com"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="+256 (706) 807-724"
              required
            />
          </div>
        </div>

        {/* Username and Password */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <User className="w-4 h-4 inline mr-2" />
              Base Username
            </label>
            <input
              id="username"
              type="text"
              value={baseUsername}
              onChange={(e) => setBaseUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="john.doe"
              required
            />
            {baseUsername && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Will create: <span className="font-bold">{baseUsername}_{getDomainPrefix()}</span>
                </p>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Key className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <div className="flex space-x-3">
              <input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center"
                title="Generate Password"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expiration Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            <Calendar className="w-4 h-4 inline mr-2" />
            Expiration Period
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {expirationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setExpirationDays(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  expirationDays === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{option.value} days</p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !fullName.trim() || !email.trim() || !phoneNumber.trim() || !baseUsername.trim() || !password.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Creating User...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Create User & Send Email
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UserForm;