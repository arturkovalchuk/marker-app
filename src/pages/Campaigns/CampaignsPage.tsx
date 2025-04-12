import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../../context/CampaignContext';
import { Campaign } from '../../types/campaign';
import { Search, Tag, MoreVertical, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

type FilterType = 'all' | 'active' | 'inactive';
type SortDirection = 'asc' | 'desc';

export default function CampaignsPage() {
  const { state, addCampaign, updateCampaign, deleteCampaign, cloneCampaign } = useCampaigns();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showActionsId, setShowActionsId] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActionsId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterCampaigns = (campaigns: Campaign[]) => {
    return campaigns
      .filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = 
          filter === 'all' ? true :
          filter === 'active' ? c.active :
          !c.active;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  };

  const filteredCampaigns = filterCampaigns(state.campaigns);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
        <button
          onClick={addCampaign}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Create Campaign
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as FilterType)}
            className="w-full h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All campaigns</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No campaigns found</p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/campaigns/${campaign.id}/flow`)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        {editingId === campaign.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            defaultValue={campaign.name}
                            autoFocus
                            onClick={e => e.stopPropagation()}
                            onBlur={e => {
                              updateCampaign({
                                ...campaign,
                                name: e.target.value.trim() || `Campaign ${campaign.id.slice(0, 4)}`
                              });
                              setEditingId(null);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                updateCampaign({
                                  ...campaign,
                                  name: e.currentTarget.value.trim() || `Campaign ${campaign.id.slice(0, 4)}`
                                });
                                setEditingId(null);
                              }
                            }}
                          />
                        ) : (
                          <div>
                            <h3
                              className="text-base font-medium text-slate-900 truncate group-hover:text-emerald-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(campaign.id);
                              }}
                            >
                              {campaign.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 ml-4" onClick={e => e.stopPropagation()}>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={campaign.active}
                            onChange={() => updateCampaign({ ...campaign, active: !campaign.active })}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>

                        <div className="relative" ref={actionsRef}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionsId(showActionsId === campaign.id ? null : campaign.id);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-600" />
                          </button>
                          
                          {showActionsId === campaign.id && (
                            <div 
                              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cloneCampaign(campaign.id);
                                  setShowActionsId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                Clone
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteCampaign(campaign.id);
                                  setShowActionsId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 