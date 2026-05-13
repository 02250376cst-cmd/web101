'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';
import { videoService } from '@/services/videoService';

export default function VideoCard({ video, userInteracted = false, isFirst = false }) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [likeCount, setLikeCount] = useState(video._count?.likes || 0);
  const [commentCount, setCommentCount] = useState(video._count?.comments || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getVideoUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  // Unmute when user interacts and video is visible
  useEffect(() => {
    if (userInteracted && isVisible && videoRef.current) {
      videoRef.current.muted = false;
    }
  }, [userInteracted, isVisible]);

  // Intersection Observer — play/pause based on visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = videoRef.current;
          if (!vid) return;

          if (entry.isIntersecting) {
            setIsVisible(true);
            vid.play().catch(() => {});
            setPlaying(true);
            // Unmute if user has already interacted
            vid.muted = !userInteracted;
          } else {
            setIsVisible(false);
            vid.pause();
            vid.currentTime = 0;
            vid.muted = true;
            setPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [userInteracted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please log in to like videos');
    try {
      const { data } = await videoService.likeVideo(video.id);
      setLiked(data.liked);
      setLikeCount((prev) => data.liked ? prev + 1 : prev - 1);
    } catch {}
  };

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        const { data } = await videoService.getComments(video.id);
        setComments(data);
      } catch {}
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to comment');
    if (!commentText.trim()) return;
    try {
      const { data } = await videoService.addComment(video.id, commentText.trim());
      setComments((prev) => [data, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText('');
    } catch {}
  };

  return (
    <div ref={containerRef} className="flex gap-3 py-5 border-b border-gray-100">
      {/* Avatar */}
      <Link href={`/profile/${video.user?.id}`} className="flex-shrink-0">
        <img
          src={video.user?.avatar || `https://i.pravatar.cc/40?u=${video.user?.id}`}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        {/* Username + title */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Link href={`/profile/${video.user?.id}`} className="font-bold text-sm hover:underline">
            {video.user?.username}
          </Link>
          <span className="text-gray-500 text-sm truncate">{video.title}</span>
        </div>

        <div className="flex gap-3 items-end">
          {/* Video player */}
          <div
            className="relative bg-black rounded-xl overflow-hidden flex-shrink-0"
            style={{ width: 300, height: 530 }}
          >
            {videoError ? (
              <div className="flex flex-col items-center justify-center h-full text-white text-center p-4">
                <span className="text-3xl mb-2">🎬</span>
                <p className="text-sm font-medium">Video unavailable</p>
                <p className="text-xs text-gray-400 mt-1">Unable to load video</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={getVideoUrl(video.videoUrl)}
                  className="w-full h-full object-contain"
                  loop
                  playsInline
                  muted
                  onError={() => setVideoError(true)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />

                {/* Click to play/pause */}
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Play icon when paused */}
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </div>
                )}

                {/* Tap for sound hint — only before first interaction */}
                {!userInteracted && (
                  <div className="absolute top-3 left-3 bg-black/50 rounded-full px-2.5 py-1 pointer-events-none">
                    <span className="text-white text-xs">🔇 Tap for sound</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4 pb-2">
            {/* Like */}
            <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition
                ${liked ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <span className={`text-lg ${liked ? 'text-red-500' : ''}`}>❤️</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{likeCount}</span>
            </button>

            {/* Comment */}
            <button onClick={handleShowComments} className="flex flex-col items-center gap-1 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition
                ${showComments ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                <span className="text-lg">💬</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">{commentCount}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Link copied!');
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition">
                <span className="text-lg">↗️</span>
              </div>
              <span className="text-xs font-semibold text-gray-700">Share</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 max-w-xs">
            {user && (
              <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
                <img
                  src={user.avatar || `https://i.pravatar.cc/28?u=${user.id}`}
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  alt=""
                />
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-gray-400"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="text-sm text-[#FE2C55] font-semibold hover:underline disabled:opacity-40"
                >
                  Post
                </button>
              </form>
            )}
            {comments.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">
                No comments yet. Be the first!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2 py-1">
                    <img
                      src={c.user?.avatar || `https://i.pravatar.cc/28?u=${c.user?.id}`}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                      alt=""
                    />
                    <div className="text-sm">
                      <span className="font-semibold mr-1">{c.user?.username}</span>
                      <span className="text-gray-700">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}