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

  // Helper to color-code the status selector button/chip
  const getStatusSelectClasses = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30';
      case 'Closed':
        return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-500/15 dark:text-stone-300 dark:border-stone-500/30';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-500/15 dark:text-stone-300 dark:border-stone-500/30';
    }
  };

  // Status Chip Component
  const renderStatusChip = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            New
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/30">
            In progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
            Resolved
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30">
            {status}
          </span>
        );
    }
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== 'All' || selectedUserType !== 'All' || selectedStatus !== 'All';

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] transition-colors">
      
      {/* 1. Dashboard Top Bar */}
      <header className="bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 transition-colors">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 cursor-pointer select-none"
            >
              <span className="font-black text-xl text-amber-600 dark:text-amber-400 tracking-tight">
                K12
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold">:</span>
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                EdTech CRM & Inquiry System
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 dark:border-amber-400/20 font-bold">
              Admin Desk
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
              {admin?.email || 'admin@k12hunar.com'}
            </span>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
            >
              View public site
            </button>
            <button
              onClick={logout}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
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
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-[-0.03em]">
              Inquiries & CRM
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Review and manage incoming submissions from parents, students, and schools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="btn-hero-secondary !text-xs !py-2 !px-4 !min-h-[38px] !font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-hero-secondary !text-xs !py-2 !px-4 !min-h-[38px] !font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 2. 4 Summary Tiles (Total, New, In progress, Resolved) with 4px left border */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          {/* Tile 1: Total */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 border-l-4 border-l-slate-900 dark:border-l-indigo-500 p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Total inquiries
            </span>
            <span className="font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {stats.total || inquiries.length}
            </span>
          </div>

          {/* Tile 2: New (Pending) */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 border-l-4 border-l-amber-500 p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              New
            </span>
            <span className="font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {stats.pending}
            </span>
          </div>

          {/* Tile 3: In progress */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 border-l-4 border-l-blue-500 p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              In progress
            </span>
            <span className="font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {stats.inProgress}
            </span>
          </div>

          {/* Tile 4: Resolved */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 border-l-4 border-l-emerald-500 p-5 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Resolved
            </span>
            <span className="font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {stats.resolved}
            </span>
          </div>

        </div>

        {/* 3. Filter Row */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 p-5 mb-6 shadow-sm transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Search by Name or Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="filter-search">
                Search by name or phone
              </label>
              <div className="relative">
                <input
                  id="filter-search"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="filter-category">
                Category
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat === 'All' ? 'All categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="filter-user-type">
                User type
              </label>
              <select
                id="filter-user-type"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="w-full h-11 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {USER_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-slate-900 text-white">
                    {type === 'All' ? 'All user types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="filter-status">
                Status
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-11 px-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value} className="bg-slate-900 text-white">
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Clear Filters Link */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Active filters applied</span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => loadData()} className="underline font-bold">Try again</button>
          </div>
        )}

        {/* 4. Table / Cards View Container */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden transition-colors">
          
          {/* Desktop Table (Visible at 720px and above) */}
          <div className="hidden min-[720px]:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-[#0B0F19] sticky top-0 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold">
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
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
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
                    <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <p className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                        No inquiries found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Try adjusting search terms or clearing active filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  inquiries.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <span className="block font-bold">{item.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px]">
                          {item.message}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.phone}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.email}</div>
                      </td>

                      {/* User Type */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {item.user_type}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                          {item.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status Dropdown / Chip (Color-coded, no ugly white box) */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`text-xs font-bold rounded-full px-3 py-1 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${getStatusSelectClasses(item.status)}`}
                        >
                          <option value="Pending" className="bg-slate-900 text-amber-300">New</option>
                          <option value="In Progress" className="bg-slate-900 text-blue-300">In progress</option>
                          <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                          <option value="Closed" className="bg-slate-900 text-slate-300">Closed</option>
                        </select>
                      </td>

                      {/* Plain Icon Actions with tooltips */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            title="View inquiry details"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete inquiry"
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
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
            className="relative w-full max-w-[560px] bg-white dark:bg-[#121A26] rounded-3xl border border-stone-200/90 dark:border-white/10 p-6 sm:p-8 shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
                Inquiry details
              </span>
              <h2 className="font-black text-2xl text-slate-900 dark:text-white">
                {selectedInquiry.name}
              </h2>
            </div>

            {/* Fact details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A0F16] border border-stone-200/90 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">User type</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInquiry.user_type}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A0F16] border border-stone-200/90 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Topic category</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInquiry.category}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A0F16] border border-stone-200/90 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedInquiry.phone}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0A0F16] border border-stone-200/90 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Email</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">{selectedInquiry.email}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Query message</span>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0F16] border border-stone-200/90 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Update Status inside modal */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className={`text-xs font-bold rounded-full px-3 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${getStatusSelectClasses(selectedInquiry.status)}`}
                >
                  <option value="Pending" className="bg-slate-900 text-amber-300">New</option>
                  <option value="In Progress" className="bg-slate-900 text-blue-300">In progress</option>
                  <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                  <option value="Closed" className="bg-slate-900 text-slate-300">Closed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-hero-secondary !text-xs !py-1.5 !px-4 !min-h-[34px]"
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
