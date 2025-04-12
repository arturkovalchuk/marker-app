import React, { useState } from 'react';
import { Plus, X, UserPlus, Phone, Mail, User, Tag } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export function AddUserForm() {
  const { dispatch } = useUsers();
  const navigate = useNavigate();

  // User information states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Tag states
  const [tag, setTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Validation states
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Пожалуйста, введите имя пользователя';
    }

    // Validate email (optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Неверный формат email';
    }

    // Validate phone (optional)
    if (phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userId = crypto.randomUUID();
    dispatch({
      type: 'ADD_USER',
      payload: {
        id: userId,
        name,
        email: email || undefined,
        phone: phone || undefined,
        tags: selectedTags,
      },
    });

    selectedTags.forEach(tag => {
      dispatch({
        type: 'ADD_TAG',
        payload: { userId, tag },
      });
    });

    setName('');
    setEmail('');
    setPhone('');
    setTag('');
    setSelectedTags([]);
    navigate('/users');
  };

  const addTag = () => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
      setTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">Add New User</h1>

      <div className="bg-white shadow-sm rounded-xl p-4 md:p-8 border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User className="h-8 w-8" />
              </div>
              <div className="text-sm text-slate-500">Profile photo (coming soon)</div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`block w-full h-10 px-4 py-2.5 border ${errors.name ? 'border-red-300' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow`}
                placeholder="Enter user name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`block w-full h-10 pl-10 pr-4 py-2.5 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={`block w-full h-10 pl-10 pr-4 py-2.5 border ${errors.phone ? 'border-red-300' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow`}
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Tags / Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-100">
              Preferences / Tags
            </h2>

            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-slate-400" />
                  <span>Add Tags</span>
                </div>
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  id="tag"
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 h-10 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                  placeholder="Enter tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-10 w-10 inline-flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={`flex flex-wrap gap-2 ${selectedTags.length > 0 ? 'min-h-[2rem] mb-6' : 'min-h-0 mb-0'} transition-all duration-200`}>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-medium bg-emerald-50 text-emerald-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 hover:text-emerald-800 transition-colors"
                  >
                    <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100 ${selectedTags.length === 0 ? 'mt-2' : 'mt-0'} transition-all duration-200`}>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex whitespace-nowrap items-center justify-center h-10 px-6 py-0 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Add User</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="w-full sm:w-auto inline-flex whitespace-nowrap items-center justify-center h-10 px-6 py-0 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
