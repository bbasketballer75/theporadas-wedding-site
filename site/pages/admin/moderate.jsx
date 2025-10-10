import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import dynamic from 'next/dynamic';

// Disable SSR because this dashboard depends on browser-only APIs (Firebase listeners, window.confirm).
const ModerationDashboard = dynamic(() => import('../../components/admin/ModerationDashboard'), {
  ssr: false,
});

export default ModerationDashboard;
