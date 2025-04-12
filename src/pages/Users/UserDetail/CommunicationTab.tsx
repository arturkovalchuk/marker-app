import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Send, Mail } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';

const CommunicationTab = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUserById } = useUsers();
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [communicationStatus, setCommunicationStatus] = useState<{
    type: 'sms' | 'email';
    status: 'success' | 'error' | null;
    message: string;
  } | null>(null);

  const user = userId ? getUserById(userId) : undefined;

  if (!user) {
    return null;
  }

  const handleSendSMS = () => {
    if (smsMessage.trim()) {
      // This would be where you'd call your SMS API
      setCommunicationStatus({
        type: 'sms',
        status: 'success',
        message: `SMS sent to ${user.phone}`,
      });

      // Clear message after sending
      setSmsMessage('');

      // Reset status after delay
      setTimeout(() => {
        setCommunicationStatus(null);
      }, 3000);
    }
  };

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailBody.trim()) {
      // This would be where you'd call your email API
      setCommunicationStatus({
        type: 'email',
        status: 'success',
        message: `Email sent to ${user.email}`,
      });

      // Clear fields after sending
      setEmailSubject('');
      setEmailBody('');

      // Reset status after delay
      setTimeout(() => {
        setCommunicationStatus(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* SMS Section */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          <span className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-slate-400" />
            Send SMS
          </span>
        </h2>

        {!user.phone ? (
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500">
            No phone number available for this user.
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="sms-message"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="sms-message"
                value={smsMessage}
                onChange={e => setSmsMessage(e.target.value)}
                className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="Type your SMS message here..."
              />
              <p className="mt-1 text-xs text-slate-500">
                {160 - smsMessage.length} characters remaining
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendSMS}
                disabled={!smsMessage.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Send SMS
              </button>
            </div>

            {communicationStatus?.type === 'sms' && (
              <div
                className={`mt-3 p-3 rounded-md text-sm ${
                  communicationStatus.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {communicationStatus.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Section */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          <span className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-slate-400" />
            Send Email
          </span>
        </h2>

        {!user.email ? (
          <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500">
            No email address available for this user.
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-subject"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="email-subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full h-10 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="Email subject..."
              />
            </div>

            <div>
              <label htmlFor="email-body" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="email-body"
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                placeholder="Type your email message here..."
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendEmail}
                disabled={!emailSubject.trim() || !emailBody.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </button>
            </div>

            {communicationStatus?.type === 'email' && (
              <div
                className={`mt-3 p-3 rounded-md text-sm ${
                  communicationStatus.status === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {communicationStatus.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationTab;
