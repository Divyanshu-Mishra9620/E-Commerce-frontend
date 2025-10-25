"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Star,
  Menu,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";

import { Sidebar } from "@/components/admin/Sidebar";
import useScreenSize from "@/hooks/useScreenSize";

import Dashboard from "@/components/admin/Dashboard";
import Products from "@/components/admin/Products";
import UsersTab from "@/components/admin/Users";
import Sellers from "@/components/admin/Sellers";
import Orders from "@/components/admin/Orders";
import Reviews from "@/components/admin/Reviews";
import Analytics from "@/components/admin/Analytics";
import AdminSettings from "@/components/admin/AdminSettings";

const tabConfig = [
  { name: "Dashboard", icon: LayoutDashboard, component: <Dashboard /> },
  { name: "Orders", icon: Package, component: <Orders /> },
  { name: "Products", icon: ShoppingBag, component: <Products /> },
  { name: "Users", icon: Users, component: <UsersTab /> },
  { name: "Reviews", icon: MessageSquare, component: <Reviews /> },
  { name: "Analytics", icon: BarChart3, component: <Analytics /> },
  { name: "Sellers", icon: Star, component: <Sellers /> },
  { name: "Settings", icon: Settings, component: <AdminSettings /> },
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isOpen={isMobile ? sidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={selectTab}
        navItems={tabConfig}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="md:hidden flex items-center justify-between bg-white shadow-sm border-b border-slate-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-slate-900">{activeTab}</h2>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
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
