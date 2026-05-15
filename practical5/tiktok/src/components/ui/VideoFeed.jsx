'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import VideoCard from './VideoCard';

export default function VideoFeed({ type = 'forYou', userInteracted }) {

    const sentinelRef = useRef(null);

  const fetchVideos = useCallback(async ({ pageParam = undefined }) => {
    const fetcher = type === 'following'
      ? videoService.getFollowingVideos
      : videoService.getAllVideos;
    const { data } = await fetcher({ cursor: pageParam });
    return data;
  }, [type]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['videos', type],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) =>
      lastPage?.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
  });
  // ── Intersection Observer setup ──────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
      if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('Sentinel visible — fetching next page...');
          fetchNextPage();
        }
      },
      {
        root: null,       // observe relative to viewport
        rootMargin: '200px', // start loading 200px BEFORE reaching the bottom
        threshold: 0,     // fire as soon as even 1px is visible
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return (
    <div className="flex justify-center items-center py-24">
      <div className="text-gray-400 text-sm">Loading videos...</div>
    </div>
  );

  if (isError) return (
    <div className="text-center py-24">
      <p className="text-red-400 text-sm">
        {error?.response?.data?.message || 'Failed to load videos. Is the server running?'}
      </p>
    </div>
  );

  const allVideos = data?.pages.flatMap((page) => page.videos) ?? [];

  if (allVideos.length === 0) return (
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

      {allVideos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          userInteracted={userInteracted}
          isFirst={index === 0}
        />
      ))}

      {/* Sentinel — triggers next page load when visible */}
      <div
        ref={sentinelRef}
        className="py-8 flex justify-center"
        style={{ minHeight: '80px' }}
      >
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
            Loading more...
          </div>
        ) : hasNextPage ? (
          <div className="text-gray-300 text-xs">Scroll for more</div>
        ) : allVideos.length > 0 ? (
          <div className="text-gray-300 text-xs">You've seen all videos</div>
        ) : null}
      </div>
    </div>
  );
}