"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";
import { useRouter } from "next/navigation";

const ProductCard = ({
  image,
  product_name,
  discounted_price,
  uniq_id,
  description,
}) => {
  image = image.replace(/\s+/g, "").replace(/[\[\]]/g, "");
  const router = useRouter();

  return (
    <div
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-lg border p-4 shadow-md transition-all duration-300 hover:scale-105",
        "border-gray-300 bg-white hover:shadow-xl",
        "dark:border-gray-700 dark:bg-gray-900 dark:hover:shadow-gray-700"
      )}
      onClick={() => router.push(`/product/${uniq_id}`)}
    >
      <img
        src={
          image ||
          description.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
          "/lamp.jpg"
        }
        alt={product_name || "Product Image"}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {product_name || "Unnamed Product"}
        </h3>
        <p className="text-lg font-bold text-primary">
          ₹{discounted_price || "0.00"}
        </p>
      </div>
    </div>
  );
};

export default function Hero({ products }) {
  const productList = Array.isArray(products) ? products : [];

  const firstRow = productList?.slice(0, 6);
  const secondRow = productList?.slice(7, 15);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden pt-20 bg-gray-800 dark:bg-gray-950">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Featured Products
      </h2>
      <Marquee pauseOnHover className="[--duration:15s]">
        {firstRow?.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:15s]">
        {secondRow?.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </Marquee>
    </div>
  );
}
