"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
import { ArrowUp, CheckCircle2, Mail, Phone, Send } from "lucide-react";

import Magnetic from "@/components/fx/Magnetic";

const AUTHOR_URL = "https://www.linkedin.com/in/divyanshu-mishra-12039b309/";

const socialLinks = [
  {
    href: "https://www.instagram.com/elys_oria?igsh=cWZ2d2E4azdtMWVn",
    icon: FaInstagram,
    label: "Instagram",
  },
  { href: "https://x.com/Elysoria543215", icon: FaTwitter, label: "X (Twitter)" },
  { href: AUTHOR_URL, icon: FaLinkedinIn, label: "LinkedIn" },
  {
    href: "https://www.youtube.com/@ElysoriaYourStore",
    icon: FaYoutube,
    label: "YouTube",
  },
];

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Best Deals", href: "/" },
      { label: "Coupons", href: "/coupons" },
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
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Help Centre", href: "/help" },
    ],
  },
];

const underline =
  "relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100";

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

  return (
    <footer className="relative isolate mt-20 overflow-hidden rounded-t-[2.5rem] bg-[#0b0a14] text-[#fff] ring-1 ring-white/5">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 left-1/4 h-[30rem] w-[30rem] rounded-full bg-brand-600/30 blur-[130px]" />
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-coral-500/15 blur-[120px]" />
        <div className="bg-grid absolute inset-0 opacity-[0.15] [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" />
      </div>

      <div className="storefront-section pt-16 md:pt-20">
        {/* Newsletter CTA */}
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff]/70">
              Newsletter
            </span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] md:text-6xl">
              Let&apos;s keep you{" "}
              <span className="bg-gradient-to-r from-brand-300 via-fuchsia-300 to-coral-300 bg-clip-text text-transparent">
                in the loop.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#fff]/60">
              Special offers, restock alerts and curated product updates, straight
              to your inbox.
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur transition-[border-color,box-shadow] duration-300 focus-within:border-brand-400/60 focus-within:shadow-[0_0_0_6px_rgba(118,85,250,0.15)]"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#fff] outline-none placeholder:text-[#fff]/35"
                required
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#fff] px-5 py-3 text-sm font-semibold text-[#0b0a14] transition-colors duration-300 hover:bg-brand-200"
              >
                Subscribe
                <Send className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-3 flex items-center gap-2 pl-4 text-sm text-emerald-300"
                  role="status"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Thanks for subscribing!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Brand + link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <p className="font-display text-3xl font-extrabold tracking-[-0.04em]">
              Elysoria<span className="text-coral-400">.</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#fff]/55">
              A curated collection of products designed to make everyday shopping
              calmer, faster and a little more delightful.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="tel:+919876543210"
                className="flex w-fit items-center gap-3 text-[#fff]/70 transition-colors hover:text-[#fff]"
              >
                <Phone className="h-4 w-4 text-brand-300" />
                <span className={underline}>+91 987-654-3210</span>
              </a>
              <a
                href="mailto:support@elysoria.com"
                className="flex w-fit items-center gap-3 text-[#fff]/70 transition-colors hover:text-[#fff]"
              >
                <Mail className="h-4 w-4 text-brand-300" />
                <span className={underline}>support@elysoria.com</span>
              </a>
            </div>

            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Magnetic key={label} strength={0.4}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#fff]/70 transition-colors duration-300 hover:border-transparent hover:bg-[#fff] hover:text-[#0b0a14]"
                  >
                    <Icon size={16} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff]/40">
                {section.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#fff]/70 transition-colors duration-300 hover:text-[#fff]"
                    >
                      <span className={underline}>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 text-sm text-[#fff]/50 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[#fff]/40">
            <SiVisa size={26} />
            <SiMastercard size={22} />
            <SiAmericanexpress size={20} />
            <SiPaypal size={18} />
          </div>

          <p>
            &copy; {currentYear} <span className="font-semibold text-[#fff]">Elysoria</span>.
            All rights reserved.
          </p>

          <div className="flex items-center justify-between gap-6">
            <p>
              Designed &amp; developed by{" "}
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#fff] transition-colors hover:text-brand-300"
              >
                <span className={underline}>Divyanshu Mishra</span>
              </a>
            </p>

            <Magnetic strength={0.5}>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#fff] transition-colors duration-300 hover:border-transparent hover:bg-brand-gradient"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden pb-24 md:pb-0">
        <p className="translate-y-[22%] bg-gradient-to-b from-white/[0.16] to-white/0 bg-clip-text text-center font-display text-[22vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent xl:text-[17.5rem]">
          Elysoria
        </p>
      </div>
    </footer>
  );
}
