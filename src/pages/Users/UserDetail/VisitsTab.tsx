import React, { useState } from 'react';

const VisitsTab = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedService, setSelectedService] = useState('All Services');

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const visits = [
    { date: 'Feb 10, 2024', service: 'Consultation', amount: '$50.00' },
    { date: 'Jan 20, 2024', service: 'Treatment', amount: '$120.00' },
    { date: 'Jan 5, 2024', service: 'Follow-up', amount: '$75.00' },
    { date: 'Dec 15, 2023', service: 'Treatment', amount: '$120.00' },
    { date: 'Dec 1, 2023', service: 'Consultation', amount: '$50.00' },
  ];

  const sortedVisits = [...visits].sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <h2>тесттесттест</h2>
      <div className="filters">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="service-dropdown"
        >
          <option value="All Services">All Services</option>
          <option value="Consultation">Consultation</option>
          <option value="Treatment">Treatment</option>
          <option value="Follow-up">Follow-up</option>
        </select>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                Date {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th>Service</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedVisits.map((visit, index) => (
              <tr key={index}>
                <td>{visit.date}</td>
                <td>{visit.service}</td>
                <td>{visit.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitsTab; 