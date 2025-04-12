import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import { AddUserForm } from './components/AddUserForm';
import { UserList } from './components/UserList';
import UserDetail from './pages/Users/UserDetail/UserDetail';
import CampaignsPage from './pages/Campaigns/CampaignsPage';
import CampaignFlow from './pages/Campaigns/CampaignFlow';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center w-full">
              <div className="flex w-full space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-emerald-600 border-b-2 border-emerald-500' 
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  <UserPlus className="h-5 w-5 mr-1.5" />
                  <span>Add User</span>
                </NavLink>
                <NavLink
                  to="/users"
                  className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-emerald-600 border-b-2 border-emerald-500' 
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  <Users className="h-5 w-5 mr-1.5" />
                  <span>Users</span>
                </NavLink>
                <NavLink
                  to="/campaigns"
                  className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-emerald-600 border-b-2 border-emerald-500' 
                      : 'text-slate-600 hover:text-emerald-600'
                  }`}
                >
                  Campaigns
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <Routes>
          <Route path="/" element={<AddUserForm />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id/flow" element={<CampaignFlow />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
