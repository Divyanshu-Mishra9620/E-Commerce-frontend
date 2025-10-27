"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import {
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiAmericanexpress,
} from "react-icons/si";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Package,
  Shield,
  Truck,
  Clock,
} from "lucide-react";

const SocialIcon = ({ href, icon: Icon, brandColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 ${brandColor}`}
  >
    <Icon size={18} />
  </a>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="flex flex-col items-center text-center p-4"
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 shadow-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
    <p className="text-xs text-slate-400">{description}</p>
  </motion.div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
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
      className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-12 border-b border-slate-800">
          <FeatureCard
            icon={Truck}
            title="Free Shipping"
            description="On orders above ₹500"
          />
          <FeatureCard
            icon={Shield}
            title="Secure"
            description="100% secure payments"
          />
          <FeatureCard
            icon={Clock}
            title="Quick Delivery"
            description="Fast & reliable shipping"
          />
          <FeatureCard
            icon={Package}
            title="Easy Returns"
            description="Hassle-free returns"
          />
        </div>

        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                  Elysoria
                </h2>
                <p className="text-xs font-semibold text-slate-400 tracking-widest">
                  PREMIUM E-COMMERCE PLATFORM
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Discover a curated collection of premium products designed to
                enhance your lifestyle. From exclusive deals to trending items,
                find everything you need in one place.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">
                      SUPPORT
                    </p>
                    <a
                      href="tel:+919876543210"
                      className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      +91 987-654-3210
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">
                      EMAIL
                    </p>
                    <a
                      href="mailto:support@elysoria.com"
                      className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      support@elysoria.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Follow Us
                </span>
                <div className="flex gap-2">
                  <SocialIcon
                    href="https://www.instagram.com/elys_oria?igsh=cWZ2d2E4azdtMWVn"
                    icon={FaInstagram}
                    brandColor="hover:from-pink-500 hover:to-rose-500"
                  />
                  <SocialIcon
                    href="https://x.com/Elysoria543215"
                    icon={FaTwitter}
                    brandColor="hover:from-blue-400 hover:to-blue-600"
                  />
                  <SocialIcon
                    href="https://www.linkedin.com/in/divyanshu-mishra-12039b309/"
                    icon={FaLinkedinIn}
                    brandColor="hover:from-blue-600 hover:to-blue-800"
                  />
                  <SocialIcon
                    href="https://www.youtube.com/@ElysoriaYourStore"
                    icon={FaYoutube}
                    brandColor="hover:from-red-500 hover:to-red-700"
                  />
                </div>
              </div>
            </motion.div>

            {footerLinks.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                Newsletter
              </h4>
              <p className="text-slate-400 text-sm mb-4">
                Subscribe to get special offers and updates delivered to your
                inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
                {subscribed && (
                  <p className="text-xs text-green-400 text-center animate-pulse">
                    ✓ Thanks for subscribing!
                  </p>
                )}
              </form>
            </motion.div>
          </div>

          <div className="border-t border-slate-800"></div>

          <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <span className="text-xs font-bold text-slate-400 uppercase">
                Secure Payment
              </span>
              <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
                <SiVisa
                  size={28}
                  className="text-slate-400 hover:text-white transition-colors"
                />
                <SiMastercard
                  size={28}
                  className="text-slate-400 hover:text-white transition-colors"
                />
                <SiAmericanexpress
                  size={28}
                  className="text-slate-400 hover:text-white transition-colors"
                />
                <SiPaypal
                  size={28}
                  className="text-slate-400 hover:text-white transition-colors"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <p className="text-sm text-slate-400">
                © {currentYear}{" "}
                <span className="font-bold text-white">Elysoria</span>. All
                rights reserved.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center md:justify-end text-xs"
            >
              <Link
                href="/privacy-policy"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Terms
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                href="/returns"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                Returns
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="h-20 bg-gradient-to-b from-transparent to-slate-950/50"></div>
    </motion.footer>
  );
}
