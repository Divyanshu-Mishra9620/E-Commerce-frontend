"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, Trash, Check, X, User } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const submitReview = async () => {
    setLoading(true);
    try {
      if (!user?._id) {
        toast.info("Please login to submit a review");
        return router.push("/api/auth/signin");
      }

      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user,
            rating,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add review");
      }

      setComment("");
      setRating(5);
      setHasSubmittedReview(true);
      await fetchReviews();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews`
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      setReviews(data.reviews || []);

      if (user) {
        const userReview = (data.reviews || []).find(
          (rev) => rev.user?.toString() === user._id.toString()
        );
        setHasSubmittedReview(!!userReview);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user) {
      toast.info("Please login to manage reviews");
      return router.push("/api/auth/signin");
    }

    try {
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete review");

      setHasSubmittedReview(false);
      await fetchReviews();
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.message || "Failed to delete review");
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
    if (!user) {
      toast.info("Please login to edit reviews");
      return router.push("/api/auth/signin");
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URI}/api/products/${productId}/reviews/${editingReviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            rating: editRating,
            comment: editComment,
            name: user.name || "Anonymous",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      await fetchReviews();
      cancelEditing();
      toast.success("Review updated successfully");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, isEditable = false, size = "md") => {
    const starSize = size === "sm" ? 16 : 20;
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() =>
              isEditable &&
              (isEditable === "edit"
                ? setEditRating(index + 1)
                : setRating(index + 1))
            }
            className={`p-0.5 transition-all ${
              isEditable ? "hover:scale-110" : ""
            }`}
            disabled={!isEditable}
            aria-label={`${index + 1} star`}
          >
            <Star
              size={starSize}
              className={
                index < (isEditable === "edit" ? editRating : rating)
                  ? "fill-amber-400 stroke-amber-400"
                  : "fill-gray-200 stroke-gray-300 dark:fill-gray-600 dark:stroke-gray-500"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Customer Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({reviews.length} reviews)
            </span>
          )}
        </h2>

        <AnimatePresence>
          {!hasSubmittedReview ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Share Your Experience
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                {renderStars(rating, "rate")}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="review-text"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review-text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your honest thoughts about this product..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 
                            focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 focus:border-transparent
                            resize-none text-gray-900 dark:text-gray-100 text-sm
                            placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitReview}
                  disabled={loading || !comment.trim()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${
                      loading || !comment.trim()
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center"
            >
              <p className="text-amber-800 dark:text-amber-200">
                You've already submitted a review. Thank you for your feedback!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.div
                key={`${review.user}-${review.createdAt}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                {editingReviewId === review.user ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Edit Rating
                      </label>
                      {renderStars(editRating, "edit")}
                    </div>

                    <div>
                      <label
                        htmlFor="edit-review"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Edit Review
                      </label>
                      <textarea
                        id="edit-review"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 
                                  focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 focus:border-transparent
                                  resize-none text-gray-900 dark:text-gray-100 text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelEditing}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={submitEdit}
                        disabled={!editComment.trim()}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
                          ${
                            !editComment.trim()
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <User
                            className="text-gray-500 dark:text-gray-400"
                            size={18}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {review.name || "Anonymous"}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating, false, "sm")}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm pl-[52px]">
                      {review.comment}
                    </p>

                    {user && review.user?.toString() === user._id && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 pl-[52px]">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEditing(review)}
                          className="text-xs px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Edit size={14} /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteReview(review.user)}
                          className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Trash size={14} /> Delete
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
              className="text-center py-10"
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Star className="text-gray-400 dark:text-gray-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                No reviews yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Be the first to share your thoughts about this product
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
