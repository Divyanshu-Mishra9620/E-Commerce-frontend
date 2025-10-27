import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

const CancellationActionButtons = ({ order }) => {
  const router = useRouter();

  const canCancel = ["Processing", "Shipped"].includes(order.status);

  const canReturn = order.status === "Delivered";

  const createdDate = new Date(order.orderedAt);
  const currentDate = new Date();
  const daysOld = Math.floor(
    (currentDate - createdDate) / (1000 * 60 * 60 * 24)
  );
  const withincancellationWindow = daysOld <= 7;

  const deliveryDate = new Date(order.deliveredAt || order.orderedAt);
  const daysSinceDelivery = Math.floor(
    (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
  );
  const withinReturnWindow = daysSinceDelivery <= 14;

  const handleCancelClick = () => {
    router.push(`/cancel-order/${order._id}`);
  };

  const handleReturnClick = () => {
    router.push(`/return-order/${order._id}`);
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {canCancel && withincancellationWindow && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCancelClick}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel Order
        </motion.button>
      )}

      {canReturn && withinReturnWindow && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReturnClick}
          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          Return Order
        </motion.button>
      )}

      {canCancel && !withincancellationWindow && (
        <div className="w-full bg-orange-50 text-orange-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          Cancellation window expired
        </div>
      )}

      {canReturn && !withinReturnWindow && (
        <div className="w-full bg-orange-50 text-orange-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          Return window expired
        </div>
      )}

      {!canCancel &&
        !canReturn &&
        order.status !== "Cancelled" &&
        order.status !== "Returned" && (
          <div className="w-full bg-slate-50 text-slate-600 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            No actions available for this order
          </div>
        )}
    </div>
  );
};

export default CancellationActionButtons;
