import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import useScrollReveal from '../hooks/useScrollReveal';

const USER_TYPES = ['Parent', 'Student', 'School'];
const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];

export const PublicInquiryForm = () => {
  const [formData, setFormData] = useState({
    user_type: 'Parent',
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

  useScrollReveal();

  const syncCategoryFromUrl = useCallback(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const cat = searchParams.get('category');
      if (cat && CATEGORIES.includes(cat)) {
        setFormData((prev) => ({ ...prev, category: cat }));
        const el = document.getElementById('inquiry');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    syncCategoryFromUrl();
    window.addEventListener('popstate', syncCategoryFromUrl);
    window.addEventListener('categoryChange', syncCategoryFromUrl);
    return () => {
      window.removeEventListener('popstate', syncCategoryFromUrl);
      window.removeEventListener('categoryChange', syncCategoryFromUrl);
    };
  }, [syncCategoryFromUrl]);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!phoneClean || phoneClean.length < 8 || phoneClean.length > 15) {
      errors.phone = 'Please enter a contact phone number.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please provide details of your question (minimum 5 characters).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      if (response && response.success) {
        setSubmittedSuccess(true);
        setFormData({
          user_type: 'Parent',
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
      setErrorMessage(err.message || 'Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setSubmittedSuccess(false);
    setErrorMessage('');
    setValidationErrors({});
  };

  return (
    <section id="inquiry" className="py-20 sm:py-28 border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-700 dark:text-cyan-300 text-xs font-bold mb-4 uppercase tracking-wider">
              Get in touch
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-[-0.03em]">
              Send us your inquiry
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Have questions regarding program eligibility, concert participation, or student admissions? Complete the form and our educational counselor will connect with you directly.
            </p>

            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3">
                What happens next
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">1</span>
                  <span>Your query is logged directly into our Supabase admissions database.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">2</span>
                  <span>An educational counselor reviews your request within 24–48 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">3</span>
                  <span>We contact you via email or phone with clear next steps.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (7 cols): The Card */}
          <div className="lg:col-span-7 reveal stagger-2">
            <div className="p-7 sm:p-9 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-xl">
              
              {submittedSuccess ? (
                <div className="py-8 text-center animate-feedback-fade">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 font-bold text-2xl border border-emerald-500/20">
                    ✓
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-2">
                    Inquiry received
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                    Thanks, we have received your inquiry. We will get back to you soon.
                  </p>
                  <button
                    onClick={handleSendAnother}
                    className="btn-hero-secondary !text-xs !py-2.5 !px-5"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold animate-feedback-fade">
                      {errorMessage}
                    </div>
                  )}

                  {/* Row 1: I am a & Topic */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user_type" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                        I am a
                      </label>
                      <select
                        id="user_type"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      >
                        {USER_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-slate-900 text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                        Topic
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="bg-slate-900 text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Row 3: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      {validationErrors.phone && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Describe your questions or requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y transition-all"
                    />
                    {validationErrors.message && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{validationErrors.message}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-hero-primary w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Submitting inquiry...' : 'Submit inquiry →'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PublicInquiryForm;
