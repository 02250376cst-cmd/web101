'use client';

import Link from 'next/link';
import {
  FaHouse,
  FaUser,
  FaUserGroup,
  FaCompassDrafting,
  FaVideo,
  FaCirclePlus,
  FaMagnifyingGlass
} from "react-icons/fa6";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-60 border-r fixed h-full overflow-y-auto bg-white">

        {/* Logo */}
        <div className="p-4">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-red-500 mr-1">TikTok</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-2">

            <li>
              <Link
                href="/"
                className="flex items-center p-3 hover:bg-gray-100 rounded-md mx-2"
              >
                <FaHouse className="text-xl mr-3" />
                <span>For You</span>
              </Link>
            </li>

            <li>
              <Link
                href="/following"
                className="flex items-center p-3 hover:bg-gray-100 rounded-md mx-2"
              >
                <FaUserGroup className="text-xl mr-3" />
                <span>Following</span>
              </Link>
            </li>

            <li>
              <Link
                href="/explore"
                className="flex items-center p-3 hover:bg-gray-100 rounded-md mx-2"
              >
                <FaCompassDrafting className="text-xl mr-3" />
                <span>Explore</span>
              </Link>
            </li>

            <li>
              <Link
                href="/live"
                className="flex items-center p-3 hover:bg-gray-100 rounded-md mx-2"
              >
                <FaVideo className="text-xl mr-3" />
                <span>LIVE</span>
              </Link>
            </li>

          </ul>
        </nav>

        {/* Suggested Accounts */}
        <div className="border-t px-3 py-3">
          <p className="text-sm text-gray-500 mb-2">
            Suggested accounts
          </p>

          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-100 rounded-md"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-2"></div>

              <div>
                <p className="text-sm font-semibold">
                  User {index + 1}
                </p>
                <p className="text-xs text-gray-500">
                  @user{index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Login Prompt */}
        <div className="border-t px-3 py-4">

          <p className="text-sm text-gray-500 mb-4">
            Log in to follow creators, like videos, and view comments.
          </p>

          <div className="space-y-2">

            <Link href="/login">
              <button className="w-full py-2 px-4 border border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition">
                Log in
              </button>
            </Link>

            <Link href="/signup">
              <button className="w-full py-2 px-4 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition">
                Sign up
              </button>
            </Link>

          </div>

        </div>

        {/* Footer */}
        <div className="border-t px-3 py-4 text-xs text-gray-500">
          <p>© 2025 TikTok</p>
        </div>

      </div>


      {/* Main Content */}
      <div className="flex-1 ml-60">

        <div className="max-w-[1158px] mx-auto">

          {/* Header */}
          <header className="h-14 border-b flex items-center justify-between px-4">

            {/* Search */}
            <div className="w-1/3 relative">

              <input
                type="text"
                placeholder="Search accounts and videos"
                className="w-full bg-gray-100 my-2 pl-10 pr-4 py-1 rounded-full"
              />

              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            </div>


            {/* Header Buttons */}
            <div className="w-1/3 flex justify-end items-center space-x-4">

              <Link href="/upload">
                <button className="border px-3 py-1 rounded-md hover:bg-gray-50 flex items-center">
                  <FaCirclePlus className="mr-2" />
                  Upload
                </button>
              </Link>

              <Link href="/login">
                <button className="text-gray-700 font-medium hover:text-black">
                  Log in
                </button>
              </Link>

              <Link href="/signup">
                <button className="bg-red-500 text-white px-6 py-1 rounded-md hover:bg-red-600">
                  Sign up
                </button>
              </Link>

              <Link href="/profile">
                <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-2">
                  <FaUser className="text-xl mr-1" />
                  <span>Profile</span>
                </div>
              </Link>

            </div>

          </header>


          {/* Page Content */}
          <main>
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}



        
