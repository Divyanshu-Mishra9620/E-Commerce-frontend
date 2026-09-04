"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  SiAmericanexpress,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";
import {
  Clock,
  Mail,
  Package,
  Phone,
  Send,
  Shield,
  Truck,
} from "lucide-react";

import { RUPEE_SYMBOL } from "@/lib/product-display";

const SocialIcon = ({ href, icon: Icon, brandColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-white ${brandColor}`}
  >
    <Icon size={18} />
  </a>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
  >
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/20">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <h4 className="text-sm font-semibold text-white">{title}</h4>
    <p className="mt-1 text-xs leading-6 text-slate-400">{description}</p>
  </motion.div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email) return;

    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { label: "Categories", href: "/categories" },
        { label: "Best Deals", href: "/" },
        { label: "New Arrivals", href: "/" },
        { label: "Sell on Elysoria", href: "/sell" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/FAQS" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns & Refunds", href: "/returns" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 bg-zinc-950 text-white"
    >
      <div className="storefront-section py-14">
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-12 md:grid-cols-4">
          <FeatureCard
            icon={Truck}
            title="Free Shipping"
            description={`On orders above ${RUPEE_SYMBOL}500`}
          />
          <FeatureCard
            icon={Shield}
            title="Secure"
            description="100% secure payments"
          />
          <FeatureCard
            icon={Clock}
            title="Quick Delivery"
            description="Fast and reliable shipping"
          />
          <FeatureCard
            icon={Package}
            title="Easy Returns"
            description="Hassle-free returns"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="storefront-kicker border-white/10 bg-white/5 text-amber-100">
              Premium Storefront
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white">
              Elysoria
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-8 text-slate-300">
              Discover a curated collection of premium products designed to
              elevate everyday shopping with cleaner browsing, better deals, and
              a more refined storefront experience.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Support
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    +91 987-654-3210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </p>
                  <a
                    href="mailto:support@elysoria.com"
                    className="text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    support@elysoria.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Follow us
              </span>
              <div className="flex gap-2">
                <SocialIcon
                  href="https://www.instagram.com/elys_oria?igsh=cWZ2d2E4azdtMWVn"
                  icon={FaInstagram}
                  brandColor="hover:border-pink-400/40 hover:bg-pink-500/15"
                />
                <SocialIcon
                  href="https://x.com/Elysoria543215"
                  icon={FaTwitter}
                  brandColor="hover:border-stone-300/40 hover:bg-stone-100/10"
                />
                <SocialIcon
                  href="https://www.linkedin.com/in/divyanshu-mishra-12039b309/"
                  icon={FaLinkedinIn}
                  brandColor="hover:border-amber-400/35 hover:bg-amber-500/10"
                />
                <SocialIcon
                  href="https://www.youtube.com/@ElysoriaYourStore"
                  icon={FaYoutube}
                  brandColor="hover:border-red-400/40 hover:bg-red-500/15"
                />
              </div>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Newsletter
            </h4>
            <p className="mt-5 text-sm leading-8 text-slate-400">
              Subscribe for special offers, restock alerts, and curated product
              updates.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-amber-300/35 focus:ring-4 focus:ring-amber-500/10"
                required
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-200"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>

            {subscribed && (
              <p className="mt-3 text-sm text-emerald-300">
                {"\u2713"} Thanks for subscribing!
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Secure Payment
            </span>
            <div className="flex items-center gap-3">
              <SiVisa size={28} />
              <SiMastercard size={28} />
              <SiAmericanexpress size={28} />
              <SiPaypal size={28} />
            </div>
          </div>

          <p>
            {"\u00A9"} {currentYear} <span className="font-semibold text-white">Elysoria</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <span>{"\u2022"}</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <span>{"\u2022"}</span>
            <Link href="/returns" className="transition-colors hover:text-white">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
