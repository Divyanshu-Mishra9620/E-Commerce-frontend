import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const useCancellationReturn = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCancellationDetails = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URI}/api/cancellations/details/${orderId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cancellation details");
      }
      const data = await response.json();
      console.log(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestCancellation = useCallback(
    async (orderId, reason, comments = "") => {
      setLoading(true);
      setError(null);

      try {
        if (!user?._id) {
          throw new Error(
            "User not authenticated. Please log in and try again."
          );
        }

        if (!user?.accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        const response = await fetch(
          `${BACKEND_URI}/api/cancellations/request-cancellation/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({
              orderId,
              reason,
              comments,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to cancel order");
        }

        const data = await response.json();
        toast.success("Order cancellation requested successfully!");
        return data;
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const requestReturn = useCallback(
    async (orderId, reason, comments = "", returnItems = null) => {
      setLoading(true);
      setError(null);
      try {
        if (!user?._id) {
          throw new Error(
            "User not authenticated. Please log in and try again."
          );
        }

        if (!user?.accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        const response = await fetch(
          `${BACKEND_URI}/api/cancellations/request-return/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({
              orderId,
              reason,
              comments,
              returnItems,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to return order");
        }

        const data = await response.json();
        toast.success("Return request submitted successfully!");
        return data;
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const getCancellationHistory = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        if (!user?._id) {
          throw new Error("User not authenticated");
        }

        if (!user?.accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        const params = new URLSearchParams(filters);
        const response = await fetch(
          `${BACKEND_URI}/api/cancellations/history/${user._id}?${params}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cancellation history");
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?._id, user?.accessToken]
  );

  const getRefundStatus = useCallback(
    async (orderId) => {
      setLoading(true);
      setError(null);
      try {
        if (!user?._id) {
          throw new Error("User not authenticated");
        }

        if (!user?.accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        const params = new URLSearchParams({
          userId: user._id,
        });
        const response = await fetch(
          `${BACKEND_URI}/api/cancellations/refund-status/${orderId}?${params}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch refund status");
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?._id, user?.accessToken]
  );

  return {
    loading,
    error,
    getCancellationDetails,
    requestCancellation,
    requestReturn,
    getCancellationHistory,
    getRefundStatus,
  };
};
