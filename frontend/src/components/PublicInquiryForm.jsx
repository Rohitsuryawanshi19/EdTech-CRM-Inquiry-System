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

  // Sync category from URL parameter ?category=...
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
    <section id="inquiry" className="py-16 sm:py-20 border-b border-[#E2D9C8]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5 cols): Heading, Paragraph & What happens next */}
          <div className="lg:col-span-5 reveal">
            <h2 className="font-serif font-bold text-3xl text-[#1E2A3A] mb-4">
              Send us your inquiry
            </h2>

            <p className="text-sm sm:text-base text-[#556070] mb-8 leading-relaxed">
              Have questions regarding program eligibility, concert participation, or student admissions? Complete the form and our team will get back to you shortly.
            </p>

            {/* What happens next list */}
            <div className="p-6 rounded-[10px] bg-[#F3ECE0] border border-[#E2D9C8]">
              <h3 className="font-serif font-bold text-base text-[#1E2A3A] mb-3">
                What happens next
              </h3>
              <ul className="space-y-2.5 text-sm text-[#556070]">
                <li className="flex items-start gap-2">
                  <span className="text-[#1F5F4A] font-bold mt-0.5">•</span>
                  <span>Your query is logged directly into our admissions database.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1F5F4A] font-bold mt-0.5">•</span>
                  <span>An educational counselor reviews your request within 24–48 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1F5F4A] font-bold mt-0.5">•</span>
                  <span>We contact you via email or phone with clear next steps.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column (7 cols): The Form in a white bordered card */}
          <div className="lg:col-span-7 reveal stagger-2">
            <div className="warm-card p-6 sm:p-8">
              
              {submittedSuccess ? (
                /* Success State: simple fade-in, no bouncing */
                <div className="py-8 text-center animate-feedback-fade">
                  <div className="w-12 h-12 rounded-[999px] bg-[#E0F0E8] text-[#1F5F4A] flex items-center justify-center mx-auto mb-4 font-serif font-bold text-lg">
                    ✓
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1E2A3A] mb-2">
                    Inquiry received
                  </h3>
                  <p className="text-sm text-[#556070] max-w-md mx-auto mb-6 leading-relaxed">
                    Thanks, we have received your inquiry. We will get back to you soon.
                  </p>
                  <button
                    onClick={handleSendAnother}
                    className="btn-secondary !text-xs !py-2 !px-4"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                /* The Inquiry Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Error Alert: simple fade-in, no bouncing */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-[8px] bg-[#FDECEA] border border-[#B3261E]/30 text-[#B3261E] text-xs animate-feedback-fade">
                      {errorMessage}
                    </div>
                  )}

                  {/* Row 1: I am a (Dropdown) & Topic (Dropdown) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="user_type" className="form-label">
                        I am a
                      </label>
                      <select
                        id="user_type"
                        name="user_type"
                        value={formData.user_type}
                        onChange={handleChange}
                        className="form-input"
                      >
                        {USER_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <span className="form-helper">Parent, student or school representative.</span>
                    </div>

                    <div>
                      <label htmlFor="category" className="form-label">
                        Topic
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-input"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <span className="form-helper">Primary area of interest.</span>
                    </div>
                  </div>

                  {/* Row 2: Full Name */}
                  <div>
                    <label htmlFor="name" className="form-label">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-[#B3261E] mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Row 3: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-[#B3261E] mt-1">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                      {validationErrors.phone && (
                        <p className="text-xs text-[#B3261E] mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Describe what information or guidance you need..."
                      value={formData.message}
                      onChange={handleChange}
                      className="form-input !min-h-[100px] resize-y"
                    />
                    {validationErrors.message && (
                      <p className="text-xs text-[#B3261E] mt-1">{validationErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Sending inquiry...' : 'Send inquiry'}
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
