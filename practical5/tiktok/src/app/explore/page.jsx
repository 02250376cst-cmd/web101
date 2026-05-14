'use client';
import { useState, useEffect } from 'react';
import { videoService } from '@/services/videoService';
import Link from 'next/link';

export default function ExplorePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      try {
        let allVideos = [];
        let cursor = undefined;
        let hasMore = true;

        // Keep fetching until we have all videos
        while (hasMore) {
          const { data } = await videoService.getAllVideos({ cursor });

          // Handle both old array format and new paginated format
          if (Array.isArray(data)) {
            allVideos = data;
            hasMore = false;
          } else {
            allVideos = [...allVideos, ...(data.videos || [])];
            hasMore = data.hasNextPage;
            cursor = data.nextCursor;
          }
        }

        setVideos(allVideos);
      } catch {}
      finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const filtered = videos.filter((v) =>
    v.title?.toLowerCase().includes(search.toLowerCase()) ||
    v.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-8 pt-6 pb-10">
      <h1 className="text-xl font-bold mb-4">Explore</h1>

      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos or users..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((video) => {
            const videoUrl = video.videoUrl?.startsWith('http')
              ? video.videoUrl
              : `http://localhost:5000${video.videoUrl}`;
            return (
              <div key={video.id} className="flex flex-col gap-1">
                <Link href={`/profile/${video.user?.id}`}>
                  <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden relative group cursor-pointer">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-semibold drop-shadow truncate">
                        {video.title}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-1.5 px-1">
                  <img
                    src={video.user?.avatar || `https://i.pravatar.cc/20?u=${video.user?.id}`}
                    className="w-4 h-4 rounded-full object-cover"
                    alt=""
                  />
                  <span className="text-xs text-gray-500 truncate">
                    {video.user?.username}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    ❤️ {video._count?.likes || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}