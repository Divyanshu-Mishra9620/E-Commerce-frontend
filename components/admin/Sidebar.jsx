"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, X } from "lucide-react";

const NavItem = ({ name, icon: Icon, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left text-sm font-medium ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
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
        className="fixed top-0 left-0 h-screen bg-white text-slate-900 w-64 z-50 border-r border-slate-200 md:translate-x-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Admin</span>
          </Link>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
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
