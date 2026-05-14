'use client';
import { useState, useEffect } from 'react';
import VideoFeed from '@/components/ui/VideoFeed';

export default function HomePage() {
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handle = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handle);
      window.removeEventListener('touchstart', handle);
      window.removeEventListener('keydown', handle);
    };
    window.addEventListener('click', handle);
    window.addEventListener('touchstart', handle);
    window.addEventListener('keydown', handle);
    return () => {
      window.removeEventListener('click', handle);
      window.removeEventListener('touchstart', handle);
      window.removeEventListener('keydown', handle);
    };
  }, []);

  return <VideoFeed type="forYou" userInteracted={userInteracted} />;
}