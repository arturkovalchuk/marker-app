import { useState } from 'react';
import { Mail, Phone, FileText, BarChart2, Plus, X } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function InfoTab({ userId }: { userId: string }) {
  const { state, dispatch } = useUsers();
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const user = state.users.find(u => u.id === userId) || {
    id: 'USR001',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    tags: ['VIP', 'Regular Customer', 'Prefers Evening'],
    notes: 'Prefers window seats. Always orders cappuccino. Very friendly.',
    visitHistory: [
      { date: '2024-01-15', amount: 45.50 },
      { date: '2024-01-10', amount: 32.75 },
      { date: '2024-01-05', amount: 28.90 },
      { date: '2023-12-30', amount: 55.20 },
      { date: '2023-12-25', amount: 42.15 }
    ]
  };

  const visitHistory = user.visitHistory || [];
  const totalVisits = visitHistory.length;
  const totalSpent = Number(visitHistory.reduce((sum, visit) => sum + (visit.amount || 0), 0).toFixed(2));
  const avgSpent = totalVisits > 0 ? Number(totalSpent / totalVisits).toFixed(2) : '0';

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
    if (newNote.trim() === user.notes?.trim()) return;
    
    try {
      dispatch({
        type: 'UPDATE_USER',
        payload: { id: user.id, notes: newNote.trim() },
      });
      setSaveError(null);
    } catch (error) {
      setSaveError('Failed to save notes. Please check your connection and try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium">{user.email || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium">{user.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

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
            <svg className="h-5 w-5 mr-2 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
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
          <Input
            id="newTag"
            name="newTag"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            className="w-full sm:flex-1"
            placeholder="Add new tag"
          />
          <Button type="submit" variant="default" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Tag
          </Button>
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
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
