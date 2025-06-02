import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import heroPng from "../assets/images/hero.png";
import hero1Png from "../assets/images/hero1.png";
import logo from "../assets/images/logo1.png";
import bg from "../assets/images/bg.jpg";
import logo2 from "../assets/images/logo3.png";
import logo3 from "../assets/images/logo2.png";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";

export default function HomePage() {
  const { scrollY } = useScroll();
  const controls = useAnimation();

  // Slower scroll-based animations with smoother transitions
  const y1 = useTransform(scrollY, [0, 500], [0, -50]); // Increased scroll range
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]); // Increased scroll range
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]); // Gentler scale reduction

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        controls.start({ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" } // Slower animation
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.section 
          style={{ y: y1, opacity: opacity1 }}
          transition={{ duration: 0.8 }} // Slower transition
          className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]"
        >
          <div className="md:w-1/2 w-full space-y-7">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }} // Slower animation
              className="md:text-5xl text-5xl font-semibold text-gray-200"
            >
              <span className="text-red-700 font-bold font-open-sans">AI Powered Learning Tutor</span> 
              <span className="text-yellow-500 font-bold font-open-sans"> Learn with fun and ease</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }} // Slower animation
              className="text-xl text-gray-300 font-inter"
            >
              We have a large library of courses taught by highly skilled and
              qualified faculties at a very affordable cost.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }} // Slower animation
              className="space-x-6 flex"
            >
              <Link to="/courses">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4 }} // Slower hover effect
                  className="bg-blue-600 hover:bg-blue-700 font-inter font-[400] text-slate-100 dark:text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md md:text-lg text-base cursor-pointer transition-all duration-300"
                >
                  Explore courses
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4 }} // Slower hover effect
                  className="border border-blue-600 text-gray-200 px-5 py-3 rounded-md font-semibold md:text-lg text-base cursor-pointer transition-all duration-300"
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            style={{ scale }}
            transition={{ duration: 0.8 }} // Slower scale transition
            className="md:w-1/3 w-1/7 flex items-center justify-center"
          >
            <img alt="homepage image" src={logo2} />
          </motion.div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }} // Slower scroll-triggered animation
          className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }} // Slower animation
            className="md:w-1/3 w-1/8 flex items-center justify-center"
          >
            <img alt="homepage image" src={logo3} />
          </motion.div>
          <div className="md:w-1/2 w-full space-y-7">
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:text-5xl text-6xl font-semibold text-gray-200"
            >
              <span className="text-red-700 font-bold font-open-sans"> All the skills you need in one place</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 font-inter"
            >
              From critical skills to technical topics, Ai Powered supports your professional development.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="space-x-6 flex"
            >
              <Link to="/about">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-600 hover:bg-red-700 font-inter font-[400] text-slate-100 dark:text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md md:text-lg text-base cursor-pointer transition-all duration-300"
                >
                  About Us
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }} // Slower animation
          className="text-5xl font-bold text-center text-yellow-500 bold"
        >
          Why Ai Powered Tutor ?
        </motion.h1>

        <motion.section 
          className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]"
        >
          {[
            {
              image: heroPng,
              title: "Learn Anytime, Anywhere",
              description: "Our courses are designed with your busy lifestyle in mind. With flexible, on-demand access, you can learn at your own pace, from any device. Whether you're at home or on the go, you'll have all the tools you need."
            },
            {
              image: hero1Png,
              title: "Expert Guidance, Real Results",
              description: "Learn from industry leaders who bring years of expertise and practical insights to every lesson. Our courses go beyond theory, equipping you with actionable skills to tackle real-world challenges confidently."
            },
            {
              image: logo,
              title: "Your Success, Our Mission",
              description: "We're committed to helping you achieve your goals. With a focus on quality, innovation, and support, our platform is built to inspire and empower learners at every stage of their journey. Take the leap today!"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 1.2, // Slower animation
                delay: index * 0.3 // Increased delay between cards
              }}
              className="md:w-1/3 w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-md shadow-md p-5 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-500" // Slower hover transition
            >
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, // Reduced stiffness for slower spring
                  damping: 20 // Increased damping for smoother movement
                }}
                src={item.image} 
                alt="" 
                className="md:h-[100px] h-[65px] md:px-[35px] px-[15px] mb-5"
              />
              <h1 className="md:text-2xl text-3xl font-semibold text-yellow-500">
                {item.title}
              </h1>
              <p className="text-lg text-gray-300 font-inter text-center">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </Layout>
  );
}
