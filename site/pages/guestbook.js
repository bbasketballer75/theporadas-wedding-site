import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GuestBookRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#guestbook');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to Guest Book...</p>
      </div>
    </div>
  );
}
