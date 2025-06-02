import { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../Helpers/axiosInstance";
import { isEmail } from "../Helpers/regexMatcher";
import Layout from "../Layout/Layout";
import { motion, useScroll, useTransform } from "framer-motion";
import { BsEnvelopeFill } from "react-icons/bs";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message || !userInput.number) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!isEmail(userInput.email)) {
      toast.error("Invalid email");
      return;
    }

    setIsLoading(true);
    const loadingMessage = toast.loading("sending message...");
    try {
      const res = await axiosInstance.post("/api/v1/contact", userInput);
      toast.success(res?.data?.message, { id: loadingMessage });
      setUserInput({
        name: "",
        email: "",
        number: "",
        message: "",
      });
    } catch (error) {
      toast.error("message sending failed! try again", { id: loadingMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-500/20 dark:bg-blue-400/20 backdrop-blur-sm mb-6 border border-white/30"
              >
                <BsEnvelopeFill className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            </div>

            <form onSubmit={onFormSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={userInput.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={userInput.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Phone Number Input */}
                <div className="relative">
                  <input
                    type="text"
                    name="number"
                    value={userInput.number}
                    onChange={handleInputChange}
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Message Input */}
                <div className="relative">
                  <textarea
                    name="message"
                    value={userInput.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}