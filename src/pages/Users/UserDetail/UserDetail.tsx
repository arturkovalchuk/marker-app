import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User as UserIcon } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';
import InfoTab from './InfoTab';
import VisitsTab from './VisitsTab';
import CommunicationTab from './CommunicationTab';

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById } = useUsers();
  const [activeTab, setActiveTab] = useState<'info' | 'visits' | 'communication'>('info');

  const user = userId ? getUserById(userId) : undefined;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">User not found</h2>
          <p className="mt-2 text-sm text-slate-500">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/users')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/users')}
          className="w-full sm:hidden inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Users
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">ID: {user.id}</p>
              <p className="text-slate-500 text-xs">
                Registered: {formatDate(user.registrationDate || new Date().toISOString())}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/users')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Users
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            User Information
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'visits'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Visit History
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'communication'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Communication
          </button>
        </div>
      </div>

      {activeTab === 'info' && <InfoTab />}
      {activeTab === 'visits' && <VisitsTab />}
      {activeTab === 'communication' && <CommunicationTab />}
    </div>
  );
};

export default UserDetail;
