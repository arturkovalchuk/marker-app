import React, { useState } from 'react';
import InfoTab from './InfoTab';
import VisitsTab from './VisitsTab';
import CommunicationTab from './CommunicationTab';

const UserDetail = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'visits' | 'communication'>('info');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('info')}>Info</button>
        <button onClick={() => setActiveTab('visits')}>Visits</button>
        <button onClick={() => setActiveTab('communication')}>Communication</button>
      </div>

      {activeTab === 'info' && <InfoTab />}
      {activeTab === 'visits' && <VisitsTab />}
      {activeTab === 'communication' && <CommunicationTab />}
    </div>
  );
};

export default UserDetail; 