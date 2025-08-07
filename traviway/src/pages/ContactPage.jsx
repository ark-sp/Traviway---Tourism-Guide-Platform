import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
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
              placeholder="Write your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {submitStatus && (
          <p className="mt-6 text-center text-green-600 font-semibold">{submitStatus}</p>
        )}

        <div className="mt-10 text-center text-gray-600">
          <p><strong>Phone:</strong> +1 234 567 890</p>
          <p><strong>Address:</strong> 123 Travel Road, Adventure City, Earth</p>
        </div>

        {/* Socials */}
        <div className="mt-8 flex justify-center gap-8">
          {/* Instagram */}
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
          {/* X (Twitter) */}
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
          {/* Facebook */}
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
