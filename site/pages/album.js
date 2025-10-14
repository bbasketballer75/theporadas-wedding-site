import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AlbumRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/#album'); }, [router]);
  return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-600"></div></div>;
}
