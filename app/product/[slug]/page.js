"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import "@/app/_styles/global.css";
import BottomNavigation from "@/components/BottomNavigation";
import Link from "next/link";
import { Heart, Menu, MoveLeft, Search, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import ReviewSection from "@/components/ReviewSection";
import ProductContext from "@/context/ProductContext";
import Image from "next/image";

const categories = [
  { title: "Electronics", href: "/categories/electronics" },
  { title: "Fashion", href: "/categories/fashion" },
  { title: "Home & Living", href: "/categories/home-living" },
  { title: "Beauty & Health", href: "/categories/beauty-health" },
  { title: "Sports & Outdoors", href: "/categories/sports-outdoors" },
];

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ballPosition, setBallPosition] = useState(0);
  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [qty, setQty] = useState(0);
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [product, setProduct] = useState(null);
  const { products, isLoading } = useContext(ProductContext);

  const query = searchParams.get("q");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (window.scrollY > 1) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      if (scrollY + windowHeight < fullHeight - 50) {
        setIsBottomNavVisible(true);
      } else {
        setIsBottomNavVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/api/auth/signin");
    }
  }, [router]);

  useEffect(() => {
    const fetchProductData = async () => {
      const storedProduct = JSON.parse(
        localStorage.getItem("lastVisitedProduct")
      );
      if (storedProduct && storedProduct.uniq_id === slug) {
        setProduct(storedProduct);
        return;
      }

      try {
        const foundProduct = products.find((p) => p.uniq_id === slug);
        if (foundProduct) {
          foundProduct.image = foundProduct.image
            .replace(/\s+/g, "")
            .replace(/[\[\]]/g, "");
          foundProduct.description = foundProduct.description
            .replace(/\s+/g, "")
            .replace(/[\[\]]/g, "");
          if (foundProduct.image.length < 20)
            foundProduct.image = foundProduct.description;

          setProduct(foundProduct);
          localStorage.setItem(
            "lastVisitedProduct",
            JSON.stringify(foundProduct)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductData();
  }, [slug, products]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("lastVisitedProduct");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user || !product) return;

      try {
        const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const wishlist = await res.json();
        const isProductInWishlist = wishlist.items.some(
          (item) => item.product.toString() === product._id.toString()
        );

        setIsInWishlist(isProductInWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [user, product]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert("Please log in to add items to your wishlist");
      router.push("/api/auth/signin");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URI}/api/wishlist/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsInWishlist(!isInWishlist);
        console.log("Wishlist updated:", data);
      } else {
        const errorData = await res.json();
        console.error("Failed to update wishlist:", errorData);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleCartClick = async (change) => {
    if (!user) {
      alert("Please log in to add items to your cart");
      router.push("/api/auth/signin");
      return;
    }

    const parsedChange = Number(change);
    if (isNaN(parsedChange)) {
      console.error("Invalid change value:", change);
      return;
    }

    const newQuantity = Number(qty) + change;

    try {
      const res = await fetch(`${BACKEND_URI}/api/cart/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: product._id,
          quantity: newQuantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Cart Update Response:", data);

        const updatedCartItem = data.cart.items.find(
          (item) => item.product === product._id
        );
        console.log(updatedCartItem, "updated cart");

        if (updatedCartItem) {
          setQty(updatedCartItem.quantity);
        } else {
          setQty(0);
        }

        console.log("Cart updated successfully");
      } else {
        const errorData = await res.json();
        console.error("Failed to update cart:", errorData);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const formattedDate = useMemo(() => {
    const deliveryDate = new Date();
    deliveryDate.setDate(
      deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3
    );
    return deliveryDate.toDateString();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };
  const handleMouseMove = (e) => {
    if (!containerRef.current || !ballRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const ballWidth = ballRef.current.offsetWidth;
    const maxBallPosition = containerRect.width - ballWidth;

    let newBallPosition = Math.max(
      0,
      Math.min(mouseX - ballWidth / 2, maxBallPosition)
    );
    setBallPosition(newBallPosition);

    const scrollWidth = containerRef.current.scrollWidth - containerRect.width;
    const scrollPercent = newBallPosition / maxBallPosition;
    const newScrollPos = scrollPercent * scrollWidth;

    containerRef.current.scrollTo({
      left: newScrollPos,
      behavior: "smooth",
    });
  };
  const similarProducts =
    products
      ?.filter((prod) => {
        const currentProductKeywords = (prod?.product_name || "")
          .toLowerCase()
          .split(" ");
        const prodKeywords = (prod.product_name || "").toLowerCase().split(" ");

        return currentProductKeywords.some((keyword) =>
          prodKeywords.includes(keyword)
        );
      })
      ?.slice(0, 20) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => router.push("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-md"
            : "bg-transparent bg-white"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex flex-row gap-5 items-center">
            <button onClick={() => router.back()}>
              <MoveLeft />
            </button>

            {isClient && (
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="flex space-x-6">
                  <NavigationMenuItem>
                    <span>Categories</span>
                    <NavigationMenuContent>
                      <ul className="grid w-[250px] gap-3 p-4 bg-white shadow-lg rounded-md">
                        {categories.map((category) => (
                          <ListItem
                            key={category.title}
                            title={category.title}
                            href={category.href}
                          />
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/deals" passHref>
                      <span>Deals</span>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" passHref>
                      <span>Contact Us</span>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {isClient && (
            <div className="flex items-center justify-center">
              <form
                onSubmit={handleSearch}
                className="flex relative w-full max-w-[400px]"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary rounded-l-lg"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="text-gray-400" size={18} />
                </button>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                <User className="w-6 h-6" />
              </Link>
            )}

            <button
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isClient && mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md mt-2 absolute w-full left-0">
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link
                  href="/categories"
                  className="block p-2 hover:bg-gray-100"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="block p-2 hover:bg-gray-100">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block p-2 hover:bg-gray-100">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <div className="container mx-auto p-6 mt-6">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="border rounded-lg p-4">
            <Image
              src={
                product.image.replace(/\s+/g, "").replace(/[\[\]]/g, "") ||
                "/lamp.jpg"
              }
              alt={product.product_name}
              width={400}
              height={400}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-lg text-gray-700 mt-2">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mt-4">
              ₹{product.discounted_price}
            </p>
            <p className="mt-4 text-blue-600 font-medium">
              🚚 Estimated Delivery:{" "}
              <span className="font-semibold">{formattedDate}</span>
            </p>
            <div className="mt-6 flex gap-4">
              {qty === 0 ? (
                <button
                  className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 transition-colors"
                  onClick={() => handleCartClick(1)}
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-gray-800 text-white font-semibold rounded-md">
                  <button
                    className="px-4 py-3 hover:bg-gray-700 rounded-l-md"
                    onClick={() => handleCartClick(-1)}
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-yellow-500">{qty}</span>
                  <button
                    className="px-4 py-3 hover:bg-gray-700 rounded-r-md"
                    onClick={() => handleCartClick(1)}
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={() => toggleWishlist(product._id)}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist
                      ? "text-pink-500 fill-pink-500"
                      : "text-gray-700"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>

          <div
            className="relative w-full p-4 bg-gray-200 rounded-full flex items-center shadow-lg cursor-pointer"
            onMouseMove={handleMouseMove}
          >
            <div
              ref={ballRef}
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-full shadow-lg transform transition-all"
              style={{ left: `${ballPosition}px` }}
            ></div>
          </div>

          <div className="overflow-hidden mt-4">
            <div
              className="flex gap-4 transition-transform duration-300"
              ref={containerRef}
              style={{ overflowX: "auto", whiteSpace: "nowrap" }}
            >
              {similarProducts?.map((product) => (
                <div
                  key={product.uniq_id}
                  className="flex-shrink-0 w-48 border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={
                      product.image
                        .replace(/\s+/g, "")
                        .replace(/[\[\]]/g, "") || "/lamp.jpg"
                    }
                    alt={product.product_name}
                    width={500}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mt-2 line-clamp-1">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-600">₹{product.discounted_price}</p>
                  <button
                    onClick={() => router.push(`/product/${product.uniq_id}`)}
                    className="mt-2 w-full px-4 py-2 bg-none text-gray-600 rounded-md hover:text-gray-900 hover:bg-blue-200 transition-colors"
                  >
                    Take a look
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <ReviewSection productId={product._id} />
        </div>
        <BottomNavigation visible={isBottomNavVisible} />
      </div>
    </>
  );
}

const ListItem = ({ title, href }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md transition"
        >
          {title}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
