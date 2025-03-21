"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

  return (
    <div className="w-full mt-6">
      <h2 className="text-lg font-semibold mb-3">Customer Reviews</h2>

      {!hasSubmittedReview ? (
        <div className="border p-4 rounded-md shadow-sm">
          <h3 className="text-md font-semibold mb-2">Write a Review</h3>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} Stars
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="border p-2 rounded w-full mb-2"
          ></textarea>
          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">
          You have already submitted a review.
        </p>
      )}

      <div className="mt-4">
        {reviews?.length > 0 ? (
          reviews?.map((review) => (
            <div
              key={review.createdAt}
              className="border p-3 rounded-md my-2 shadow-sm"
            >
              {editingReviewId === review.user ? (
                <div className="mb-4">
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border p-2 rounded w-full mb-2"
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} Stars
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Edit your review..."
                    className="border p-2 rounded w-full mb-2"
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      onClick={submitEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{user?.name || "Anonymous"}</p>
                  <p className="text-yellow-500">
                    {"⭐".repeat(review.rating)}
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                  {user && review.user === user._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEditing(review)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteReview(review.user)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
