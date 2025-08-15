"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, X } from "lucide-react";

const NavItem = ({ name, icon: Icon, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{name}</span>
    </button>
  </li>
);

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  navItems,
  isMobile,
}) {
  return (
    <>
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          closed: { x: "-100%" },
          open: { x: 0 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full bg-white text-gray-800 w-64 z-50 border-r border-gray-200 shadow-lg md:translate-x-0"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">Admin Panel</span>
          </Link>
          {isMobile && (
            <button onClick={onClose} className="p-2">
              <X />
            </button>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.name}
                {...item}
                isActive={activeTab === item.name}
                onClick={() => onSelectTab(item.name)}
              />
            ))}
          </ul>
        </nav>
      </motion.aside>

      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
}
