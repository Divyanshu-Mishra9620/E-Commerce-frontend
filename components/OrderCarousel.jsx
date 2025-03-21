import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Info, Loader2 } from "lucide-react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function OrderCarousel() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const response = await fetch(`${BACKEND_URI}/api/orders/${user._id}`);
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        setErrorOrders("Failed to fetch orders. Please try again.");
        console.error("Error fetching user orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setErrorReviews(null);
      try {
        const res = await fetch(`${BACKEND_URI}/api/products`);
        const products = await res.json();

        const userReviews = [];
        products?.forEach((prod) => {
          const userReview = prod.reviews?.find(
            (review) => review.user === user._id
          );
          if (userReview) {
            userReviews.push({ ...userReview, product: prod });
          }
        });
        console.log(userReviews);

        setReviews(userReviews);
      } catch (error) {
        setErrorReviews("Failed to fetch reviews. Please try again.");
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Orders</h2>
      {loadingOrders ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : errorOrders ? (
        <p className="text-red-500 text-center">{errorOrders}</p>
      ) : orders?.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        <Carousel className="w-full max-w-screen-lg">
          <CarouselContent>
            {orders?.map((order, index) => (
              <CarouselItem key={index} className="w-full flex-shrink-0">
                <div className="p-2 w-full">
                  <Card className="bg-white rounded-lg transition-shadow duration-300 w-full">
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="w-full h-48 relative">
                        <Image
                          src={order?.image || "/default-product.jpg"}
                          alt={order?.product_name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <Link
                          href={`product/${order?.uniq_id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
                        >
                          {order?.product_name}
                        </Link>
                        <div className="mt-2 text-gray-600">
                          <span className="text-xl font-bold text-gray-900">
                            {order?.discounted_price}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>{"⭐".repeat(order.rating)}</span>
                          {order?.rating} ({order?.reviews} reviews)
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 bg-white shadow-md hover:bg-gray-100 transition-all" />
          <CarouselNext className="absolute right-2 bg-white shadow-md hover:bg-gray-100 transition-all" />
        </Carousel>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">
        Your Reviews
      </h2>
      {loadingReviews ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : errorReviews ? (
        <p className="text-red-500 text-center">{errorReviews}</p>
      ) : reviews?.length === 0 ? (
        <p className="text-gray-600 text-center">No reviews found.</p>
      ) : (
        <div className="w-full max-w-screen-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews?.map((review, index) => (
            <Card key={index} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={
                      review.product?.image
                        ?.replace(/\s+/g, "")
                        .replace(/[\[\]]/g, "") || "/lamp.jpg"
                    }
                    alt={review.product?.product_name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">
                      {review.product?.product_name}
                    </h3>
                    <Link href={`/product/${review.product?.uniq_id}`}>
                      <Info className="w-5 h-5 text-gray-500 hover:text-blue-600 cursor-pointer" />
                    </Link>
                  </div>
                  <div className="text-yellow-500 text-sm">
                    <span>{"⭐".repeat(review.rating)}</span> {review.rating}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {review.comment || ""}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
