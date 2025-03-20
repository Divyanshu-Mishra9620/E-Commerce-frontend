import Image from "next/image";
import { useEffect, useState } from "react";
import BestDealsGrid from "./BestDealsGrid";

export default function Deals({ products }) {
  const [deals, setDeals] = useState({
    summerDeals: [],
    sportsDeals: [],
    clothesDeals: [],
    smartphoneDeals: [],
    kitchenDeals: [],
  });

  const productList = Array.isArray(products) ? products : [];

  useEffect(() => {
    if (productList) {
      setDeals({
        summerDeals: productList
          .filter((product) =>
            ["summer", "beach", "vacation", "sun", "holiday"].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        sportsDeals: productList
          .filter((product) =>
            [
              "sports",
              "fitness",
              "gym",
              "outdoor",
              "athletic",
              "football",
              "cricket",
              "basketball",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        clothesDeals: productList
          .filter((product) =>
            [
              "clothing",
              "fashion",
              "apparel",
              "shirt",
              "jeans",
              "dress",
              "sneakers",
              "jacket",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        smartphoneDeals: productList
          .filter((product) =>
            [
              "smartphone",
              "mobile",
              "android",
              "iphone",
              "5g",
              "cellphone",
              "apple",
              "samsung",
              "oneplus",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),

        kitchenDeals: productList
          .filter((product) =>
            [
              "kitchen",
              "cooking",
              "appliance",
              "mixer",
              "grinder",
              "blender",
              "microwave",
              "oven",
              "utensil",
              "cookware",
            ].some(
              (keyword) =>
                product.product_name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.category?.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 10),
      });
    }
  }, [products]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-gray-200">
        Welcome to Our <br /> <span className="text-red-500">Deals</span> of the{" "}
        <span className="text-blue-500">Day</span> Section
      </h1>

      <div className="relative w-full h-48 mb-8 overflow-hidden rounded-lg">
        <Image
          src="/summer-banner.jpg"
          alt="Summer Special"
          width={1200}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <h2 className="text-4xl font-bold text-white text-center">
            Summer Special: Up to 50% Off!
          </h2>
        </div>
      </div>

      <BestDealsGrid deals={deals.summerDeals} category="Summer Special" />
      <BestDealsGrid deals={deals.sportsDeals} category="Sports" />
      <BestDealsGrid
        deals={deals.kitchenDeals}
        category="Kitchen Accessories"
      />
      <BestDealsGrid deals={deals.smartphoneDeals} category="Smartphones" />
      <BestDealsGrid deals={deals.clothesDeals} category="Clothes" />
    </div>
  );
}
