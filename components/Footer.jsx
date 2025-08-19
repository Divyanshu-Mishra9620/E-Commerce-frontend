"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
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
import { ArrowRight } from "lucide-react";

const SocialIcon = ({ href, icon: Icon, brandColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-2 rounded-full bg-gray-100 text-gray-500 hover:text-white transition-all duration-300 ${brandColor}`}
  >
    <Icon size={16} />
  </a>
);

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-gray-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Elysoria</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your one-stop destination for curated products that blend quality,
              style, and innovation.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-gray-600 hover:text-gray-900"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/FAQS"
                  className="text-gray-600 hover:text-gray-900"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Stay Connected
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest updates and special offers directly in your inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Elysoria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <SocialIcon
              href="https://www.instagram.com/elys_oria?igsh=cWZ2d2E4azdtMWVn"
              icon={FaInstagram}
              brandColor="hover:bg-[#E4405F]"
            />
            <SocialIcon
              href="https://x.com/Elysoria543215"
              icon={FaTwitter}
              brandColor="hover:bg-[#1DA1F2]"
            />
            <SocialIcon
              href="https://www.linkedin.com/in/divyanshu-mishra-12039b309/"
              icon={FaLinkedinIn}
              brandColor="hover:bg-[#0A66C2]"
            />
            <SocialIcon
              href="https://www.youtube.com/@ElysoriaYourStore"
              icon={FaYoutube}
              brandColor="hover:bg-[#FF0000]"
            />
          </div>
          <div className="flex items-center gap-4">
            <SiVisa size={32} className="text-gray-400" />
            <SiMastercard size={32} className="text-gray-400" />
            <SiAmericanexpress size={32} className="text-gray-400" />
            <SiPaypal size={32} className="text-gray-400" />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
