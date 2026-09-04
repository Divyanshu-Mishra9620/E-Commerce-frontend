"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, MessageSquare, Star, Trash, User } from "lucide-react";
import { toast } from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { authedFetch } from "@/utils/authedFetch";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modals";
import Spinner from "@/components/Spinner";

const StarRating = ({
  rating,
  setRating,
  isEditable = false,
  size = "h-5 w-5",
}) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, index) => {
      const ratingValue = index + 1;

      return (
        <button
          key={ratingValue}
          type="button"
          onClick={() => isEditable && setRating?.(ratingValue)}
          disabled={!isEditable}
          className={isEditable ? "transition-transform hover:scale-105" : ""}
        >
          <Star
            className={cn(
              size,
              "transition-colors",
              ratingValue <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            )}
          />
        </button>
      );
    })}
  </div>
);

export function ReviewSection({ productId, className = "" }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { reviews, avgRating, isLoading, error, mutate } = useReviews(productId);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const userReview = useMemo(
    () => reviews.find((review) => review.user === user?._id),
    [reviews, user]
  );

  const handleApiAction = async (actionPromise, successMessage) => {
    setIsSubmitting(true);

    try {
      await actionPromise;
      toast.success(successMessage);
      mutate();
      return true;
    } catch (requestError) {
      toast.error(requestError.message);
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

    if (success) {
      setModalState({ type: null, data: null });
    }
  };

  const deleteReview = async () => {
    const success = await handleApiAction(
      authedFetch(`/api/reviews/${productId}/reviews/${modalState.data._id}`, {
        method: "DELETE",
      }),
      "Review deleted successfully!"
    );

    if (success) {
      setModalState({ type: null, data: null });
    }
  };

  if (isLoading || authLoading) {
    return (
      <section className={cn("mt-16", className)}>
        <div className="storefront-panel flex min-h-72 items-center justify-center px-6 py-10">
          <div className="text-center">
            <Spinner size="lg" className="text-blue-600" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading reviews...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn("mt-16", className)}>
        <div className="storefront-empty px-6 py-12 text-center text-rose-500">
          Failed to load reviews.
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mt-16", className)}>
      <div className="storefront-panel px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="storefront-kicker">
              <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
              Customer Feedback
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-950">
              Reviews ({reviews.length})
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Honest impressions from shoppers who have already tried this
              product.
            </p>
          </div>

          <div className="storefront-panel-soft min-w-[220px] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Average Rating
            </p>
            <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-950">
              {reviews.length > 0 ? avgRating.toFixed(1) : "0.0"}
            </p>
            <div className="mt-3">
              <StarRating rating={Math.round(avgRating)} size="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isAuthenticated && !userReview && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="storefront-panel-soft mb-8 p-6"
            >
              <h3 className="text-xl font-semibold text-slate-950">
                Share your experience
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                A quick review helps other shoppers make a better decision.
              </p>

              <div className="mt-5">
                <StarRating
                  rating={newRating}
                  setRating={setNewRating}
                  isEditable={true}
                  size="h-6 w-6"
                />
              </div>

              <textarea
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Share your thoughts..."
                className="mt-5 min-h-32 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-50"
                rows={4}
              />

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews.length === 0 ? (
          <div className="storefront-empty px-6 py-12 text-center text-slate-500">
            No reviews yet. Be the first to share your thoughts.
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <motion.article
                key={review._id}
                className="storefront-panel-soft p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <User size={18} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {review.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          review.createdAt || review.updatedAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                      <div className="mt-3">
                        <StarRating rating={review.rating} size="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {user?._id === review.user && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setModalState({ type: "edit", data: review })
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setModalState({ type: "delete", data: review })
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                      >
                        <Trash size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {review.comment}
                </p>
              </motion.article>
            ))}
          </div>
        )}

        <Modal
          isOpen={modalState.type === "edit"}
          onClose={() => setModalState({ type: null, data: null })}
          title="Edit Your Review"
        >
          <div className="space-y-4">
            <StarRating
              rating={modalState.data?.rating || 0}
              setRating={(value) =>
                setModalState((previous) => ({
                  ...previous,
                  data: { ...previous.data, rating: value },
                }))
              }
              isEditable={true}
              size="h-6 w-6"
            />

            <textarea
              value={modalState.data?.comment || ""}
              onChange={(event) =>
                setModalState((previous) => ({
                  ...previous,
                  data: { ...previous.data, comment: event.target.value },
                }))
              }
              rows={4}
              className="min-h-32 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-200 focus:ring-4 focus:ring-blue-50"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalState({ type: null, data: null })}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitEdit}
                disabled={isSubmitting}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-slate-300"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={modalState.type === "delete"}
          onClose={() => setModalState({ type: null, data: null })}
          title="Confirm Deletion"
        >
          <p className="text-sm leading-7 text-slate-600">
            Are you sure you want to delete your review? This action cannot be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalState({ type: null, data: null })}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={deleteReview}
              disabled={isSubmitting}
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:bg-slate-300"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      </div>
    </section>
  );
}
