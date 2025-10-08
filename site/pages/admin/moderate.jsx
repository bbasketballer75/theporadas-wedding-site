import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { logModerationAction } from '../../lib/analytics';
import { db } from '../../lib/firebase';
import { supabase } from '../../lib/supabase';

/**
 * Photo Moderation Dashboard
 * Admin page to review, approve, flag, and delete uploaded photos
 *
 * Features:
 * - Real-time gallery monitoring
 * - Flag inappropriate content
 * - Delete spam/unwanted uploads
 * - Approve photos for public display
 * - View uploader names and timestamps
 * - Supabase storage integration for deletion
 *
 * Security: This is a simple admin page. In production, add Firebase Auth
 * and Firestore rules to restrict access to authorized users only.
 */
export default function ModerationDashboard() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, flagged, approved
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    console.log('[ModerationDashboard] Setting up listener...');

    const q = query(collection(db, 'wedding-photos'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setMedia(items);
        setLoading(false);
      },
      (err) => {
        console.error('[ModerationDashboard] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter media based on moderation status
  const filteredMedia = media.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !item.moderationStatus || item.moderationStatus === 'pending';
    if (filter === 'flagged') return item.moderationStatus === 'flagged';
    if (filter === 'approved') return item.moderationStatus === 'approved';
    return true;
  });

  // Flag item as inappropriate
  const handleFlag = async (itemId) => {
    if (processing.has(itemId)) return;

    try {
      setProcessing((prev) => new Set(prev).add(itemId));
      const docRef = doc(db, 'wedding-photos', itemId);
      await updateDoc(docRef, {
        moderationStatus: 'flagged',
        flaggedAt: new Date().toISOString(),
      });
      console.log('[ModerationDashboard] Flagged:', itemId);
      logModerationAction('flag', itemId);
    } catch (err) {
      console.error('[ModerationDashboard] Flag error:', err);
      alert(`Error flagging item: ${err.message}`);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Approve item for display
  const handleApprove = async (itemId) => {
    if (processing.has(itemId)) return;

    try {
      setProcessing((prev) => new Set(prev).add(itemId));
      const docRef = doc(db, 'wedding-photos', itemId);
      await updateDoc(docRef, {
        moderationStatus: 'approved',
        approvedAt: new Date().toISOString(),
      });
      console.log('[ModerationDashboard] Approved:', itemId);
      logModerationAction('approve', itemId);
    } catch (err) {
      console.error('[ModerationDashboard] Approve error:', err);
      alert(`Error approving item: ${err.message}`);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Delete item from Firestore and Supabase Storage
  const handleDelete = async (item) => {
    if (processing.has(item.id)) return;

    const confirmDelete = window.confirm(
      `Delete "${item.name}" uploaded by ${item.uploadedBy || 'Unknown'}?\n\nThis will permanently remove the file from storage and cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setProcessing((prev) => new Set(prev).add(item.id));

      // Delete from Supabase Storage
      if (item.path) {
        console.log('[ModerationDashboard] Deleting from Supabase:', item.path);
        const { error: storageError } = await supabase.storage
          .from('wedding-photos')
          .remove([item.path]);

        if (storageError) {
          console.error('[ModerationDashboard] Supabase delete error:', storageError);
          throw new Error(`Storage deletion failed: ${storageError.message}`);
        }
      }

      // Delete from Firestore
      console.log('[ModerationDashboard] Deleting from Firestore:', item.id);
      await deleteDoc(doc(db, 'wedding-photos', item.id));

      console.log('[ModerationDashboard] Deleted successfully');
      logModerationAction('delete', item.id);
    } catch (err) {
      console.error('[ModerationDashboard] Delete error:', err);
      alert(`Error deleting item: ${err.message}`);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
        <p className="ml-4 text-gray-600">Loading moderation dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Photo Moderation Dashboard - The Poradas Wedding</title>
      </Head>

      <div className="min-h-screen bg-cream py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl text-sage mb-2">Photo Moderation Dashboard</h1>
            <p className="font-body text-gray-600">
              Review, approve, flag, and delete uploaded photos and videos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-sage mb-2">{media.length}</div>
              <div className="text-sm text-gray-600">Total Uploads</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {
                  media.filter((m) => !m.moderationStatus || m.moderationStatus === 'pending')
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {media.filter((m) => m.moderationStatus === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {media.filter((m) => m.moderationStatus === 'flagged').length}
              </div>
              <div className="text-sm text-gray-600">Flagged</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['all', 'pending', 'approved', 'flagged'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3 rounded-xl font-body font-medium transition-all duration-300 capitalize whitespace-nowrap ${
                  filter === f
                    ? 'bg-sage text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-sage/10'
                }`}
              >
                {f}
                {f === 'pending' &&
                  ` (${media.filter((m) => !m.moderationStatus || m.moderationStatus === 'pending').length})`}
              </button>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Media Grid */}
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-600 text-lg">No items to display for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <ModerationCard
                  key={item.id}
                  item={item}
                  onFlag={handleFlag}
                  onApprove={handleApprove}
                  onDelete={handleDelete}
                  processing={processing.has(item.id)}
                  formatTimestamp={formatTimestamp}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * ModerationCard Component
 * Individual card for each media item with moderation controls
 */
function ModerationCard({
  item,
  onFlag,
  onApprove,
  onDelete,
  processing,
  formatTimestamp,
  formatFileSize,
}) {
  const isVideo = item.type && item.type.startsWith('video/');
  const isImage = item.type && item.type.startsWith('image/');

  const getStatusBadge = () => {
    const status = item.moderationStatus || 'pending';
    const badges = {
      pending: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      flagged: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${badges[status] || badges.pending}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Preview */}
      <div className="relative aspect-square bg-gray-100">
        {isImage && (
          <img
            src={item.url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {isVideo && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <svg
              className="w-16 h-16 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-3 right-3">{getStatusBadge()}</div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        {/* Uploader */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="font-body font-semibold text-gray-800">
            {item.uploadedBy || 'Anonymous'}
          </span>
        </div>

        {/* Filename */}
        <p className="font-body text-sm text-gray-600 truncate" title={item.name}>
          {item.name}
        </p>

        {/* Metadata */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Type: {isImage ? '📷 Image' : '🎥 Video'}</div>
          <div>Size: {formatFileSize(item.size)}</div>
          {item.compressionSavings && <div>Saved: {item.compressionSavings}</div>}
          <div>Uploaded: {formatTimestamp(item.timestamp)}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {/* Approve Button */}
          <button
            onClick={() => onApprove(item.id)}
            disabled={processing || item.moderationStatus === 'approved'}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl font-body font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Approve for display"
          >
            ✓ Approve
          </button>

          {/* Flag Button */}
          <button
            onClick={() => onFlag(item.id)}
            disabled={processing || item.moderationStatus === 'flagged'}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-xl font-body font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Flag as inappropriate"
          >
            ⚠ Flag
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item)}
            disabled={processing}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-body font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Delete permanently"
          >
            🗑
          </button>
        </div>

        {/* Processing Indicator */}
        {processing && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sage"></div>
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
