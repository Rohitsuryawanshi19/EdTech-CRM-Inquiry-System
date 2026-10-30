import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  HelpCircle,
  X,
  Phone,
  Mail,
  User,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const CATEGORIES = ['All', 'Scholarship', 'Concert', 'Admission', 'General Query'];
const USER_TYPES = ['All', 'Parent', 'Student', 'School'];
const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed'];

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
      // Fetch inquiries with active filters
      const [inquiriesRes, statsRes] = await Promise.all([
        api.getInquiries({
          search: searchTerm,
          category: selectedCategory,
          userType: selectedUserType,
          status: selectedStatus,
        }),
        api.getStats().catch(() => ({ stats: { total: 0, pending: 0, inProgress: 0, resolved: 0 } })),
      ]);

      if (inquiriesRes.success) {
        setInquiries(inquiriesRes.data || []);
      }
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inquiries. Your JWT session might be expired.');
      if (err.status === 401 || err.status === 403) {
        logout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, selectedCategory, selectedUserType, selectedStatus, logout]);

  useEffect(() => {
    // Debounce search slightly for optimal performance
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
      if (response.success) {
        // Update local state
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
        // Refresh stats
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
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;

    try {
      const response = await api.deleteInquiry(id);
      if (response.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
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
      `"${i.status}"`,
      `"${new Date(i.created_at).toLocaleString()}"`,
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-cyan-400 border-cyan-500/20';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Closed':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getUserTypeBadgeClass = (type) => {
    switch (type) {
      case 'Parent':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Student':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'School':
        return 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span onClick={() => setCurrentView('home')} className="hover:text-cyan-400 cursor-pointer">
              Home
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-400 font-semibold">Admin CRM Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Inquiry Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time PostgreSQL data view with category filters, user-type segmentation, and custom JWT security.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-xs font-semibold text-brand-300 transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total || inquiries.length}</p>
          <span className="text-[11px] text-slate-500">Live submissions recorded</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending Action</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">{stats.pending}</p>
          <span className="text-[11px] text-slate-500">Awaiting counselor review</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300">{stats.inProgress}</p>
          <span className="text-[11px] text-slate-500">Under active discussion</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{stats.resolved}</p>
          <span className="text-[11px] text-slate-500">Admission / query fulfilled</span>
        </div>
      </div>

      {/* Mandatory Filters & Search Control Bar */}
      <div className="glass-panel p-5 rounded-2xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Search bar for Name or Phone Number */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Candidate
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Name or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter by Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by User Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by User Type
            </label>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              {USER_TYPES.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-slate-200">
                  {type === 'All' ? 'All User Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Status Pipeline
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-slate-200">
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filter Chips */}
        {(searchTerm || selectedCategory !== 'All' || selectedUserType !== 'All' || selectedStatus !== 'All') && (
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Active Filters:</span>
            {searchTerm && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] flex items-center gap-1">
                Search: "{searchTerm}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[11px] flex items-center gap-1">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedUserType !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 text-[11px] flex items-center gap-1">
                User: {selectedUserType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedUserType('All')} />
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] flex items-center gap-1">
                Status: {selectedStatus}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatus('All')} />
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedUserType('All');
                setSelectedStatus('All');
              }}
              className="text-[11px] text-slate-400 hover:text-white underline ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => loadData()} className="underline font-semibold">Try again</button>
        </div>
      )}

      {/* Main Inquiries Table View */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-4 px-5">Candidate / Details</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">User Type</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Submission Date</th>
                <th className="py-4 px-4">Status Pipeline</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>Querying Supabase PostgreSQL...</span>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-sm font-semibold text-slate-300">No Inquiries Found</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing filters or submit a new inquiry from the home form.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                    
                    {/* Name & Query Preview */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 text-sm block group-hover:text-cyan-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {item.message}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Phone & Email) */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-200 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-cyan-400" />
                          <span>{item.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[160px]">{item.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* User Type Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getUserTypeBadgeClass(item.user_type)}`}>
                        {item.user_type}
                      </span>
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Submission Date */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status Select with direct update */}
                    <td className="py-4 px-4">
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none transition-all ${getStatusBadgeClass(item.status)}`}
                      >
                        <option value="Pending" className="bg-slate-900 text-amber-300">Pending</option>
                        <option value="In Progress" className="bg-slate-900 text-cyan-300">In Progress</option>
                        <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                        <option value="Closed" className="bg-slate-900 text-slate-400">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInquiry(item)}
                          title="View Full Inquiry Detail"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
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

        {/* Table Footer info */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{inquiries.length}</strong> matching inquiry records
          </span>
          <span className="text-[11px] text-slate-500">
            Powered by Supabase PostgreSQL pg pool
          </span>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-lg">
                {selectedInquiry.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-400">ID: {selectedInquiry.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">User Type</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${getUserTypeBadgeClass(selectedInquiry.user_type)}`}>
                  {selectedInquiry.user_type}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Category</span>
                <span className="font-semibold text-slate-200">{selectedInquiry.category}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Contact Phone</span>
                <span className="font-mono text-cyan-300 font-semibold">{selectedInquiry.phone}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 block mb-1">Email Address</span>
                <span className="text-slate-200 truncate block">{selectedInquiry.email}</span>
              </div>
            </div>

            {/* Message Details */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Inquiry Message / Statement:
              </span>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Change Status inside Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className={`text-xs font-semibold rounded-lg px-3 py-1.5 border cursor-pointer ${getStatusBadgeClass(selectedInquiry.status)}`}
                >
                  <option value="Pending" className="bg-slate-900 text-amber-300">Pending</option>
                  <option value="In Progress" className="bg-slate-900 text-cyan-300">In Progress</option>
                  <option value="Resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                  <option value="Closed" className="bg-slate-900 text-slate-400">Closed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
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
