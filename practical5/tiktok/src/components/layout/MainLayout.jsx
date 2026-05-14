'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import AuthModal from '@/components/auth/AuthModal';

function NavItem({ href, emoji, label, active }) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors
        ${active ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
      <span className="text-lg w-5 text-center">{emoji}</span>
      {label}
    </Link>
  );
}

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-[240px] fixed top-0 left-0 h-full border-r border-gray-100 flex flex-col pt-5 px-3 z-40">
        <Link href="/" className="text-black font-black text-2xl tracking-tight px-4 mb-6 block">
          <span className="text-[#FE2C55]">Tik</span>Tok
        </Link>
        <nav className="space-y-1">
          <NavItem href="/" emoji="🏠" label="For You" active={pathname === '/'} />
          <NavItem href="/following" emoji="👥" label="Following" active={pathname === '/following'} />
          <NavItem href="/explore-users" emoji="🧑‍🤝‍🧑" label="Find Users" active={pathname === '/explore-users'} />
          <NavItem href="/explore" emoji="🧭" label="Explore" active={pathname === '/explore'} />
          <NavItem href="/live" emoji="📹" label="LIVE" active={pathname === '/live'} />
        </nav>
        <div className="mt-auto mb-6 px-1 space-y-2">
          {user ? (
            <>
              <Link href="/upload"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1677FE] hover:bg-blue-600 text-white rounded-full font-semibold text-sm transition">
                <span className="text-lg">＋</span> Upload
              </Link>
              <Link href={`/profile/${user.id}`}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition">
                <img src={user.avatar || `https://i.pravatar.cc/32?u=${user.id}`}
                  className="w-7 h-7 rounded-full object-cover" alt="" />
                <span className="font-medium truncate">{user.username}</span>
              </Link>
              <button onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 rounded-lg transition">
                Log out
              </button>
            </>
          ) : (
            <button onClick={() => setAuthOpen(true)}
              className="w-full py-2.5 bg-[#1677FE] hover:bg-blue-600 text-white rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition">
              <span className="w-5 h-5 bg-white text-[#1677FE] rounded-full flex items-center justify-center font-bold text-xs">N</span>
              Log in
            </button>
          )}
        </div>
      </aside>
      <main className="ml-[240px] flex-1 min-h-screen">{children}</main>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
