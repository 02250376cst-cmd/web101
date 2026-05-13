'use client';
import { useState, useEffect } from 'react';
import { videoService } from '@/services/videoService';
import VideoCard from './VideoCard';

export default function VideoFeed({ type = 'forYou' }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = type === 'following'
          ? await videoService.getFollowingVideos()
          : await videoService.getAllVideos();
        setVideos(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load videos. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [type]);

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="text-gray-400 text-sm">Loading videos...</div>
    </div>
  );

  if (error) return (
    <div className="text-center py-24">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (videos.length === 0) return (
    <div className="text-center py-24">
      <p className="text-4xl mb-3">🎬</p>
      <p className="text-gray-500 font-medium">
        {type === 'following' ? "You're not following anyone yet" : 'No videos yet'}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        {type === 'following' ? 'Go to Find Users to follow people' : 'Be the first to upload!'}
      </p>
    </div>
  );

  return (
    <div className="max-w-xl px-8 pt-6 pb-10">
      {!userInteracted && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm text-gray-500">
          <span className="text-lg">🔇</span>
          <span>Tap anywhere to enable sound</span>
        </div>
      )}
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          userInteracted={userInteracted}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
}