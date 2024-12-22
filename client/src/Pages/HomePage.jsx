import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import heroPng from "../assets/images/hero.png";
import hero1Png from "../assets/images/hero1.png";
import logo from "../assets/images/logo1.png";

export default function HomePage() {
  return (
    <Layout>

      <section className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]">
        <div className="md:w-1/2 w-full space-y-7">
          <h1 className="md:text-5xl text-6xl font-semibold text-gray-900 dark:text-gray-200">
            <img src={logo} alt="" className="md:h-[100px] h-[65px] md:px-[35px] px-[15px]"/>
           <span className="text-red-700 font-bold font-open-sans">Lyceum </span> 
            <span className="text-yellow-500 font-bold font-open-sans"> Knowledge Art Entertainment</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300 font-inter">
            We have a large library of courses taught by highly skilled and
            qualified faculties at a very affordable cost.
          </p>

          <div className="space-x-6 flex">
            <Link to="/courses">
              <button className="bg-yellow-500 font-inter font-[400] text-slate-100 dark:text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md  md:text-lg text-base cursor-pointer transition-all ease-in-out duration-300">
                Explore courses
              </button>
            </Link>

            <Link to="/contact">
              <button className="border border-yellow-500 text-gray-700 dark:text-white px-5 py-3 rounded-md font-semibold md:text-lg text-base cursor-pointer  transition-all ease-in-out duration-300">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 w-1/7 flex items-center justify-center">
          <img alt="homepage image" src={heroPng} />
        </div>

      </section>
      <section className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]">
        <div className="md:w-1/3 w-1/8 flex items-center justify-center">
          <img alt="homepage image" src={hero1Png} />
        </div>
        <div className="md:w-1/2 w-full space-y-7">
          <h1 className="md:text-5xl text-6xl font-semibold text-gray-900 dark:text-gray-200">
            <span className="text-red-700 font-bold font-open-sans"> All the skills you need in one place</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300 font-inter">
          From critical skills to technical topics, Lyceum supports your professional development.
          </p>

          <div className="space-x-6 flex">
            <Link to="/about">
              <button className="bg-red-600 font-inter font-[400] text-slate-100 dark:text-gray-950 md:px-5 px-3 md:py-3 py-3 rounded-md  md:text-lg text-base cursor-pointer transition-all ease-in-out duration-300">
                About Us
              </button>
            </Link>
          </div>
        </div>
      </section>
      <div></div>
<h1 className="text-5xl font-bold text-center text-yellow-500 bold">Why Lyceum ?</h1>
      <section className="md:py-10 py-7 mb-10 text-white flex md:flex-row flex-col-reverse items-center justify-center md:gap-10 gap-7 md:px-16 px-6 min-h-[85vh]">

          
  <div className="md:w-1/3 w-full bg-white dark:bg-gray-800 rounded-md shadow-md p-5 flex flex-col items-center justify-center">
    <img src={heroPng} alt="" className="md:h-[100px] h-[65px] md:px-[35px] px-[15px] mb-5"/>
    <h1 className="md:text-2xl text-3xl font-semibold text-yellow-500">
    Learn Anytime, Anywhere
    </h1>
    <p className="text-lg text-gray-500 dark:text-gray-300 font-inter text-center">
    Our courses are designed with your busy lifestyle in mind. With flexible, on-demand access, you can learn at your own pace, from any device. Whether you're at home or on the go, you'll have all the tools you need .
    </p>
  </div>
  <div className="md:w-1/3 w-full bg-white dark:bg-gray-800 rounded-md shadow-md p-5 flex flex-col items-center justify-center">
    <img src={hero1Png} alt="" className="md:h-[100px] h-[65px] md:px-[35px] px-[15px] mb-5"/>
    <h1 className="md:text-2xl text-3xl font-semibold text-yellow-500">
    Expert Guidance, Real Results
    </h1>
    <p className="text-lg text-gray-500 dark:text-gray-300 font-inter text-center">
    Learn from industry leaders who bring years of expertise and practical insights to every lesson. Our courses go beyond theory, equipping you with actionable skills to tackle real-world challenges confidently.
    </p>
  </div>
  <div className="md:w-1/3 w-full bg-white dark:bg-gray-800 rounded-md shadow-md p-5 flex flex-col items-center justify-center">
    <img src={logo} alt="" className="md:h-[100px] h-[65px] md:px-[35px] px-[15px] mb-5"/>
    <h1 className="md:text-2xl text-3xl font-semibold text-yellow-500">
    Your Success, Our Mission
    </h1>
    <p className="text-lg text-gray-500 dark:text-gray-300 font-inter text-center">
    We’re committed to helping you achieve your goals. With a focus on quality, innovation, and support, our platform is built to inspire and empower learners at every stage of their journey. Take the leap today!
    </p>
  </div>
      </section>

    </Layout>
  );
}
