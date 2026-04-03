"use client";
import { useState } from "react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header>
      <nav className="bg-gray-900 text-white px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Logo */}
        <div className="text-2xl font-bold text-yellow-400 border-2 border-transparent hover:border-white px-2 py-1 cursor-pointer">
          amazon
        </div>

        {/* Deliver to */}
        <div className="hidden md:flex flex-col text-xs border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <span className="text-gray-400">Deliver to</span>
          <span className="font-bold text-sm">📍 Bhutan</span>
        </div>

        {/* Search bar - highly visible */}
        <div className="flex flex-1 min-w-[250px] h-10 rounded-lg overflow-hidden border-2 border-yellow-400">
          <select className="bg-gray-200 text-gray-800 text-sm px-2 border-r border-gray-400 hidden sm:block">
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Fashion</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍  Search Amazon..."
            className="flex-1 px-4 py-2 text-gray-800 text-sm focus:outline-none bg-white"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 px-5 text-gray-900 font-bold text-lg">
            🔍
          </button>
        </div>

        {/* Account */}
        <div className="hidden md:flex flex-col text-xs border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <span className="text-gray-400">Hello, sign in</span>
          <span className="font-bold text-sm">Account & Lists ▾</span>
        </div>

        {/* Orders */}
        <div className="hidden md:flex flex-col text-xs border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <span className="text-gray-400">Returns</span>
          <span className="font-bold text-sm">& Orders</span>
        </div>

        {/* Cart */}
        <div className="flex items-end gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
          <span className="text-3xl">🛒</span>
          <span className="font-bold text-sm mb-1">Cart</span>
        </div>
      </nav>

      {/* Category strip */}
      <div className="bg-gray-700 text-white text-sm px-4 py-2 flex gap-6 overflow-x-auto whitespace-nowrap">
        {["☰ All", "Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell", "Electronics", "Fashion", "Books"].map((item) => (
          <span key={item} className="cursor-pointer hover:underline border-2 border-transparent hover:border-white rounded px-1 py-0.5">
            {item}
          </span>
        ))}
      </div>
    </header>
  );
}