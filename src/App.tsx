import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Users, UserPlus, Menu, X } from 'lucide-react';
import { UserProvider } from './context/UserContext';
import { AddUserForm } from './components/AddUserForm';
import { UserList } from './components/UserList';
import UserDetail from './pages/Users/UserDetail/UserDetail';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-md text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                  <div className="hidden md:flex space-x-8">
                    <Link
                      to="/"
                      className="flex items-center px-2 py-2 text-slate-900 hover:text-emerald-600"
                    >
                      <UserPlus className="h-6 w-6 mr-2" />
                      <span className="font-medium">Add User</span>
                    </Link>
                    <Link
                      to="/users"
                      className="flex items-center px-2 py-2 text-slate-900 hover:text-emerald-600"
                    >
                      <Users className="h-6 w-6 mr-2" />
                      <span className="font-medium">Users</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/"
                    className="flex items-center px-3 py-2 rounded-md text-slate-900 hover:text-emerald-600 hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-6 w-6 mr-2" />
                    <span className="font-medium">Add User</span>
                  </Link>
                  <Link
                    to="/users"
                    className="flex items-center px-3 py-2 rounded-md text-slate-900 hover:text-emerald-600 hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="h-6 w-6 mr-2" />
                    <span className="font-medium">Users</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
            <Routes>
              <Route path="/" element={<AddUserForm />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/user/:userId" element={<UserDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
