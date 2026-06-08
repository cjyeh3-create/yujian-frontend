"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function Header({ searchQuery = "", setSearchQuery }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-950/85 backdrop-blur-md border-b border-gray-800/80 shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <svg
              className="w-5.5 h-5.5 text-white transition-transform duration-500 group-hover:rotate-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 21L14.907 18M18 10.5c0 3.29-2.29 6-5.5 6s-5.5-2.71-5.5-6s2.29-6 5.5-6s5.5 2.71 5.5 6z"
              />
            </svg>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-wide text-white leading-none">
              漁見 <span className="text-cyan-400">App Hub</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-0.5">Yujian Software</span>
          </div>
        </a>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center relative max-w-xs w-full mx-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜尋智慧漁業 App..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/60 border border-gray-850 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:bg-gray-900 transition-all duration-300"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {[
            { label: "智慧應用", href: "#apps-store" },
            { label: "解決方案", href: "#solutions" },
            { label: "開發者中心", href: "#developer" },
            { label: "技術文件", href: "#docs" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold text-gray-300 hover:text-cyan-400 transition-colors duration-250 relative group"
            >
              {item.label}
              <span className="absolute bottom-[-6px] left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart */}
          <button className="relative p-2.5 text-gray-300 hover:text-cyan-400 transition-colors duration-200 group bg-gray-900/40 rounded-xl border border-gray-800/40">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-extrabold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transform translate-x-1/3 -translate-y-1/3 shadow-sm shadow-pink-500/20 group-hover:scale-110 transition-transform duration-200">
              0
            </span>
          </button>

          {/* User Profile / Portal */}
          <button className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 border border-cyan-500/20 text-cyan-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-350 active:scale-98">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span>登入主機板</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 bg-gray-900/40 rounded-xl border border-gray-800/40"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-950 border-t border-gray-900 shadow-2xl py-4 animate-fadeIn">
          {/* Mobile Search Input */}
          <div className="px-6 mb-4 md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜尋智慧漁業 App..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <nav className="flex flex-col px-6 gap-3.5">
            {[
              { label: "智慧應用 Store", href: "#apps-store" },
              { label: "解決方案 Solutions", href: "#solutions" },
              { label: "開發者中心 Portal", href: "#developer" },
              { label: "技術文件 Docs", href: "#docs" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors duration-200 py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-gray-900 pt-3.5 mt-1 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white py-2 rounded-xl text-xs font-semibold tracking-wide transition-all">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                登入開發者主機板
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
