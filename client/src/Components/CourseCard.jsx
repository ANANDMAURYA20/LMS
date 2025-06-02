import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";

export default function CourseCard({ data }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="h-full flex flex-col cursor-pointer bg-white/5 dark:bg-gray-800/40 rounded-lg overflow-hidden border border-white/10 hover:border-blue-400/30 transition-all duration-300"
      onClick={() => navigate("/courses/description/", { state: { ...data } })}
    >
      {/* Thumbnail Section */}
      <div className="relative w-full h-48 md:h-56 lg:h-48 xl:h-56">
        <img
          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
          src={data?.thumbnail?.secure_url}
          alt="course thumbnail"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute top-2 right-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <FaPlay className="text-white text-xs" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {data?.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {data?.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-300">
            <span className="flex items-center">
              <span className="mr-1">By</span>
              <span className="text-blue-400">{data?.createdBy}</span>
            </span>
            <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-blue-300">
              {data?.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

