'use client';
import { useState, useEffect } from 'react';
import VideoFeed from '@/components/ui/VideoFeed';
import { useAuth } from '@/contexts/authContext';

export default function FollowingPage() {
  const { user } = useAuth();
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handle = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handle);
      window.removeEventListener('touchstart', handle);
    };
    window.addEventListener('click', handle);
    window.addEventListener('touchstart', handle);
    return () => {
      window.removeEventListener('click', handle);
      window.removeEventListener('touchstart', handle);
    };
  }, []);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
      <p className="text-4xl mb-3">👥</p>
      <p className="font-medium">Log in to see videos from people you follow</p>
    </div>
  );

  return (
    <div>
      <div className="px-8 pt-6 pb-3 border-b border-gray-100">
        <h1 className="text-base font-bold">Following</h1>
      </div>
      <VideoFeed type="following" userInteracted={userInteracted} />
    </div>
  );
}