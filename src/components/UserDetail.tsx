import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, X, User as UserIcon, Mail, Phone, Tag, Calendar, 
  Home, FileText, BarChart2, ArrowUpDown, Filter, Clock, MessageSquare, Send
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { Visit } from '../types';

export function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useUsers();
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'visits' | 'communication'>('info');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);
  
  // Communication tab states
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [communicationStatus, setCommunicationStatus] = useState<{type: 'sms' | 'email', status: 'success' | 'error' | null, message: string} | null>(null);

  const user = state.users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-600 mb-4">User not found</p>
        <button
          onClick={() => navigate('/users')}
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </button>
      </div>
    );
  }

  // If registration date is not set, we'll use a default for demonstration
  const registrationDate = user.registrationDate || '2023-01-01T10:00:00Z';
  
  // Create mock visit history if it's not defined
  const visitHistory = user.visitHistory || [];
  
  // Compute statistics
  const totalVisits = visitHistory.length;
  const totalSpent = visitHistory.reduce((sum, visit) => sum + (visit.amount || 0), 0);
  const avgSpent = totalVisits > 0 ? (totalSpent / totalVisits).toFixed(2) : 0;
  
  // Get unique services for filter
  const services = [...new Set(visitHistory.map(visit => visit.service))];
  
  // Filter and sort visits
  const filteredAndSortedVisits = [...visitHistory]
    .filter(visit => serviceFilter ? visit.service === serviceFilter : true)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/users')}
          className="w-full sm:hidden inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
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
              <p className="text-slate-500 text-xs">Registered: {formatDate(registrationDate)}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/users')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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

      {activeTab === 'info' ? (
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
                user.tags.map((tag) => (
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
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
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
              <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {saveError}
              </div>
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
                onChange={(e) => setNewNote(e.target.value)}
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
      ) : activeTab === 'visits' ? (
        <div className="space-y-6">
          {/* Visit History Section */}
          <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                  Visit History
                </span>
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    <ArrowUpDown className="h-3.5 w-3.5 ml-1.5" />
                  </button>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setServiceFilter(null)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-xs font-medium ${
                      serviceFilter === null
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    All Services
                  </button>
                </div>
                
                {services.map(service => (
                  <button
                    key={service}
                    onClick={() => setServiceFilter(service)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-xs font-medium ${
                      serviceFilter === service
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredAndSortedVisits.length > 0 ? (
              <div className="overflow-hidden border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredAndSortedVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {formatDate(visit.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {visit.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right">
                          ${visit.amount?.toFixed(2) || '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">No visit history found.</p>
                <p className="text-xs text-slate-400 mt-1">
                  {serviceFilter ? `Try selecting a different service filter.` : `This user hasn't made any visits yet.`}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Communication Section */}
          <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              <span className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-slate-400" />
                Send Message
              </span>
            </h2>
            
            {/* SMS Form */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-md font-medium text-slate-700 mb-3">Send SMS</h3>
              
              {!user.phone ? (
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500">
                  No phone number available for this user.
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="sms-message" className="block text-sm font-medium text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="sms-message"
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="Type your SMS message here..."
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      {160 - smsMessage.length} characters remaining
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        // Handle SMS send
                        if (smsMessage.trim()) {
                          // This would be where you'd call your SMS API
                          console.log(`Sending SMS to ${user.phone}: ${smsMessage}`);
                          
                          // Simulate success for demo
                          setCommunicationStatus({
                            type: 'sms',
                            status: 'success',
                            message: `SMS sent to ${user.phone}`
                          });
                          
                          // Clear message after sending
                          setSmsMessage('');
                          
                          // Reset status after delay
                          setTimeout(() => {
                            setCommunicationStatus(null);
                          }, 3000);
                        }
                      }}
                      disabled={!smsMessage.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Email Form */}
            <div>
              <h3 className="text-md font-medium text-slate-700 mb-3">Send Email</h3>
              
              {!user.email ? (
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500">
                  No email address available for this user.
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="email-subject" className="block text-sm font-medium text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full h-10 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="Email subject..."
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email-body" className="block text-sm font-medium text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="email-body"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      placeholder="Type your email message here..."
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        // Handle email send
                        if (emailSubject.trim() && emailBody.trim()) {
                          // This would be where you'd call your email API
                          console.log(`Sending email to ${user.email}: ${emailSubject} - ${emailBody}`);
                          
                          // Simulate success for demo
                          setCommunicationStatus({
                            type: 'email',
                            status: 'success',
                            message: `Email sent to ${user.email}`
                          });
                          
                          // Clear fields after sending
                          setEmailSubject('');
                          setEmailBody('');
                          
                          // Reset status after delay
                          setTimeout(() => {
                            setCommunicationStatus(null);
                          }, 3000);
                        }
                      }}
                      disabled={!emailSubject.trim() || !emailBody.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Status Messages */}
            {communicationStatus && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                communicationStatus.status === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {communicationStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}