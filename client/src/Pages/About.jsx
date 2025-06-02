import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import aboutMainImage from "../assets/images/about.png";
import CarouselSlide from "../Components/CarouselSlide";
import { celebrities } from "../Constants/CelebrityData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 
import Layout from "../Layout/Layout";

function AboutUs() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoading: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true
  };
      
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12 lg:px-20"
        >
          {/* Hero Section */}
          <motion.div 
            style={{ y: y1, opacity: opacity1 }}
            className="flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 mb-20"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 w-full space-y-7"
            >
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl font-semibold font-inter"
              >
                <span className="text-yellow-500">Affordable and</span>{" "}
                <span className="text-white font-nunito-sans">quality education</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-gray-300 font-nunito-sans backdrop-blur-lg bg-white/5 dark:bg-gray-800/30 rounded-xl p-6 border border-white/10"
              >
                Our goal is to provide affordable and quality education to the
                world. We are providing the platform for aspiring teachers and
                students to share their skills, creativity and knowledge with each
                other to empower and contribute to the growth and wellness of
                mankind.
              </motion.p>
            </motion.div>

            <motion.div 
              style={{ scale }}
              className="md:w-1/2 w-full flex items-center justify-center"
            >
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                src={aboutMainImage}
                alt="about main image"
                className="drop-shadow-2xl rounded-2xl backdrop-blur-lg"
                style={{
                  filter: "drop-shadow(0px 15px 10px rgb(0,0,0))",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Carousel Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full mt-20"
          >
            <motion.div 
              className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl font-semibold text-white text-center mb-8"
              >
                What People Say About Us
              </motion.h2>
              
              <div className="w-full md:h-[350px] h-[550px]">
                <Slider {...settings} className="h-full">
                  {celebrities.map((details, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CarouselSlide details={details} />
                    </motion.div>
                  ))}
                </Slider>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </Layout>
  );
}

export default AboutUs;