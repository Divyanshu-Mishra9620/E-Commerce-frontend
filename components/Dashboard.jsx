"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
  const [users, setUsers] = useState(null);
  const [carts, setCarts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedProductId, setCopiedProductId] = useState(null);

  const handleCopyProductId = (productId) => {
    navigator.clipboard.writeText(productId);
    setCopiedProductId(productId);
    setTimeout(() => setCopiedProductId(null), 2000);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, cartsRes, ordersRes] = await Promise.all([
          fetch(`${BACKEND_URI}/api/users`),
          fetch(`${BACKEND_URI}/api/cart`),
          fetch(`${BACKEND_URI}/api/orders`),
        ]);

        const usersData = await usersRes.json();
        const cartsData = await cartsRes.json();
        const ordersData = await ordersRes.json();

        setUsers(usersData.users);
        setCarts(cartsData.carts);
        setOrders(ordersData.orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let ordersToday = 0;
  let revenueToday = 0;

  const todayDate = new Date();
  const currentDate = todayDate.getDate();
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  orders?.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const createdDate = createdAt.getDate();
    const createdMonth = createdAt.getMonth();
    const createdYear = createdAt.getFullYear();

    if (
      createdDate === currentDate &&
      createdYear === currentYear &&
      currentMonth === createdMonth
    ) {
      ordersToday++;
      revenueToday += order.totalPrice;
    }
  });

  let ordersThisMonth = 0;
  let revenueThisMonth = 0;

  orders?.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const createdDate = createdAt.getDate();
    const createdMonth = createdAt.getMonth();
    const createdYear = createdAt.getFullYear();

    if (createdMonth === currentMonth && createdYear === currentYear) {
      ordersThisMonth++;
      revenueThisMonth += order.totalPrice;
    }
  });

  const todayData = Array.from({ length: 24 }, (_, i) => ({
    time: i.toString(),
    sessions: 0,
    orders: 0,
  }));

  const monthlyData = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({
    time: month,
    sessions: 0,
    orders: 0,
  }));

  const now = new Date();
  const todayDate2 = now.getDate();
  const currentMonth2 = now.getMonth();

  users?.forEach((user) => {
    const createdAt = new Date(user.createdAt);
    const createdHour = createdAt.getHours();
    const createdDate = createdAt.getDate();
    const createdMonth = createdAt.getMonth();
    const createdYear = createdAt.getFullYear();
    if (
      createdDate === todayDate2 &&
      createdMonth === currentMonth2 &&
      currentYear === createdYear
    ) {
      todayData[createdHour].sessions++;
    }
    if (createdMonth === currentMonth2 && currentYear === createdYear)
      monthlyData[createdMonth].sessions++;
  });

  orders?.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const createdHour = createdAt.getHours();
    const createdDate = createdAt.getDate();
    const createdMonth = createdAt.getMonth();
    const createdYear = createdAt.getFullYear();

    if (
      createdDate === todayDate2 &&
      createdMonth === currentMonth2 &&
      createdYear === currentYear
    ) {
      todayData[createdHour].orders++;
    }
    if (createdMonth === currentMonth2 && createdYear === currentYear)
      monthlyData[createdMonth].orders++;
  });

  const productCounts = {};
  orders?.forEach((order) => {
    order.products.forEach((prod) => {
      productCounts[prod.product] =
        (productCounts[prod.product] || 0) + prod.quantity;
    });
  });
  const bestSellers = Object.entries(productCounts).sort(
    ([, a], [, b]) => b - a
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-screen bg-gray-50"
    >
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Total Sessions",
            value: users?.length || 0,
            icon: "👥",
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            title: "Active Carts",
            value: carts?.length || 0,
            icon: "🛒",
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            title: "Total Orders",
            value: orders?.length || 0,
            icon: "📦",
            bg: "bg-purple-100",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={fadeIn}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <span
                className={`text-2xl p-3 rounded-lg ${stat.bg} ${stat.color}`}
              >
                {stat.icon}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          {
            title: "Today's Performance",
            data: [
              { label: "Orders", value: ordersToday, color: "bg-blue-100" },
              {
                label: "Revenue",
                value: revenueToday,
                color: "bg-green-100",
                currency: true,
              },
            ],
          },
          {
            title: "Monthly Performance",
            data: [
              { label: "Orders", value: ordersThisMonth, color: "bg-blue-100" },
              {
                label: "Revenue",
                value: revenueThisMonth,
                color: "bg-green-100",
                currency: true,
              },
            ],
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            variants={fadeIn}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              {card.title}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {card.data.map((metric, i) => (
                <div
                  key={metric.label}
                  className={`p-3 sm:p-4 rounded-lg ${metric.color}`}
                >
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    {metric.label}
                  </p>
                  <div className="flex items-center">
                    {metric.currency && (
                      <IndianRupee className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-xl sm:text-2xl font-semibold text-gray-800">
                      {metric.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {[
          {
            title: "Hourly Activity",
            data: todayData,
            className: "h-[300px] sm:h-[400px]",
          },
          {
            title: "Monthly Trends",
            data: monthlyData,
            className: "h-[300px] sm:h-[400px] lg:col-span-2",
          },
        ].map((chart, index) => (
          <motion.div
            key={chart.title}
            variants={fadeIn}
            className={`bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all ${chart.className}`}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              {chart.title}
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  interval={index === 0 ? 0 : "preserveStart"}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    fontSize: 14,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 14, paddingTop: 20 }} />
                <Bar
                  dataKey="sessions"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={600}
                />
                <Bar
                  dataKey="orders"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  animationDuration={600}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeIn}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-xs hover:shadow-sm transition-all row-span-2 flex flex-col"
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            Top Products
          </h3>
          <span className="text-xs sm:text-sm text-gray-500">30 Days</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 sm:space-y-3">
            {bestSellers.map(([product, count], index) => (
              <motion.div
                key={product}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="text-sm sm:text-base font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-sm sm:text-base text-gray-700 truncate max-w-[120px] sm:max-w-[160px]"
                      title={product}
                    >
                      {product}
                    </span>
                    <button
                      onClick={() => handleCopyProductId(product)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      aria-label="Copy product ID"
                    >
                      {copiedProductId === product ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-800 whitespace-nowrap">
                  {count.toLocaleString()} sold
                </span>
              </motion.div>
            ))}

            {bestSellers.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No sales data available
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
