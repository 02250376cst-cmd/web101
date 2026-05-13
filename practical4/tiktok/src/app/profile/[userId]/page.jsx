'use client';
import { useState, useEffect, use } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/authContext';

export default function ProfilePage({ params }) {
  const { userId } = use(params);  // ← unwrap the Promise
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    userService.getProfile(userId)
      .then(({ data }) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUser) return alert('Please log in first');
    try {
      const { data } = await userService.followUser(userId);
      setFollowing(data.following);
      setProfile((prev) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: data.following
            ? prev._count.followers + 1
            : prev._count.followers - 1,
        },
      }));
    } catch {}
  };

  if (loading) return (
    <div className="flex justify-center py-20 text-gray-400 text-sm">
      Loading profile...
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 text-gray-400">User not found</div>
  );

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-2xl mx-auto px-8 pt-8 pb-16">
      {/* Profile header */}
      <div className="flex items-start gap-6 mb-6">
        <img
          src={profile.avatar || `https://i.pravatar.cc/96?u=${profile.id}`}
          className="w-24 h-24 rounded-full object-cover"
          alt=""
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          {profile.name && (
            <p className="text-gray-500 text-sm mt-0.5">{profile.name}</p>
          )}

          {/* Stats */}
          <div className="flex gap-5 mt-3">
            <div className="text-center">
              <p className="font-bold text-sm">{profile._count?.following || 0}</p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">{profile._count?.followers || 0}</p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">{profile._count?.videos || 0}</p>
              <p className="text-gray-500 text-xs">Videos</p>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 mt-3">{profile.bio}</p>
          )}

          {/* Follow button */}
          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              className={`mt-3 px-6 py-2 rounded-full text-sm font-bold transition
                ${following
                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-[#FE2C55] text-white hover:bg-[#e0264c]'
                }`}
            >
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Videos grid */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
          Videos ({profile.videos?.length || 0})
        </p>
        {profile.videos?.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-sm">No videos yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {profile.videos?.map((v) => (
              <div
                key={v.id}
                className="aspect-[9/16] bg-black rounded overflow-hidden relative group cursor-pointer"
              >
                <video
                  src={
                    v.videoUrl?.startsWith('http')
                      ? v.videoUrl
                      : `http://localhost:5000${v.videoUrl}`
                  }
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                  muted
                />
                <div className="absolute bottom-1 left-1 text-white text-xs font-semibold drop-shadow">
                  {v.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}