import React, { useState } from "react";
import API from "../api/apiClient";


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitStatus(null);

    try {
      // API call to the notification-service via the API Gateway
      const response = await API.post('/notifications/contact', formData);
      setSubmitStatus(typeof response.data === 'string' ? response.data : 'Message sent successfully!');
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      
      // Handle different error types safely
      let errorMessage = "An unexpected error occurred. Please try again later.";
      
      if (err.response) {
        // Server responded with error
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.status === 404) {
            errorMessage = "Contact service is currently unavailable. Please try again later or contact us directly at contact@traviway.com";
          }
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl border border-gray-200 p-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Contact Us</h1>
        <p className="text-center text-gray-600 mb-8">
          We'd love to hear from you! Please fill out the form below or reach us at <a href="mailto:omkarthorat1042@gmail.com" className="text-blue-600 underline">contact@traviway.com</a>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              placeholder="Write your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {submitStatus && (
          <p className="mt-6 text-center text-green-600 font-semibold">{submitStatus}</p>
        )}
        {error && (
          <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
        )}

        <div className="mt-10 text-center text-gray-600">
          <p><strong>Phone:</strong> +91 8329979886</p>
          <p><strong>Address:</strong>C-DAC Innovation Park, Sr. No. 34/B/1 Panchvati, Pashan, Pune - 411008</p>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-pink-500"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
              <rect x="5" y="5" width="22" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
              <circle cx="23" cy="9" r="1.5" fill="currentColor"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="transition-colors hover:text-black"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="5" width="22" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 12l8 8M20 12l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-colors hover:text-blue-600"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="5" y="5" width="22" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M18 14h2v-2a2 2 0 00-2-2h-1a2 2 0 00-2 2v2h-1v2h1v6h2v-6h1l1-2z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;