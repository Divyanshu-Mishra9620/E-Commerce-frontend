import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product, showBadge = false, badgeText = "" }) => {
  return (
    <Link
      href={`product/${product.uniq_id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={
            product.image.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
            product.description.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
            "./lamp.jpg"
          }
          alt={product.product_name || "Product"}
          width={300}
          height={200}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showBadge && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {badgeText}
          </span>
        )}
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md">
          <FaHeart className="w-6 h-6 text-pink-500" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate">
          {product.product_name}
        </h4>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ₹{isNaN(+product.discounted_price) ? 800 : product.discounted_price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
            ₹
            {isNaN(+product.discounted_price)
              ? 1000
              : +product.discounted_price + 200}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating?.reviews || 0)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          ={" "}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {product.rating?.reviews || 0} reviews
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
