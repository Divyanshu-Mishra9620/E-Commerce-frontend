"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit, Trash, User, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { authedFetch } from "@/utils/authedFetch";
import { Modal } from "@/components/Modals";

const StarRating = ({ rating, setRating, isEditable = false }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      return (
        <button
          key={ratingValue}
          onClick={() => isEditable && setRating(ratingValue)}
          disabled={!isEditable}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              ratingValue <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      );
    })}
  </div>
);

export function ReviewSection({ productId }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { reviews, isLoading, error, mutate } = useReviews(productId);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalState, setModalState] = useState({ type: null, data: null });

  const userReview = useMemo(
    () => reviews.find((rev) => rev.user === user?._id),
    [reviews, user]
  );

  const handleApiAction = async (actionPromise, successMessage) => {
    setIsSubmitting(true);
    try {
      await actionPromise;
      toast.success(successMessage);
      mutate();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = async () => {
    const success = await handleApiAction(
      authedFetch(`/api/reviews/${productId}/reviews`, {
        method: "POST",
        body: { user, rating: newRating, comment: newComment },
      }),
      "Review submitted successfully!"
    );
    if (success) {
      setNewComment("");
      setNewRating(5);
    }
  };

  const submitEdit = async () => {
    const success = await handleApiAction(
      authedFetch(`/api/reviews/${productId}/reviews/${modalState.data._id}`, {
        method: "PUT",
        body: {
          rating: modalState.data.rating,
          comment: modalState.data.comment,
        },
      }),
      "Review updated successfully!"
    );
    if (success) setModalState({ type: null, data: null });
  };

  const deleteReview = async () => {
    const success = await handleApiAction(
      authedFetch(`/api/reviews/${productId}/reviews/${modalState.data._id}`, {
        method: "DELETE",
      }),
      "Review deleted successfully!"
    );
    if (success) setModalState({ type: null, data: null });
  };

  if (isLoading || authLoading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-500">Failed to load reviews.</div>;

  return (
    <section className="w-full mt-12 border-t pt-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">
          Customer Reviews ({reviews.length})
        </h2>

        <AnimatePresence>
          {isAuthenticated && !userReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm mb-8 border"
            >
              <h3 className="text-lg font-semibold mb-4">
                Share Your Experience
              </h3>
              <StarRating
                rating={newRating}
                setRating={setNewRating}
                isEditable={true}
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-3 mt-4 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={submitReview}
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:bg-gray-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {reviews?.map((review) => (
            <motion.div
              key={review._id}
              className="bg-white p-5 rounded-xl shadow-sm border"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">{review.name}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        review.createdAt || review.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700 text-sm mt-3 pl-[52px]">
                {review.comment}
              </p>

              {user?._id === review.user && (
                <div className="flex gap-3 pt-3 mt-3 border-t pl-[52px]">
                  <button
                    onClick={() =>
                      setModalState({ type: "edit", data: review })
                    }
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() =>
                      setModalState({
                        type: "delete",
                        data: review,
                      })
                    }
                    className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800"
                  >
                    <Trash size={14} /> Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <Modal
          isOpen={modalState.type === "edit"}
          onClose={() => setModalState({ type: null, data: null })}
          title="Edit Your Review"
        >
          <div className="space-y-4">
            <StarRating
              rating={modalState.data?.rating}
              setRating={(r) =>
                setModalState((prev) => ({
                  ...prev,
                  data: { ...prev.data, rating: r },
                }))
              }
              isEditable={true}
            />
            <textarea
              value={modalState.data?.comment}
              onChange={(e) =>
                setModalState((prev) => ({
                  ...prev,
                  data: { ...prev.data, comment: e.target.value },
                }))
              }
              rows={4}
              className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalState({ type: null, data: null })}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={modalState.type === "delete"}
          onClose={() => setModalState({ type: null, data: null })}
          title="Confirm Deletion"
        >
          <p className="text-gray-600">
            Are you sure you want to delete your review? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setModalState({ type: null, data: null })}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={deleteReview}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      </div>
    </section>
  );
}
