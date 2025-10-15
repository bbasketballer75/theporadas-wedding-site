import { useState } from 'react';

import SectionTransition from '../SectionTransition';

/**
 * Guest Book Section
 * Interactive guest messages with inline form submission
 */
export default function GuestBookSection() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Placeholder guest messages (will connect to Firestore)
  const [guestMessages, setGuestMessages] = useState([
    {
      id: 1,
      name: 'Sarah & Michael',
      message:
        'Congratulations on your beautiful wedding! Wishing you both a lifetime of love and happiness. 💕',
      timestamp: '2 days ago',
    },
    {
      id: 2,
      name: 'The Johnson Family',
      message: 'What an incredible celebration! Thank you for sharing your special day with us.',
      timestamp: '3 days ago',
    },
    {
      id: 3,
      name: 'Emily Chen',
      message:
        'So happy for you two! The ceremony was absolutely perfect. Cheers to the newlyweds! 🥂',
      timestamp: '4 days ago',
    },
    {
      id: 4,
      name: 'David & Amanda',
      message:
        'Beautiful wedding, beautiful couple! May your love story continue to inspire everyone around you.',
      timestamp: '5 days ago',
    },
  ]);

  // Form submit handler (will integrate with Firebase/Canva)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setIsSubmitting(true);

    // Simulate submission (replace with actual Firebase/Canva integration)
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        message: formData.message,
        timestamp: 'Just now',
      };
      setGuestMessages([newMessage, ...guestMessages]);
      setFormData({ name: '', message: '', email: '' });
      setIsSubmitting(false);
      setSubmitted(true);

      // Reset submitted status after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="guestbook"
      className="section-elegant bg-gradient-to-br from-ivory via-blush-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">✍️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Guest Book
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Leave us a heartfelt message! Your words will be transformed into beautiful
              Canva-designed cards.
            </p>
          </div>
        </SectionTransition>

        {/* Features Grid */}
        <SectionTransition>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 text-left shadow-elegant hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">💌</div>
              <div className="font-semibold text-sage-700 mb-2 text-lg">Share Your Thoughts</div>
              <div className="text-sm text-charcoal/70">
                Write a message, memory, or well-wishes for the newlyweds
              </div>
            </div>
            <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 text-left shadow-elegant hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">🎨</div>
              <div className="font-semibold text-blush-600 mb-2 text-lg">Auto-Generated Cards</div>
              <div className="text-sm text-charcoal/70">
                Your message becomes a beautiful wedding-themed card design
              </div>
            </div>
          </div>
        </SectionTransition>

        {/* Two Column Layout: Form + Messages */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Guest Book Form */}
          <SectionTransition>
            <div className="card-elegant p-8">
              <h3 className="text-2xl font-display text-gradient-sage mb-6 text-center">
                Sign the Guest Book
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none transition-colors bg-white"
                    placeholder="John & Jane Doe"
                  />
                </div>

                {/* Email Input (Optional) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none transition-colors bg-white"
                    placeholder="[email protected]"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-charcoal mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none transition-colors resize-none bg-white"
                    placeholder="Share your thoughts, memories, or well-wishes for the newlyweds..."
                  />
                  <p className="text-xs text-charcoal/60 mt-2">
                    {formData.message.length} / 500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.message}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : submitted ? (
                    <>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Submitted! ✨
                    </>
                  ) : (
                    'Sign Guest Book →'
                  )}
                </button>
              </form>
            </div>
          </SectionTransition>

          {/* Recent Messages */}
          <SectionTransition>
            <div>
              <h3 className="text-2xl font-display text-gradient-blush mb-6 text-center">
                Recent Messages ({guestMessages.length})
              </h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {guestMessages.map((message) => (
                  <div
                    key={message.id}
                    data-testid="guestbook-message"
                    className="card-elegant p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-200 to-blush-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{message.name.charAt(0).toUpperCase()}</span>
                      </div>

                      {/* Message Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-charcoal">{message.name}</h4>
                          <span className="text-xs text-charcoal/60">{message.timestamp}</span>
                        </div>
                        <p className="text-charcoal/80 leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionTransition>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a0c4a3, #d4a5a5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #8fb091, #c98d8d);
        }
      `}</style>
    </section>
  );
}
