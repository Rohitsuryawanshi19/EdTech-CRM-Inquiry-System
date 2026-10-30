import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Layers, 
  MessageSquare, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const USER_TYPES = ['Parent', 'Student', 'School'];
const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

export const PublicInquiryForm = () => {
  const [formData, setFormData] = useState({
    user_type: 'Student',
    category: 'Scholarship',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide full name (minimum 2 letters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!phoneClean || phoneClean.length < 8 || phoneClean.length > 15) {
      errors.phone = 'Please provide a valid contact number (8-15 digits).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please describe your query in at least 5 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.submitInquiry(formData);
      if (response.success) {
        setSubmittedSuccess(true);
        setLastSubmittedId(response.data?.id || 'SUB-' + Math.floor(1000 + Math.random() * 9000));
        
        // Trigger celebratory confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981'],
        });

        // Reset form data
        setFormData({
          user_type: 'Student',
          category: 'Scholarship',
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setErrorMessage(response.message || 'Submission could not be completed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred while connecting to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = () => {
    setSubmittedSuccess(false);
    setErrorMessage('');
    setValidationErrors({});
  };

  return (
    <section id="inquiry-section" className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Communication Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Submit Your Inquiry
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Fill in the details below. Your submission routes directly into our secure PostgreSQL database for instant review by the K12 Hunar team.
          </p>
        </div>

        {/* Main Glassmorphic Card Container */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden">
          
          {/* Subtle gradient accent borders */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-80" />

          {submittedSuccess ? (
            /* Success State Card */
            <div className="py-12 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Inquiry Submitted Successfully!</h3>
              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                Thank you for reaching out to <span className="text-cyan-400 font-semibold">K12 Hunar</span>. Our educational counselors and admissions panel will review your query and respond shortly.
              </p>
              
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 font-mono text-xs text-slate-300 mb-8 flex items-center gap-2">
                <span className="text-slate-500">Inquiry Reference ID:</span>
                <span className="text-brand-300 font-semibold">{lastSubmittedId}</span>
              </div>

              <button
                onClick={resetFormState}
                className="px-6 py-3 rounded-xl font-semibold text-xs tracking-wide text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-2 shadow-lg shadow-brand-600/30"
              >
                <span>Submit Another Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Alert Error Box */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Submission Error</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Row 1: User Type & Category (Core Requirement Dropdowns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* User Type Dropdown */}
                <div>
                  <label htmlFor="user_type" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-400" />
                    User Type <span className="text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="user_type"
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                    >
                      {USER_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-slate-900 text-slate-200">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      ▼
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Select whether you represent a Parent, Student, or School.</p>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label htmlFor="category" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Inquiry Category <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-brand-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                      ▼
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Select topic (Scholarship, Concert, Admission, or General Query).</p>
                </div>

              </div>

              {/* Row 2: Personal Details (Name, Email, Phone Number) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${
                      validationErrors.name ? 'border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${
                      validationErrors.email ? 'border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`glass-input w-full px-4 py-3 rounded-xl text-sm ${
                      validationErrors.phone ? 'border-rose-500 focus:ring-rose-500' : ''
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1">{validationErrors.phone}</p>
                  )}
                </div>

              </div>

              {/* Row 3: Message / Query (Textarea) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Message / Query <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.message.length} characters
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Please describe your specific requirements or questions regarding K12 Hunar programs..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`glass-input w-full px-4 py-3 rounded-xl text-sm resize-none ${
                    validationErrors.message ? 'border-rose-500 focus:ring-rose-500' : ''
                  }`}
                />
                {validationErrors.message && (
                  <p className="text-[11px] text-rose-400 mt-1">{validationErrors.message}</p>
                )}
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 focus:ring-4 focus:ring-brand-500/30 transition-all duration-300 shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting to Supabase DB...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Inquiry to K12 Hunar</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};

export default PublicInquiryForm;
