import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Search,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  Layers,
} from 'lucide-react';

const CATEGORIES = ['All', 'Scholarship', 'Concert', 'Admission', 'General Query'];
const USER_TYPES = ['All', 'Parent', 'Student', 'School'];
const STATUS_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Pending', label: 'New' },
  { value: 'In Progress', label: 'In progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Closed', label: 'Closed' },
];

export const AdminDashboard = () => {
  const { admin, logout, setCurrentView } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUserType, setSelectedUserType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Detail Modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Status updating state tracker
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');

    try {
      const [inquiriesRes, statsRes] = await Promise.all([
        api.getInquiries({
          search: searchTerm,
          category: selectedCategory,
          userType: selectedUserType,
          status: selectedStatus,
        }),
        api.getStats().catch(() => ({ stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 } })),
      ]);

      if (inquiriesRes && inquiriesRes.success) {
        setInquiries(inquiriesRes.data || []);
      }
      if (statsRes && statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inquiries.');
      if (err.status === 401 || err.status === 403) {
        logout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, selectedCategory, selectedUserType, selectedStatus, logout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Handle Status Update
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await api.updateInquiryStatus(id, newStatus);
      if (response && response.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
        const statsRes = await api.getStats().catch(() => null);
        if (statsRes?.success) setStats(statsRes.stats);
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete Inquiry
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry record permanently?')) return;

    try {
      const response = await api.deleteInquiry(id);
      if (response && response.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedUserType('All');
    setSelectedStatus('All');
  };

  // Export current table view to CSV
  const handleExportCSV = () => {
    if (!inquiries.length) {
      alert('No inquiry records to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Phone', 'Email', 'User Type', 'Category', 'Status', 'Date', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.phone}"`,
      `"${i.email}"`,
      `"${i.user_type}"`,
      `"${i.category}"`,
      `"${i.status === 'Pending' ? 'New' : i.status}"`,
      `"${new Date(i.created_at).toLocaleDateString()}"`,
      `"${i.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `K12_Hunar_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Chip Component
  const renderStatusChip = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="chip-new">New</span>;
      case 'In Progress':
        return <span className="chip-progress">In progress</span>;
      case 'Resolved':
        return <span className="chip-resolved">Resolved</span>;
      case 'Closed':
        return (
          <span className="bg-[#F3ECE0] text-[#556070] rounded-[999px] px-2.5 py-0.5 text-xs font-semibold border border-[#E2D9C8]">
            Closed
          </span>
        );
      default:
        return (
          <span className="bg-[#F3ECE0] text-[#556070] rounded-[999px] px-2.5 py-0.5 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== 'All' || selectedUserType !== 'All' || selectedStatus !== 'All';

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#1E2A3A]">
      
      {/* 1. Dashboard Top Bar */}
      <header className="bg-white border-b border-[#E2D9C8] sticky top-0 z-30">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              onClick={() => setCurrentView('home')}
              className="font-serif font-bold text-xl text-[#1E2A3A] cursor-pointer"
            >
              K12 Hunar
            </span>
            <span className="text-xs px-2 py-0.5 rounded-[999px] bg-[#F3ECE0] text-[#556070] border border-[#E2D9C8]">
              Admin desk
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <span className="hidden sm:inline text-xs text-[#556070]">
              {admin?.email || 'admin@k12hunar.com'}
            </span>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-medium text-[#1F5F4A] hover:underline"
            >
              View public site
            </button>
            <button
              onClick={logout}
              className="text-xs font-medium text-[#556070] hover:text-[#B3261E] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Title Bar & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl text-[#1E2A3A]">
              Inquiries
            </h1>
            <p className="text-sm text-[#556070] mt-1">
              Review and manage incoming submissions from parents, students, and schools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="btn-secondary !text-xs !py-2 !px-3.5 !min-h-[38px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-secondary !text-xs !py-2 !px-3.5 !min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 2. 4 Summary Tiles (Total, New, In progress, Resolved) with 4px left border */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          {/* Tile 1: Total */}
          <div className="bg-white rounded-[10px] border border-[#E2D9C8] border-l-4 border-l-[#1E2A3A] p-5 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
            <span className="block text-xs font-medium text-[#556070] mb-1">
              Total inquiries
            </span>
            <span className="font-serif font-bold text-3xl text-[#1E2A3A]">
              {stats.total || inquiries.length}
            </span>
          </div>

          {/* Tile 2: New (Pending) */}
          <div className="bg-white rounded-[10px] border border-[#E2D9C8] border-l-4 border-l-[#E8A317] p-5 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
            <span className="block text-xs font-medium text-[#556070] mb-1">
              New
            </span>
            <span className="font-serif font-bold text-3xl text-[#1E2A3A]">
              {stats.pending}
            </span>
          </div>

          {/* Tile 3: In progress */}
          <div className="bg-white rounded-[10px] border border-[#E2D9C8] border-l-4 border-l-[#1F4E79] p-5 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
            <span className="block text-xs font-medium text-[#556070] mb-1">
              In progress
            </span>
            <span className="font-serif font-bold text-3xl text-[#1E2A3A]">
              {stats.inProgress}
            </span>
          </div>

          {/* Tile 4: Resolved */}
          <div className="bg-white rounded-[10px] border border-[#E2D9C8] border-l-4 border-l-[#1F5F4A] p-5 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
            <span className="block text-xs font-medium text-[#556070] mb-1">
              Resolved
            </span>
            <span className="font-serif font-bold text-3xl text-[#1E2A3A]">
              {stats.resolved}
            </span>
          </div>

        </div>

        {/* 3. Filter Row */}
        <div className="bg-white rounded-[10px] border border-[#E2D9C8] p-5 mb-6 shadow-[0_1px_2px_rgba(30,42,58,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Search by Name or Phone */}
            <div>
              <label className="form-label" htmlFor="filter-search">
                Search by name or phone
              </label>
              <div className="relative">
                <input
                  id="filter-search"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input !h-[40px] !min-h-[40px] pl-9 text-xs"
                />
                <Search className="w-3.5 h-3.5 text-[#556070] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="form-label" htmlFor="filter-category">
                Category
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input !h-[40px] !min-h-[40px] text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type */}
            <div>
              <label className="form-label" htmlFor="filter-user-type">
                User type
              </label>
              <select
                id="filter-user-type"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="form-input !h-[40px] !min-h-[40px] text-xs"
              >
                {USER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All user types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="form-label" htmlFor="filter-status">
                Status
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-input !h-[40px] !min-h-[40px] text-xs"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Clear Filters Link */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-[#E2D9C8] flex items-center justify-between text-xs text-[#556070]">
              <span>Active filters applied</span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-[#D9552B] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-[8px] bg-[#FDECEA] border border-[#B3261E]/30 text-[#B3261E] text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => loadData()} className="underline font-semibold">Try again</button>
          </div>
        )}

        {/* 4. Table / Cards View Container */}
        <div className="bg-white rounded-[10px] border border-[#E2D9C8] shadow-[0_1px_2px_rgba(30,42,58,0.06)] overflow-hidden">
          
          {/* Desktop Table (Visible at 720px and above) */}
          <div className="hidden min-[720px]:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F3ECE0] sticky top-0 border-b border-[#E2D9C8] text-[#556070] uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">User type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9C8]">
                {isLoading ? (
                  // Skeleton Loading Rows in --paper-2
                  <>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <tr key={n}>
                        <td colSpan={7} className="py-4 px-4">
                          <div className="h-4 bg-[#F3ECE0] animate-pulse rounded w-full" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#556070]">
                      <p className="font-serif font-bold text-base text-[#1E2A3A] mb-1">
                        No inquiries found
                      </p>
                      <p className="text-xs text-[#556070]">
                        Try adjusting search terms or clearing active filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  inquiries.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FBF7F0] transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-[#1E2A3A]">
                        <span className="block font-semibold">{item.name}</span>
                        <span className="text-[11px] text-[#556070] line-clamp-1 max-w-[200px]">
                          {item.message}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-[#556070]">
                        <div className="text-xs text-[#1E2A3A]">{item.phone}</div>
                        <div className="text-[11px] text-[#556070]">{item.email}</div>
                      </td>

                      {/* User Type */}
                      <td className="py-3.5 px-4 text-[#1E2A3A]">
                        {item.user_type}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-[#1E2A3A] font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Date (Normal font, no monospace) */}
                      <td className="py-3.5 px-4 text-[#556070] text-xs">
                        {new Date(item.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status Dropdown / Chip */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="text-xs font-semibold rounded-[999px] px-2.5 py-1 border border-[#E2D9C8] bg-white cursor-pointer hover:border-[#1F5F4A] transition-colors"
                        >
                          <option value="Pending">New</option>
                          <option value="In Progress">In progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Plain Icon Actions with tooltips */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            title="View inquiry details"
                            className="p-1.5 rounded-[6px] hover:bg-[#F3ECE0] text-[#556070] hover:text-[#1E2A3A] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete inquiry"
                            className="p-1.5 rounded-[6px] hover:bg-[#FDECEA] text-[#556070] hover:text-[#B3261E] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards (Below 720px) */}
          <div className="block min-[720px]:hidden p-4 space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 bg-[#F3ECE0] animate-pulse rounded-[8px]" />
                ))}
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-8 text-center text-[#556070]">
                <p className="font-serif font-bold text-sm text-[#1E2A3A]">No inquiries found</p>
              </div>
            ) : (
              inquiries.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-[8px] border border-[#E2D9C8] bg-[#FBF7F0] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[#1E2A3A]">{item.name}</h3>
                      <span className="text-xs text-[#556070]">{item.user_type} · {item.category}</span>
                    </div>
                    {renderStatusChip(item.status)}
                  </div>

                  <p className="text-xs text-[#556070] line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="pt-2 border-t border-[#E2D9C8] flex items-center justify-between text-xs text-[#556070]">
                    <span>
                      {new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInquiry(item)}
                        className="p-1 hover:text-[#1E2A3A]"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 hover:text-[#B3261E]"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer */}
          <div className="py-3 px-4 bg-[#F3ECE0]/50 border-t border-[#E2D9C8] text-xs text-[#556070] flex items-center justify-between">
            <span>
              Showing <strong>{inquiries.length}</strong> inquiries
            </span>
            <span>Database connected</span>
          </div>

        </div>

      </div>

      {/* 5. Detail Modal (Plain white panel with 1px border) */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-label="Inquiry detail view"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="relative w-full max-w-[560px] bg-white rounded-[10px] border border-[#E2D9C8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(30,42,58,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F3ECE0] text-[#556070] hover:text-[#1E2A3A] transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider text-[#556070] block mb-1">
                Inquiry details
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#1E2A3A]">
                {selectedInquiry.name}
              </h2>
            </div>

            {/* Fact details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3 rounded-[8px] bg-[#F3ECE0]/60 border border-[#E2D9C8]">
                <span className="text-[#556070] block mb-0.5">User type</span>
                <span className="font-semibold text-[#1E2A3A]">{selectedInquiry.user_type}</span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F3ECE0]/60 border border-[#E2D9C8]">
                <span className="text-[#556070] block mb-0.5">Topic category</span>
                <span className="font-semibold text-[#1E2A3A]">{selectedInquiry.category}</span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F3ECE0]/60 border border-[#E2D9C8]">
                <span className="text-[#556070] block mb-0.5">Phone</span>
                <span className="font-semibold text-[#1E2A3A]">{selectedInquiry.phone}</span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F3ECE0]/60 border border-[#E2D9C8]">
                <span className="text-[#556070] block mb-0.5">Email</span>
                <span className="font-semibold text-[#1E2A3A] truncate block">{selectedInquiry.email}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <span className="form-label mb-1.5">Query message</span>
              <div className="p-4 rounded-[8px] bg-[#FBF7F0] border border-[#E2D9C8] text-xs sm:text-sm text-[#1E2A3A] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Update Status inside modal */}
            <div className="pt-4 border-t border-[#E2D9C8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#556070]">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="form-input !h-[34px] !min-h-[34px] !py-1 text-xs"
                >
                  <option value="Pending">New</option>
                  <option value="In Progress">In progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-secondary !text-xs !py-1.5 !px-4 !min-h-[34px]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
