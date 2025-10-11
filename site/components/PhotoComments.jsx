/**
 * Photo Comments Component
 * Real-time comment system using Firestore
 */

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PhotoComments({ photoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Real-time comments listener
  useEffect(() => {
    if (!photoId) return;

    const commentsRef = collection(db, 'photos', photoId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      },
      (err) => {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      }
    );

    return () => unsubscribe();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !userName.trim()) {
      setError('Please enter your name and comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const commentsRef = collection(db, 'photos', photoId, 'comments');
      await addDoc(commentsRef, {
        text: newComment.trim(),
        userName: userName.trim(),
        createdAt: serverTimestamp(),
      });

      setNewComment('');
      // Keep userName for convenience
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="photo-comments">
      <h3 className="comments-title">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="name-input"
          required
        />
        <textarea
          placeholder="Share your thoughts about this photo..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          rows={3}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">Be the first to comment on this photo!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="user-avatar">{comment.userName.charAt(0).toUpperCase()}</div>
                <div className="comment-meta">
                  <div className="user-name">{comment.userName}</div>
                  <div className="comment-time">{formatTimestamp(comment.createdAt)}</div>
                </div>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .photo-comments {
          margin-top: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .comments-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .comment-form {
          margin-bottom: 2rem;
        }

        .name-input,
        .comment-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          font-family: inherit;
        }

        .name-input {
          margin-bottom: 0.75rem;
        }

        .comment-input {
          resize: vertical;
          min-height: 80px;
        }

        .name-input:focus,
        .comment-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.75rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .no-comments {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
          font-style: italic;
        }

        .comment {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.75rem;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .comment-meta {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #1f2937;
        }

        .comment-time {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .comment-text {
          color: #4b5563;
          line-height: 1.6;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
