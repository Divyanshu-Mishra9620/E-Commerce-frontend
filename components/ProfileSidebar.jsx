"use client";
import React from "react";
import { Home, ShoppingCart, Heart, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfileSidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/api/auth/signin");
  }

  const imageUrl = session.user.image || "";

  return (
    <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-30 mt-16 border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile Picture"
                className="rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              {session.user.name}
            </h3>
            <p className="text-sm text-gray-400">{session.user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <ul className="space-y-2">
          {[
            { href: "/", icon: Home, text: "Home" },
            { href: "/profile/carts", icon: ShoppingCart, text: "Cart" },
            { href: "/profile/orders", icon: ShoppingBag, text: "Orders" },
            { href: "/profile/wishlist", icon: Heart, text: "Wishlist" },
            { href: "/profile/settings", icon: Settings, text: "Settings" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center w-full p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
