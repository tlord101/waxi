import React, { useState, useEffect } from 'react';
import { getEmailLogs } from '../../services/dbService';
import { EmailLog } from '../../types';

const EmailViewerModal: React.FC<{ email: EmailLog | null; onClose: () => void }> = ({ email, onClose }) => {
    if (!email) return null;

    return (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" 
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-preview-title"
        >
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 id="email-preview-title" className="font-bold text-lg text-black dark:text-white">Email Preview</h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-byd-red text-3xl leading-none">&times;</button>
                </div>
                <div className="p-4 space-y-2 text-sm border-b dark:border-gray-700 flex-shrink-0">
                    <p><strong className="text-gray-500 dark:text-gray-400 w-20 inline-block">Recipient:</strong> <span className="text-black dark:text-white">{email.recipient}</span></p>
                    <p><strong className="text-gray-500 dark:text-gray-400 w-20 inline-block">Subject:</strong> <span className="text-black dark:text-white">{email.subject}</span></p>
                </div>
                <div className="p-1 flex-grow overflow-y-auto">
                    <iframe 
                      srcDoc={email.body} 
                      className="w-full h-full border-0" 
                      title="Email Content" 
                      sandbox="" // Sandboxed for security
                    />
                </div>
            </div>
        </div>
    );
};


const EmailLogsTab: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);

  // Fetch logs on component mount and create an interval to check for new logs
  useEffect(() => {
    setLogs(getEmailLogs());

    const interval = setInterval(() => {
        setLogs(getEmailLogs());
    }, 1000); // Check for new emails every second

    return () => clearInterval(interval);
  }, []);

  const handleViewEmail = (log: EmailLog) => {
    setSelectedEmail(log);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Recipient</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">{new Date(log.sent_at as string).toLocaleString()}</td>
                <td className="px-6 py-4">{log.recipient}</td>
                <td className="px-6 py-4">
                  <span className="capitalize bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                    {log.email_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-black dark:text-white">{log.subject}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      log.status === 'sent' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                    }`}>
                      {log.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <button onClick={() => handleViewEmail(log)} className="font-medium text-byd-red hover:underline">
                        View
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EmailViewerModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </>
  );
};

export default EmailLogsTab;
