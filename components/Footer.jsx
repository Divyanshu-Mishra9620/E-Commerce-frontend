"use client";
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiPaypal, SiApplepay } from "react-icons/si";
import {motion} from "framer-motion"

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-section"
    >
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-gray-400 transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-gray-400 mb-4">
                Get the latest updates on new products and exclusive offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-l-lg focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                >
                  <FaYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8">
            <h4 className="text-lg font-semibold mb-4">We Accept</h4>
            <div className="flex space-x-4">
              <SiVisa className="w-10 h-10 text-gray-400" />
              <SiMastercard className="w-10 h-10 text-gray-400" />
              <SiPaypal className="w-10 h-10 text-gray-400" />
              <SiApplepay className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Your E-Commerce Store. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Footer;
