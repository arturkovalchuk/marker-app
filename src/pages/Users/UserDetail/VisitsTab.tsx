import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronDown, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useUsers } from '../../../context/UserContext';

const VisitsTab = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUserById } = useUsers();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = userId ? getUserById(userId) : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  const visitHistory = user.visitHistory || [];

  // Get unique services for filter
  const services = [...new Set(visitHistory.map(visit => visit.service))];

  // Filter visits and sort
  const filteredVisits = [...visitHistory]
    .filter(visit => selectedServices.length === 0 || selectedServices.includes(visit.service))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSortClick = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="space-y-8">
      {/* Visit History Section */}
      <div className="bg-white shadow-sm rounded-xl p-4 md:p-6 border border-slate-200">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              <span className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                Visit History
              </span>
            </h2>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto inline-flex items-center justify-between px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">
                  {selectedServices.length === 0
                    ? 'All Services'
                    : `${selectedServices.length} selected`}
                </span>
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="p-2 space-y-1">
                    {services.map(service => (
                      <button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md ${
                          selectedServices.includes(service)
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{service}</span>
                      </button>
                    ))}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="border-t border-slate-100 p-2">
                      <button
                        onClick={() => setSelectedServices([])}
                        className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredVisits.length > 0 ? (
          <div className="mt-8">
            {/* Desktop view */}
            <div className="hidden md:block">
              <div className="inline-block min-w-full align-middle">
                <div className="shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left">
                          <button
                            onClick={handleSortClick}
                            className="group inline-flex items-center text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700"
                          >
                            Date
                            <span className="ml-2 flex-none rounded text-slate-400 group-hover:visible group-focus:visible">
                              {sortOrder === 'asc' ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Service
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredVisits.map(visit => (
                        <tr key={visit.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {formatDate(visit.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {visit.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right tabular-nums">
                            ${visit.amount?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg">
                <button
                  onClick={handleSortClick}
                  className="group inline-flex items-center text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-700"
                >
                  Sort by Date
                  <span className="ml-2 flex-none rounded text-slate-400">
                    {sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                {filteredVisits.map(visit => (
                  <div
                    key={visit.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {formatDate(visit.date)}
                      </span>
                      <span className="text-sm font-medium text-slate-900 tabular-nums">
                        ${visit.amount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{visit.service}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">No visit history found.</p>
            <p className="text-xs text-slate-400 mt-1">
              {selectedServices.length > 0
                ? `Try selecting different services.`
                : `This user hasn't made any visits yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsTab;
