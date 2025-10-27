"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Shield,
  Gavel,
  Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsPage = () => {
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
      title: "1. Agreement to Terms",
      content: `By accessing and using Elysoria.com and the Elysoria mobile application (collectively, the "Service"), 
you agree to be bound by these Terms and Conditions. If you do not agree to abide by the above, 
please do not use this service.`,
      icon: FileText,
    },
    {
      title: "2. Use License",
      content: `Permission is granted to temporarily download one copy of the materials (information or software) 
on Elysoria's website for personal, non-commercial transitory viewing only. This is the grant of a license, 
not a transfer of title, and under this license you may not:

• Modifying or copying the materials
• Using the materials for any commercial purpose or for any public display
• Attempting to decompile or reverse engineer any software contained on the site
• Removing any copyright or other proprietary notations from the materials
• Transferring the materials to another person or "mirroring" the materials on any other server
• Using the materials or any content accessible through the Service for any illegal purpose
• Harassing, threatening, intimidating, or bullying any user
• Spamming or engaging in any form of unsolicited commercial communications
• Attempting to gain unauthorized access to any portion or feature of the site`,
      icon: AlertCircle,
    },
    {
      title: "3. Disclaimer",
      content: `The materials on Elysoria's website are provided on an 'as is' basis. Elysoria makes no warranties, 
expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
of intellectual property or other violation of rights.

Further, Elysoria does not warrant or make any representations concerning the accuracy, likely results, 
or reliability of the use of the materials on its website or otherwise relating to such materials or on any 
sites linked to this site.`,
      icon: Shield,
    },
    {
      title: "4. Limitations",
      content: `In no event shall Elysoria or its suppliers be liable for any damages (including, without limitation, 
damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
the materials on Elysoria's website, even if Elysoria or an authorized representative has been notified orally 
or in writing of the possibility of such damage.

Our total liability shall not exceed the amount paid by you for products or services through our Service in the 
12 months preceding the claim.`,
      icon: Gavel,
    },
    {
      title: "5. Accuracy of Materials",
      content: `The materials appearing on Elysoria's website could include technical, typographical, or photographic errors. 
Elysoria does not warrant that any of the materials on the website are accurate, complete, or current. 
Elysoria may make changes to the materials contained on its website at any time without notice.`,
      icon: CheckCircle2,
    },
    {
      title: "6. Links",
      content: `Elysoria has not reviewed all of the sites linked to its website and is not responsible for the contents 
of any such linked site. The inclusion of any link does not imply endorsement by Elysoria of the site. 
Use of any such linked website is at the user's own risk.

If you believe that any linked material is inappropriate or violates these terms, please contact us immediately.`,
      icon: FileText,
    },
    {
      title: "7. Modifications",
      content: `Elysoria may revise these terms and conditions for its website at any time without notice. 
By using this website, you are agreeing to be bound by the then current version of these terms and conditions.`,
      icon: AlertCircle,
    },
    {
      title: "8. Governing Law",
      content: `These terms and conditions are governed by and construed in accordance with the laws of India, 
and you irrevocably submit to the exclusive jurisdiction of the courts located in Lucknow, Uttar Pradesh.`,
      icon: Gavel,
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Terms & Conditions
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
              Please read these terms and conditions carefully before using our
              Service. By using Elysoria, you agree to these terms.
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
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-indigo-600" />
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
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    9. User Accounts
                  </h2>
                  <p className="text-slate-700 mb-4">
                    When you create an account with us, you must provide
                    accurate, complete, and current information. You are
                    responsible for safeguarding the password and you are
                    responsible for all activities that occur under your
                    account.
                  </p>
                  <p className="text-slate-700">
                    You agree to immediately notify Elysoria of any unauthorized
                    use of your account. Elysoria will not be liable for any
                    loss or damage arising from your failure to comply with this
                    security obligation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    10. Payment Terms
                  </h2>
                  <p className="text-slate-700 mb-4">
                    All prices are subject to change without notice. Elysoria
                    reserves the right to refuse any order. Prices shown in your
                    currency are converted at current exchange rates and may
                    vary.
                  </p>
                  <p className="text-slate-700">
                    By submitting an order, you warrant that you are authorized
                    to use the payment method provided and authorize Elysoria to
                    charge such payment method for the order total.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    11. Intellectual Property Rights
                  </h2>
                  <p className="text-slate-700 mb-4">
                    All content included on the website, such as text, graphics,
                    logos, images, and software, is the property of Elysoria or
                    its content suppliers and is protected by international
                    copyright laws.
                  </p>
                  <p className="text-slate-700">
                    You may not reproduce, redistribute, transmit, display, or
                    otherwise exploit any content on the website without prior
                    written permission from Elysoria.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    12. Limitation of Liability
                  </h2>
                  <p className="text-slate-700 mb-4">
                    To the fullest extent permissible under applicable law, in
                    no event shall Elysoria, its officers, directors, employees,
                    or agents be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including lost profits,
                    lost revenue, lost data, or other damages.
                  </p>
                  <p className="text-slate-700">
                    This limitation applies regardless of the form of action and
                    whether or not Elysoria has been advised of the possibility
                    of such damages.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start gap-4">
                <Gavel className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    13. Severability
                  </h2>
                  <p className="text-slate-700">
                    If any provision of these Terms and Conditions is found to
                    be invalid or unenforceable, that provision will be severed,
                    and the remaining provisions will remain in full force and
                    effect.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200 p-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    14. Contact Information
                  </h2>
                  <p className="text-slate-700 mb-4">
                    If you have any questions about these Terms and Conditions,
                    please contact us at:
                  </p>
                  <div className="space-y-2 text-slate-700">
                    <p>
                      <strong>Email:</strong> legal@elysoria.com
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
              <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Your Acceptance
                </h3>
                <p className="text-slate-700">
                  By using Elysoria and its services, you acknowledge that you
                  have read these Terms and Conditions and agree to be bound by
                  them. If you do not agree with any part of these terms, please
                  do not use our Service.
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

export default TermsPage;
