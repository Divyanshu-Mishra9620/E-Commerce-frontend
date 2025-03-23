"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, Trash, Check, X } from "lucide-react";
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;
const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews`
      );
      const data = await response.json();
      setReviews(data.reviews);

      if (user) {
        const userReview = data.reviews.find((rev) => rev.user === user._id);
        if (userReview) {
          setHasSubmittedReview(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const submitReview = async () => {
    setLoading(true);
    if (!user) router.push("/api/auth/signin");

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user,
            rating,
            comment,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add review");
      await response.json();

      setComment("");
      setRating(5);
      setHasSubmittedReview(true);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    setLoading(false);
  };

  const deleteReview = async (reviewId) => {
    if (!user) router.push("/api/auth/signin");

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete review");
      setHasSubmittedReview(false);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review.user);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const submitEdit = async () => {
    if (!user) router.push("/api/auth/signin");

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews/${editingReviewId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: editRating,
            comment: editComment,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update review");
      fetchReviews();
      cancelEditing();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const renderStars = (rating, isEditable = false) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() => isEditable && setEditRating(index + 1)}
            className={`p-1 transition-colors ${
              isEditable ? "hover:text-yellow-400" : ""
            }`}
            disabled={!isEditable}
          >
            <Star
              size={20}
              className={
                index < (isEditable ? editRating : rating)
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-gray-300 stroke-gray-300"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-300 dark:text-gray-100">
        Customer Reviews
      </h2>

      <AnimatePresence>
        {!hasSubmittedReview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Share Your Experience
            </h3>
            <div className="mb-4">{renderStars(rating, true)}</div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your detailed review..."
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 
                         focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 
                         resize-none text-gray-900 dark:text-gray-100 
                         placeholder-gray-500 dark:placeholder-gray-400"
              rows="4"
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitReview}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                         rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 
                         transition-colors"
            >
              {loading ? "Publishing..." : "Publish Review"}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-gray-800 dark:text-gray-100"
          >
            <p className="text-gray-600 dark:text-gray-300">
              You've already shared your review. Thank you!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.createdAt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            >
              {editingReviewId === review.user ? (
                <div className="space-y-4">
                  <div>{renderStars(editRating, true)}</div>

                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg 
                               border border-gray-200 dark:border-gray-600 
                               text-gray-900 dark:text-gray-100 
                               placeholder-gray-500 dark:placeholder-gray-400"
                    rows="3"
                  />

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={submitEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      <Check size={16} /> Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={cancelEditing}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
                    >
                      <X size={16} /> Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        {user?.name || "Anonymous"}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-100">
                    {review.comment}
                  </p>
                  {user && review.user === user._id && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => startEditing(review)}
                        className="p-2 text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteReview(review.user)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash size={18} />
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 text-gray-500 dark:text-gray-400"
          >
            No reviews yet. Be the first to share your experience!
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default ReviewSection;
