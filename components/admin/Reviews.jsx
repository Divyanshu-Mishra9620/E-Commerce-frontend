"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Trash2, Eye, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/Modals";
import toast from "react-hot-toast";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const StarRating = ({ rating, size = "w-4 h-4" }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
        }`}
      />
    ))}
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user._id]);

  useEffect(() => {
    filterReviews();
  }, [searchTerm, ratingFilter, reviews]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URI}/api/reviews`, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.productId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
    }

    setFilteredReviews(filtered);
  };

  const deleteReview = async (reviewId) => {
    try {
      const res = await fetch(`${BACKEND_URI}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const replyToReview = async () => {
    if (!replyText.trim()) return;

    try {
      setReplying(true);
      const res = await fetch(
        `${BACKEND_URI}/api/reviews/${selectedReview._id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      if (!res.ok) throw new Error("Failed to add reply");

      toast.success("Reply added");
      setReplyText("");
      fetchReviews();
      setSelectedReview(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-slate-200"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-40 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-10 w-10 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900">
          Reviews Management
        </h1>
        <p className="text-slate-600 mt-1">
          Manage and respond to customer reviews
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-600 text-sm font-medium mb-2">
            Total Reviews
          </p>
          <p className="text-3xl font-bold text-slate-900">{reviews.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-600 text-sm font-medium mb-2">
            Average Rating
          </p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-slate-900">{avgRating}</p>
            <StarRating rating={Math.round(avgRating)} size="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-slate-600 text-sm font-medium mb-2">
            Pending Replies
          </p>
          <p className="text-3xl font-bold text-slate-900">
            {reviews.filter((r) => !r.reply).length}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="all">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>
      </motion.div>

      {filteredReviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg border border-slate-200"
        >
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">No reviews found</p>
          <p className="text-slate-500 text-sm mt-1">
            Reviews matching your filters will appear here
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <motion.div
                key={review._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-slate-900">
                            {review?.user?.name || "Anonymous"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 ml-7">
                          {review?.productId || "Product not found"}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="ml-7">
                      <StarRating rating={review.rating} size="w-4 h-4" />
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed ml-7">
                      {review.comment}
                    </p>

                    {review.reply ? (
                      <div className="mt-4 ml-7 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                        <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> Admin Reply
                        </p>
                        <p className="text-sm text-blue-800">{review.reply}</p>
                      </div>
                    ) : (
                      <span className="inline-block ml-7 px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                        Awaiting reply
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        isOpen={!!selectedReview}
        onClose={() => {
          setSelectedReview(null);
          setReplyText("");
        }}
        title={`Reply to ${selectedReview?.user?.name || "Customer"}`}
      >
        {selectedReview && (
          <div className="space-y-5">
            <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-600 uppercase mb-3 tracking-wide">
                Original Review
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-600" />
                  <span className="font-semibold text-slate-900">
                    {selectedReview.user?.name || "Anonymous"}
                  </span>
                </div>
                <div>
                  <StarRating rating={selectedReview.rating} size="w-5 h-5" />
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedReview.comment}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-900 uppercase tracking-wide">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-slate-500">
                {replyText.length}/500 characters
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setReplyText("");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={replyToReview}
                disabled={replying || !replyText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                {replying ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
