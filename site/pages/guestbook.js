import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import { db } from '../lib/firebase';
import { generateGuestBookCard, isCanvaAvailable } from '../utils/canvaService';

export default function GuestBookPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    relationship: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [canvaAvailable, setCanvaAvailable] = useState(false);

  useEffect(() => {
    // Check Canva availability
    const checkCanva = async () => {
      const available = await isCanvaAvailable();
      setCanvaAvailable(available);
    };
    checkCanva();

    // Load messages from Firestore
    const messagesRef = collection(db, 'guestbook_messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(firestoreMessages);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please fill in your name and message');
      return;
    }

    setSubmitting(true);

    try {
      // Generate Canva card if available
      let cardImageUrl = null;
      if (canvaAvailable) {
        try {
          // Use first guest book template (will be replaced with actual template ID)
          const templateId = 'GUESTBOOK_TEMPLATE_1';
          cardImageUrl = await generateGuestBookCard({
            templateId,
            message: formData.message.trim(),
            author: formData.name.trim(),
          });
        } catch (cardError) {
          console.error('Error generating Canva card:', cardError);
          // Continue without card image
        }
      }

      await addDoc(collection(db, 'guestbook_messages'), {
        name: formData.name.trim(),
        message: formData.message.trim(),
        relationship: formData.relationship.trim() || 'Guest',
        timestamp: serverTimestamp(),
        approved: true, // Auto-approve for now
        cardImageUrl, // Canva-generated card image (if available)
      });

      setFormData({ name: '', message: '', relationship: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getRandomGradient = (index) => {
    const gradients = [
      'from-sage/20 to-mint/20',
      'from-blush/20 to-cream/20',
      'from-sage/10 to-blush/10',
      'from-mint/20 to-sage/20',
      'from-cream/30 to-blush/20',
    ];
    return gradients[index % gradients.length];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageTransition>
      <Head>
        <title>Guest Book | Austin & Jordyn</title>
        <meta name="description" content="Leave a message for the happy couple!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Guest Book</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Leave us a message! Share your favorite memory from the wedding, well wishes, or just
              say hello. 💕
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Message Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in">
              <h2 className="text-3xl font-display text-sage mb-6 text-center">
                Sign Our Guest Book ✍️
              </h2>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-gradient-sage-blush rounded-xl text-white text-center animate-fade-in">
                  <span className="font-semibold">Thank you! Your message has been posted! 🎉</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-sage/20 rounded-xl focus:outline-none focus:border-sage transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Relationship to Couple
                  </label>
                  <input
                    type="text"
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-sage/20 rounded-xl focus:outline-none focus:border-sage transition-colors"
                    placeholder="e.g., Friend, Family, Coworker"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-sage/20 rounded-xl focus:outline-none focus:border-sage transition-colors resize-none"
                    placeholder="Share your favorite memory, well wishes, or congratulations..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-sage-blush text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? 'Posting...' : 'Post Message'}
                </button>
              </form>
            </div>

            {/* Messages Display */}
            <div className="space-y-6">
              <h2 className="text-3xl font-display text-sage mb-6 text-center lg:text-left">
                Messages from Our Guests
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sage border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-white/60 backdrop-blur rounded-2xl p-12 text-center">
                  <p className="text-gray-600 text-lg">Be the first to sign our guest book! 📝</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`bg-gradient-to-br ${getRandomGradient(index)} backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in border border-white/40`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-sage">{msg.name}</h3>
                          {msg.relationship && (
                            <p className="text-sm text-blush font-medium">{msg.relationship}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fun Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-display text-sage mb-2">{messages.length}</div>
              <div className="text-gray-600">Messages Posted</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-display text-blush mb-2">💕</div>
              <div className="text-gray-600">Lots of Love</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-display text-sage mb-2">✨</div>
              <div className="text-gray-600">Cherished Forever</div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
