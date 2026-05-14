'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/authContext';

export default function ExploreUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState({});
  const [loadingFollow, setLoadingFollow] = useState({});

  useEffect(() => {
    if (!user) {
      // Load users even when not logged in
      userService.getAllUsers()
        .then(({ data }) => setUsers(data))
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    // Load users AND current user's profile to know who they follow
    Promise.all([
      userService.getAllUsers(),
      userService.getProfile(user.id),
    ])
      .then(([usersRes, profileRes]) => {
        setUsers(usersRes.data);

        // Build initial follow states from the profile's following list
        const profile = profileRes.data;
        const currentFollowing = {};

        // profile.following contains users this person follows
        if (profile.followers) {
          // We need to check differently — get following list from profile
        }

        // Better approach: check each user against followers list
        // The profile returns videos, not following list directly
        // So we use the server's follow endpoint response instead
        setFollowStates({});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // Separate effect to load follow states properly
  useEffect(() => {
    if (!user || users.length === 0) return;

    // Get current user's full profile to see who they follow
    userService.getProfileWithFollowing(user.id)
      .then(({ data }) => {
        const states = {};
        if (data.followingUsers) {
          data.followingUsers.forEach((f) => {
            states[f.followingId] = true;
          });
        }
        setFollowStates(states);
      })
      .catch(() => {});
  }, [user, users]);

  const handleFollow = async (targetId) => {
    if (!user) return alert('Please log in first');

    // Optimistic update — update UI immediately
    setFollowStates((prev) => ({ ...prev, [targetId]: !prev[targetId] }));
    setLoadingFollow((prev) => ({ ...prev, [targetId]: true }));

    try {
      const { data } = await userService.followUser(targetId);
      // Confirm with server response
      setFollowStates((prev) => ({ ...prev, [targetId]: data.following }));
    } catch {
      // Revert on error
      setFollowStates((prev) => ({ ...prev, [targetId]: !prev[targetId] }));
    } finally {
      setLoadingFollow((prev) => ({ ...prev, [targetId]: false }));
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 text-gray-400 text-sm">
      Loading users...
    </div>
  );

  return (
    <div className="px-8 pt-6 pb-10">
      <h1 className="text-xl font-bold mb-6">Find Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.filter((u) => u.id !== user?.id).map((u) => (
          <div
            key={u.id}
            className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-gray-200 transition"
          >
            <Link href={`/profile/${u.id}`}>
              <img
                src={u.avatar || `https://i.pravatar.cc/50?u=${u.id}`}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                alt=""
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/profile/${u.id}`}
                className="font-bold text-sm hover:underline block truncate"
              >
                {u.username}
              </Link>
              {u.name && (
                <p className="text-gray-500 text-xs truncate">{u.name}</p>
              )}
              <p className="text-gray-400 text-xs mt-0.5">
                {u._count?.followers} followers · {u._count?.videos} videos
              </p>
            </div>
            <button
              onClick={() => handleFollow(u.id)}
              disabled={loadingFollow[u.id]}
              className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full border transition
                ${followStates[u.id]
                  ? 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
                  : 'bg-[#FE2C55] border-[#FE2C55] text-white hover:bg-[#e0264c]'
                } disabled:opacity-50`}
            >
              {loadingFollow[u.id]
                ? '...'
                : followStates[u.id] ? 'Following' : 'Follow'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}