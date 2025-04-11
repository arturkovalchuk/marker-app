import React, { useState } from 'react';

const VisitsTab = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedService, setSelectedService] = useState('All Services');

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <h2>Visit History</h2>
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
            <tr>
              <td>Feb 10, 2024</td>
              <td>Consultation</td>
              <td>$50.00</td>
            </tr>
            <tr>
              <td>Jan 20, 2024</td>
              <td>Treatment</td>
              <td>$120.00</td>
            </tr>
            <tr>
              <td>Jan 5, 2024</td>
              <td>Follow-up</td>
              <td>$75.00</td>
            </tr>
            <tr>
              <td>Dec 15, 2023</td>
              <td>Treatment</td>
              <td>$120.00</td>
            </tr>
            <tr>
              <td>Dec 1, 2023</td>
              <td>Consultation</td>
              <td>$50.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitsTab; 