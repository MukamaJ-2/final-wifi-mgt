import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Trash2, Clock, User, Search, Filter, Eye, EyeOff, Users } from 'lucide-react';
import { formatDate, formatDateTimeCountdown } from '../utils';

const UserList = ({ users, onToggleStatus, onDeleteUser, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getStatusColor = (user) => {
    const now = new Date();
    const isExpired = new Date(user.expires_at) < now;
    
    if (isExpired) return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (!user.is_active) return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700';
    return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
  };

  const getStatusText = (user) => {
    const now = new Date();
    const isExpired = new Date(user.expires_at) < now;
    
    if (isExpired) return 'Expired';
    if (!user.is_active) return 'Inactive';
    return 'Active';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const isExpired = new Date(user.expires_at) < now;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = user.is_active && !isExpired;
    if (statusFilter === 'inactive') matchesStatus = !user.is_active;
    if (statusFilter === 'expired') matchesStatus = isExpired;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Users...</h3>
        <p className="text-slate-600 dark:text-slate-400">Please wait while we fetch your data.</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
          <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Users Yet</h3>
        <p className="text-slate-600 dark:text-slate-400">Create your first guest user to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Guest Users ({filteredUsers.length})
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Manage your guest user accounts</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.username}</div>
                      {user.full_name && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {user.full_name}
                        </div>
                      )}
                      {user.email && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          📧 {user.email}
                        </div>
                      )}
                      {user.phone_number && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          📞 {user.phone_number}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Password:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {showPasswords[user.id] ? user.password : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPasswords[user.id] ? 
                              <EyeOff className="w-4 h-4" /> : 
                              <Eye className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user)}`}>
                    {getStatusText(user)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(new Date(user.created_at))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {/* Use the new countdown formatter with HTML */}
                    <span
                      className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                      dangerouslySetInnerHTML={{ __html: formatDateTimeCountdown(user.expires_at) }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onToggleStatus(user.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        user.is_active 
                          ? 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800' 
                          : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {user.is_active ? 
                        <ToggleRight className="w-4 h-4" /> : 
                        <ToggleLeft className="w-4 h-4" />
                      }
                      <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                    
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="flex items-center space-x-2 px-3 py-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="p-12 text-center">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No users found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserList;