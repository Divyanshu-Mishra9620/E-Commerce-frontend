"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ShoppingBag, Users, Star, Menu } from "lucide-react";

import { Sidebar } from "@/components/admin/Sidebar";
import useScreenSize from "@/hooks/useScreenSize";

import Dashboard from "@/components/admin/Dashboard";
import Products from "@/components/admin/Products";
import UsersTab from "@/components/admin/Users";
import Sellers from "@/components/admin/Sellers";

const tabConfig = [
  { name: "Dashboard", icon: LayoutDashboard, component: <Dashboard /> },
  { name: "Products", icon: ShoppingBag, component: <Products /> },
  { name: "Users", icon: Users, component: <UsersTab /> },
  { name: "Sellers", icon: Star, component: <Sellers /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useScreenSize();

  const selectTab = (name) => {
    setActiveTab(name);
    if (isMobile) setSidebarOpen(false);
  };

  const activeComponent = tabConfig.find(
    (tab) => tab.name === activeTab
  )?.component;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isMobile ? sidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={selectTab}
        navItems={tabConfig}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-800"
          >
            <Menu />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">{activeTab}</h2>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeComponent}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
