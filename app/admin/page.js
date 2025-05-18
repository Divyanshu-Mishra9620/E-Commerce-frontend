"use client";
import Dashboard from "@/components/Dashboard";
import Products from "@/components/Products";
import Users from "@/components/Users";
import Sellers from "@/components/Sellers";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineStar,
  HiMenu,
  HiX,
  HiHome,
} from "react-icons/hi";
import Link from "next/link";

const tabConfig = [
  { name: "Dashboard", icon: HiOutlineViewGrid },
  { name: "Products", icon: HiOutlineShoppingBag },
  { name: "Users", icon: HiOutlineUsers },
  { name: "Sellers", icon: HiOutlineStar },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const selectTab = (name) => {
    setActiveTab(name);
    if (isMobile) setMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-gray-100 w-64 transform transition-transform duration-300 z-50
        ${menuOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <HiHome className="h-6 w-6 text-green-400" />
            <span className="text-lg font-semibold">Admin</span>
          </Link>
          {isMobile && (
            <button onClick={toggleMenu} className="p-2">
              <HiX className="h-6 w-6" />
            </button>
          )}
        </div>
        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="space-y-2">
            {tabConfig.map(({ name, icon: Icon }) => (
              <li key={name}>
                <button
                  onClick={() => selectTab(name)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left
                    ${
                      activeTab === name
                        ? "bg-gray-700 text-green-400 font-medium"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
          <button onClick={toggleMenu} className="p-2 text-gray-800">
            <HiMenu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{activeTab}</h2>
          <div className="w-6" />
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {activeTab === "Dashboard" && <Dashboard />}
              {activeTab === "Products" && <Products />}
              {activeTab === "Users" && <Users />}
              {activeTab === "Sellers" && <Sellers />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
