"use client";
import OrderDetail from "@/components/OrderDetail";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { useParams } from "next/navigation";

const OrderDetailPage = () => {
  const params = useParams();
  const slug = params?.slug;

  const { order, isLoading, error } = useOrderDetail(slug);

  return <OrderDetail order={order} isLoading={isLoading} error={error} />;
};

export default OrderDetailPage;
