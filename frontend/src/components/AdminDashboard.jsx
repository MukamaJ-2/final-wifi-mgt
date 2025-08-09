import React from 'react';
import { LogOut, Users, Shield, Clock, TrendingUp, Activity, BarChart3, Settings } from 'lucide-react';
import UserForm from './UserForm';
import UserList from './UserList';
import { ThemeToggle } from './ThemeToggle';
import { useGuestUsers } from '../hooks/useGuestUsers';
import { useTheme } from '../hooks/useTheme';

const AdminDashboard = ({ adminEmail, adminId, onLogout }) => {
  const { users, loading, createUser, toggleUserStatus, deleteUser } = useGuestUsers(adminId);
  const { theme, toggleTheme } = useTheme();

  const activeUsers = users.filter(user => user.is_active && new Date(user.expires_at) > new Date()).length;
  const expiredUsers = users.filter(user => new Date(user.expires_at) <= new Date()).length;
  const inactiveUsers = users.filter(user => !user.is_active).length;

  const stats = [
    {
      title: 'Active Users',
      value: activeUsers,
      icon: Users,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      change: '+12%',
      changeColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: Activity,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-900/20',
      borderColor: 'border-slate-200 dark:border-slate-700',
      change: '-3%',
      changeColor: 'text-slate-600 dark:text-slate-400'
    },
    {
      title: 'Expired Users',
      value: expiredUsers,
      icon: Clock,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      change: '+5%',
      changeColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      change: '+8%',
      changeColor: 'text-blue-600 dark:text-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  {adminEmail}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border ${stat.borderColor} p-6 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className={`text-sm font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Form */}
        <div className="mb-8">
          <UserForm onCreateUser={createUser} adminEmail={adminEmail} />
        </div>

        {/* User List */}
        <div>
          <UserList 
            users={users} 
            loading={loading}
            onToggleStatus={toggleUserStatus} 
            onDeleteUser={deleteUser}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;