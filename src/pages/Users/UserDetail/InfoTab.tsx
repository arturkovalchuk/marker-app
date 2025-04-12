import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Tag, FileText, BarChart2, Plus, X } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';

const InfoTab = () => {
  const { userId } = useParams<{ userId: string }>();
  const { dispatch, getUserById } = useUsers();
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const user = userId ? getUserById(userId) : undefined;

  if (!user) {
    return null;
  }

  const visitHistory = user.visitHistory || [];
  const totalVisits = visitHistory.length;
  const totalSpent = visitHistory.reduce((sum, visit) => sum + (visit.amount || 0), 0);
  const avgSpent = totalVisits > 0 ? (totalSpent / totalVisits).toFixed(2) : 0;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !user.tags.includes(newTag.trim())) {
      try {
        dispatch({
          type: 'ADD_TAG',
          payload: { userId: user.id, tag: newTag.trim() },
        });
        setNewTag('');
        setSaveError(null);
      } catch (error) {
        setSaveError('Failed to add tag. Please try again.');
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    try {
      dispatch({
        type: 'REMOVE_TAG',
        payload: { userId: user.id, tag },
      });
      setSaveError(null);
    } catch (error) {
      setSaveError('Failed to remove tag. Please try again.');
    }
  };

  const handleSaveNotes = () => {
    try {
      dispatch({
        type: 'UPDATE_USER',
        payload: { id: user.id, notes: newNote },
      });
      setSaveError(null);
    } catch (error) {
      setSaveError('Failed to save notes. Please check your connection and try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      {(user.email || user.phone) && (
        <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.email && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
            )}

            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Card */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          <span className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-slate-400" />
            Statistics
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500">Total Visits</p>
            <p className="text-xl font-bold text-slate-800">{totalVisits}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500">Total Spent</p>
            <p className="text-xl font-bold text-slate-800">${totalSpent}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500">Average Spent</p>
            <p className="text-xl font-bold text-slate-800">${avgSpent}</p>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          <span className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-slate-400" />
            Preferences / Tags
          </span>
        </h2>
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {user.tags.length > 0 ? (
            user.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-medium bg-emerald-50 text-emerald-700"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex items-center hover:text-emerald-800 transition-colors"
                >
                  <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No tags added yet</p>
          )}
        </div>

        <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row gap-3">
          <input
            id="newTag"
            name="newTag"
            type="text"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            className="w-full sm:flex-1 h-10 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            placeholder="Add new tag"
          />
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex whitespace-nowrap items-center justify-center h-10 px-4 sm:px-6 py-0 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Add Tag</span>
          </button>
        </form>

        {saveError && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">{saveError}</div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          <span className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-slate-400" />
            Notes
          </span>
        </h2>

        <div className="space-y-4">
          <textarea
            value={newNote || user.notes || ''}
            onChange={e => setNewNote(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            placeholder="Add notes about this user..."
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
