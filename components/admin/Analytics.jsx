"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, IndianRupee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function Analytics() {
  const [data, setData] = useState({
    dailyRevenue: [],
    categoryData: [],
    topProducts: [],
    topCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");

  const { user } = useAuth();

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${BACKEND_URI}/api/orders`, {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }),
        fetch(`${BACKEND_URI}/api/products`, {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      const orders = ordersData.orders || [];
      const products = productsData.products || [];

      const revenueByDay = {};
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        revenueByDay[date] = (revenueByDay[date] || 0) + order.totalPrice;
      });

      const dailyRevenue = Object.entries(revenueByDay)
        .map(([date, revenue]) => ({ date, revenue }))
        .slice(-30);

      const categoryCount = {};
      products.forEach((product) => {
        const category =
          product.category || product.productCategory || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const categoryData = Object.entries(categoryCount)
        .filter(([name]) => name && name !== "undefined")
        .map(([name, value]) => ({ name, value }));

      const productSales = {};
      orders.forEach((order) => {
        order.products?.forEach((item) => {
          const productId = item.product?._id || item.product;

          if (!productSales[productId]) {
            productSales[productId] = {
              id: productId,
              sales: 0,
            };
          }
          productSales[productId].sales += item.quantity || 0;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setData({
        dailyRevenue,
        categoryData,
        topProducts,
        topCategories: categoryData.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-4">
          <div className="h-10 w-72 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-56 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-slate-200"
            >
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-4"></div>
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-slate-200"
            >
              <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-4"></div>
              <div className="h-80 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="h-12 bg-slate-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: data.dailyRevenue.reduce((sum, d) => sum + d.revenue, 0),
      icon: IndianRupee,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Top Products",
      value: data.topProducts.length,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Categories",
      value: data.categoryData.length,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics & Insights
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor your store performance
            </p>
          </div>
          <div className="flex gap-2">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  dateRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-slate-900 flex items-center gap-1">
                  {card.icon && <card.icon className="w-6 h-6" />}
                  {typeof card.value === "number"
                    ? card.value.toLocaleString("en-IN")
                    : card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Category Distribution
          </h3>
          {data.categoryData && data.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500">
              No category data available
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Top Performing Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Product ID
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">
                    Units Sold
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts && data.topProducts.length > 0 ? (
                  data.topProducts.map((product, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs break-all">
                        {String(product.id)}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-slate-900">
                        {product.sales} units
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-8 px-4 text-center text-slate-500"
                    >
                      No product data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
