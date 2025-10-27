"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield, Eye, Database, Mail, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const sections = [
    {
      title: "1. Introduction",
      content: `Elysoria ("we", "us", "our", or "Company") operates the Elysoria.com website and the Elysoria mobile application (collectively, the "Service"). This Privacy Policy explains our practices for collecting, using, disclosing, and safeguarding your information when you access and use our Service.`,
      icon: Lock,
    },
    {
      title: "2. Information We Collect",
      content: `We collect information in several ways:

• Account Information: When you register, we collect your name, email address, phone number, password, and profile information.

• Transactional Data: Payment information, billing address, shipping address, order history, and product preferences.

• Technical Data: IP address, browser type, operating system, device identifiers, and usage patterns through cookies and similar technologies.

• Communication Data: Messages, emails, and support tickets when you contact our customer service.

• Location Data: Approximate location based on IP address and precise location with your permission.

• Behavioral Data: Pages visited, products viewed, search queries, and time spent on our Service.`,
      icon: Database,
    },
    {
      title: "3. How We Use Your Information",
      content: `We use the information we collect to:

• Process transactions and send related information
• Send transactional and promotional emails
• Improve and personalize your experience
• Detect and prevent fraud and abuse
• Comply with legal obligations
• Conduct market research and analytics
• Send marketing communications (with your consent)
• Respond to customer inquiries and support requests
• Monitor and analyze trends and usage
• Protect our rights and the rights of our users`,
      icon: Eye,
    },
    {
      title: "4. Information Sharing",
      content: `We may share your information with:

• Payment Processors: To process payments securely via Razorpay and other payment gateways
• Shipping Carriers: To deliver your orders
• Service Providers: For website hosting, analytics, customer support, and marketing
• Business Partners: For joint offerings and services
• Legal Authorities: When required by law or to protect our rights
• New Business Owners: In case of merger, acquisition, or asset sale

We do NOT sell your personal information to third parties.`,
      icon: Shield,
    },
    {
      title: "5. Data Security",
      content: `We implement comprehensive security measures to protect your information:

• SSL/TLS encryption for all data in transit
• Secure storage with encryption for sensitive data
• Regular security audits and penetration testing
• Limited access to personal information
• Secure password requirements
• Two-factor authentication options
• Regular staff training on data protection

However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.`,
      icon: Lock,
    },
    {
      title: "6. Cookies and Tracking",
      content: `We use cookies and similar technologies to:

• Remember your preferences and login information
• Understand how you use our Service
• Deliver personalized content and advertisements
• Measure campaign effectiveness
• Detect and prevent fraud

You can control cookies through your browser settings, but disabling them may affect Service functionality.`,
      icon: Database,
    },
    {
      title: "7. Your Rights",
      content: `Depending on your location, you may have the following rights:

• Right to Access: Request a copy of your personal information
• Right to Rectification: Correct inaccurate information
• Right to Erasure: Request deletion of your data
• Right to Restrict Processing: Limit how we use your information
• Right to Data Portability: Receive your data in a portable format
• Right to Opt-Out: Unsubscribe from marketing communications
• Right to Object: Object to certain processing activities

To exercise these rights, contact us at privacy@elysoria.com with proof of identity.`,
      icon: Shield,
    },
    {
      title: "8. Children's Privacy",
      content: `Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information promptly. If you believe we have collected information from a child under 13, please contact us immediately.`,
      icon: CheckCircle2,
    },
  ];

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              We are committed to protecting your privacy. This policy explains
              how we collect, use, and protect your personal information.
            </p>
          </motion.div>

          <motion.div
            className="space-y-8 mb-20"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        {section.title}
                      </h2>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="space-y-8 mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Third-Party Links
              </h2>
              <p className="text-slate-700">
                Our Service may contain links to third-party websites. We are
                not responsible for the privacy practices of these websites. We
                encourage you to review their privacy policies before providing
                any personal information.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-slate-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last Updated" date. Your continued use of the
                Service constitutes your acceptance of the updated Privacy
                Policy.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    11. Contact Us
                  </h2>
                  <p className="text-slate-700 mb-4">
                    If you have any questions about this Privacy Policy or our
                    privacy practices, please contact us at:
                  </p>
                  <div className="space-y-2 text-slate-700">
                    <p>
                      <strong>Email:</strong> privacy@elysoria.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +91 730 XXX XXXX
                    </p>
                    <p>
                      <strong>Address:</strong> Vibhuti Khand, Gomti Nagar,
                      Lucknow, Uttar Pradesh 226010, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-20"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Your Trust Matters
                </h3>
                <p className="text-slate-700">
                  We are committed to being transparent about how we use your
                  data. Your privacy and security are our top priorities. If you
                  have concerns about our privacy practices or believe your data
                  has been mishandled, please report it to privacy@elysoria.com
                  immediately.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
