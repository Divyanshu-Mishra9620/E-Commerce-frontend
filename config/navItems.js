import {
  House,
  User,
  ShoppingBasket,
  ShoppingCart,
  Heart,
  Settings,
  LayoutGrid,
  Tag,
  IndianRupee,
  UserCog,
} from "lucide-react";

export const adminNavItems = [
  { href: "/admin", icon: UserCog, label: "Admin" },
];

export const mainNavItems = [
  { href: "/", icon: House, label: "Home" },
  { href: "/categories", icon: LayoutGrid, label: "Categories" },
  { href: "/profile/carts", icon: ShoppingCart, label: "Cart", badge: "cart" },
  {
    href: "/profile/wishlist",
    icon: Heart,
    label: "Wishlist",
    badge: "wishlist",
  },
  { href: "/profile", icon: User, label: "Profile" },
];

export const profileNavItems = [
  { href: "/profile/orders", icon: ShoppingBasket, label: "Orders" },
  { href: "/profile/settings", icon: Settings, label: "Settings" },
];

export const extraNavItems = [
  { href: "/coupons", icon: Tag, label: "Coupons" },
  { href: "/sell", icon: IndianRupee, label: "Sell" },
];
