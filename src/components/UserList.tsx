import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, X, ChevronDown, Search, Tag, Mail, Phone, 
  User as UserIcon, ArrowUpDown, ArrowUp, ArrowDown, 
  Edit, Check, AlertCircle, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { useUsers } from '../context/UserContext';

type SortField = 'id' | 'name' | 'email' | 'phone' | 'lastVisit';
type SortDirection = 'asc' | 'desc';

export function UserList() {
  const navigate = useNavigate();
  const { state, dispatch } = useUsers();
  
  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort states
  const [sortField, setSortField] = useState<SortField>('lastVisit');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection states
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Confirm delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isMultiDelete, setIsMultiDelete] = useState(false);

  // Mobile view state
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState<{type: 'id' | 'tags', data: string | string[], position: {x: number, y: number}} | null>(null);

  // Check if mobile view on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Reset selected rows when page changes
  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [currentPage]);

  // Reset selectAll when selectedRows changes
  useEffect(() => {
    if (selectedRows.length === 0) {
      setSelectAll(false);
    }
  }, [selectedRows]);

  // Toggle row expansion for mobile view
  const toggleRowExpansion = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Toggle row selection
  const toggleRowSelection = (userId: string, e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedRows(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Toggle all rows selection
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedUsers.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete confirmation
  const handleShowDeleteConfirm = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToDelete(userId);
    setIsMultiDelete(false);
    setShowDeleteDialog(true);
  };

  // Handle multi-delete confirmation
  const handleShowMultiDeleteConfirm = () => {
    if (selectedRows.length > 0) {
      setIsMultiDelete(true);
      setShowDeleteDialog(true);
    }
  };

  // Handle delete user
  const handleConfirmDelete = () => {
    if (isMultiDelete && selectedRows.length > 0) {
      selectedRows.forEach(userId => {
        dispatch({ type: 'DELETE_USER', payload: userId });
      });
      setSelectedRows([]);
    } else if (userToDelete) {
      dispatch({ type: 'DELETE_USER', payload: userToDelete });
      setSelectedRows(prev => prev.filter(id => id !== userToDelete));
    }
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setIsMultiDelete(false);
  };
  
  const handleRemoveTag = (e: React.MouseEvent, userId: string, tag: string) => {
    e.stopPropagation();
    dispatch({
      type: 'REMOVE_TAG',
      payload: { userId, tag },
    });
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Format date for last visit
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format long ID (show first 6 and last 4 characters)
  const formatId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  // Define return type for formatTags
  type FormattedTags = {
    visibleTags: string[];
    remainingCount: number;
    allTags: string[];
  };

  // Format tags list (show up to 2 tags and count remaining)
  const formatTags = (tags: string[]): FormattedTags => {
    if (tags.length <= 2) {
      return {
        visibleTags: tags,
        remainingCount: 0,
        allTags: tags
      };
    }
    return {
      visibleTags: tags.slice(0, 2),
      remainingCount: tags.length - 2,
      allTags: tags
    };
  };

  // Get last visit date from visit history
  const getLastVisitDate = (user: any) => {
    if (!user.visitHistory || user.visitHistory.length === 0) {
      return undefined;
    }
    
    const sortedVisits = [...user.visitHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedVisits[0].date;
  };

  // Filter users based on search and tags
  const filteredUsers = state.users.filter(user => {
    const matchesSearch = searchQuery === '' || 
                        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => user.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA, valueB;
    
    switch(sortField) {
      case 'id':
        valueA = a.id.toLowerCase();
        valueB = b.id.toLowerCase();
        break;
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'email':
        valueA = (a.email || '').toLowerCase();
        valueB = (b.email || '').toLowerCase();
        break;
      case 'phone':
        valueA = (a.phone || '').toLowerCase();
        valueB = (b.phone || '').toLowerCase();
        break;
      case 'lastVisit':
        const dateA = getLastVisitDate(a);
        const dateB = getLastVisitDate(b);
        valueA = dateA ? new Date(dateA).getTime() : 0;
        valueB = dateB ? new Date(dateB).getTime() : 0;
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate users
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Pagination handlers
  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);
  
  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Tooltip handlers
  const handleShowTooltip = (e: React.MouseEvent, type: 'id' | 'tags', data: string | string[]) => {
    // Don't show tooltip when clicked for navigation
    e.stopPropagation();
    
    // Get position from event
    const rect = e.currentTarget.getBoundingClientRect();
    setShowTooltip({
      type,
      data,
      position: {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      }
    });
  };

  const handleHideTooltip = () => {
    setShowTooltip(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 py-6">
      {/* Page header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Users</h1>
        
        {/* Filter section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Find user</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 md:h-10 px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              placeholder="Search by name, ID, email..."
            />
          </div>
          <div className="relative w-full md:w-1/3">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Filter by tags</span>
            </div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-12 md:h-10 inline-flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            >
              <span>{selectedTags.length ? `${selectedTags.length} selected` : 'Select tags'}</span>
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 w-full rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 border border-slate-100">
                <div className="py-2 max-h-60 overflow-y-auto">
                  {Array.from(state.tags).length > 0 ? (
                    Array.from(state.tags).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`block w-full text-left px-4 py-3 md:py-2.5 text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-slate-500">No tags available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center">
          {selectedRows.length > 0 && (
            <button
              onClick={handleShowMultiDeleteConfirm}
              className="inline-flex items-center justify-center w-full md:w-auto px-4 py-3 md:py-2 h-12 md:h-10 border border-red-200 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete selected ({selectedRows.length})
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Delete</h3>
            <p className="text-slate-600 mb-4">
              {isMultiDelete 
                ? `Are you sure you want to delete ${selectedRows.length} selected user${selectedRows.length > 1 ? 's' : ''}?` 
                : 'Are you sure you want to delete this user?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bg-slate-800 text-white text-xs rounded-md px-3 py-2 z-50 shadow-lg max-w-xs"
          style={{
            left: `${showTooltip.position.x}px`,
            top: `${showTooltip.position.y + 5}px`,
          }}
        >
          {showTooltip.type === 'id' ? (
            <div>
              <strong>Full ID:</strong> {showTooltip.data as string}
            </div>
          ) : (
            <div>
              <strong>All tags:</strong> {(showTooltip.data as string[]).join(', ')}
            </div>
          )}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl p-8 border border-slate-200 text-center">
          <p className="text-slate-500 mb-4">No users found</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTags([]);
            }}
            className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
          {/* Desktop Table View */}
          <div className={`overflow-x-auto ${isMobileView ? 'hidden' : 'block'}`}>
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-3 py-3.5 w-10">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center gap-1 hover:text-slate-700" 
                      onClick={() => handleSort('lastVisit')}
                    >
                      Last Visit
                      {sortField === 'lastVisit' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {paginatedUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <td className="px-3 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={(e) => toggleRowSelection(user.id, e)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 select-text">
                      <span 
                        className="cursor-help" 
                        onMouseEnter={(e) => handleShowTooltip(e, 'id', user.id)}
                        onMouseLeave={handleHideTooltip}
                        onClick={(e) => {
                          if (isMobileView) {
                            handleShowTooltip(e, 'id', user.id);
                            setTimeout(handleHideTooltip, 3000);
                          }
                        }}
                      >
                        {formatId(user.id)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium select-text">
                      <span className="text-emerald-600 hover:text-emerald-800 hover:underline">{user.name}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 select-text">
                      {user.email || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 select-text">
                      {user.phone || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap select-text">
                      <div className="flex flex-wrap gap-1">
                        {user.tags.length === 0 ? (
                          <span className="text-xs text-slate-400">No tags</span>
                        ) : (
                          <>
                            {formatTags(user.tags).visibleTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                              >
                                {tag}
                              </span>
                            ))}
                            {formatTags(user.tags).remainingCount > 0 && (
                              <span 
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 cursor-help"
                                onMouseEnter={(e) => handleShowTooltip(e, 'tags', formatTags(user.tags).allTags)}
                                onMouseLeave={handleHideTooltip}
                                onClick={(e) => {
                                  if (isMobileView) {
                                    handleShowTooltip(e, 'tags', formatTags(user.tags).allTags);
                                    setTimeout(handleHideTooltip, 3000);
                                  }
                                }}
                              >
                                +{formatTags(user.tags).remainingCount} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 select-text">
                      {formatDate(getLastVisitDate(user))}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
                          className="text-slate-400 hover:text-emerald-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleShowDeleteConfirm(user.id, e)}
                          className="text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Card style) */}
          <div className={`${isMobileView ? 'block' : 'hidden'}`}>
            <ul className="divide-y divide-slate-200">
              {paginatedUsers.map((user) => (
                <li 
                  key={user.id} 
                  className="p-5 hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  <div className="flex flex-col space-y-4">
                    {/* Header with name, ID and actions */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mr-3">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-slate-900">{user.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            <span 
                              className="cursor-help" 
                              onMouseEnter={(e) => handleShowTooltip(e, 'id', user.id)}
                              onMouseLeave={handleHideTooltip}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowTooltip(e, 'id', user.id);
                                setTimeout(handleHideTooltip, 3000);
                              }}
                            >
                              {formatId(user.id)}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions moved to header */}
                      <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/user/${user.id}`)}
                          className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 rounded-md"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleShowDeleteConfirm(user.id, e)}
                          className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(user.id)}
                          onChange={(e) => toggleRowSelection(user.id, e)}
                          className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                        />
                      </div>
                    </div>
                      
                    {/* Contact info */}
                    <div className="pl-13 ml-0.5 space-y-3">
                      {user.email && (
                        <div className="flex items-center text-sm text-slate-700">
                          <Mail className="w-4 h-4 mr-3 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center text-sm text-slate-700">
                          <Phone className="w-4 h-4 mr-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-slate-700">
                        <Clock className="w-4 h-4 mr-3 text-slate-400" />
                        <span>{formatDate(getLastVisitDate(user))}</span>
                      </div>
                    </div>
                      
                    {/* Tags */}
                    <div className="pl-13 ml-0.5 flex flex-wrap gap-2 mt-1">
                      {user.tags.length === 0 ? (
                        <span className="text-xs text-slate-400">No tags</span>
                      ) : (
                        <>
                          {formatTags(user.tags).visibleTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {formatTags(user.tags).remainingCount > 0 && (
                            <span 
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 cursor-help"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowTooltip(e, 'tags', formatTags(user.tags).allTags);
                                setTimeout(handleHideTooltip, 3000);
                              }}
                            >
                              +{formatTags(user.tags).remainingCount} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && totalPages > 0 && (
        <div className="flex items-center justify-between">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <div className="w-full flex items-center justify-between">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1 || totalPages === 1}
                className={`relative inline-flex items-center justify-center p-2 h-10 border border-slate-200 text-sm font-medium rounded-md ${
                  currentPage === 1 || totalPages === 1
                    ? 'text-slate-300 bg-white cursor-not-allowed'
                    : 'text-slate-700 bg-white hover:bg-slate-50'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 whitespace-nowrap">
                  {window.innerWidth < 360 ? `${currentPage}/${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </span>
                <span className="text-slate-400">|</span>
                <div className="flex items-center">
                  <span className="text-sm text-slate-600 mr-1">Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                    className="h-8 px-1 py-0 border border-slate-200 rounded text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 1}
                className={`relative inline-flex items-center justify-center p-2 h-10 border border-slate-200 text-sm font-medium rounded-md ${
                  currentPage === totalPages || totalPages === 1
                    ? 'text-slate-300 bg-white cursor-not-allowed'
                    : 'text-slate-700 bg-white hover:bg-slate-50'
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Desktop pagination - keep as is */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {indexOfLastItem > filteredUsers.length ? filteredUsers.length : indexOfLastItem}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
              </p>
              <span className="mx-4 text-sm text-slate-400">|</span>
              <span className="text-sm text-slate-500">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                className="h-8 px-2 py-0 border border-slate-200 rounded text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 text-sm font-medium ${
                    currentPage === 1
                      ? 'text-slate-300 bg-white cursor-not-allowed'
                      : 'text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-slate-300 bg-white cursor-not-allowed'
                      : 'text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}