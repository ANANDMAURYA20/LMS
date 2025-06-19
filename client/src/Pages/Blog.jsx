import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { axiosInstance } from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { FaGraduationCap } from 'react-icons/fa';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch single blog
          const response = await axiosInstance.get(`/api/v1/blog/${id}`);
          if (response.data.success) {
            setCurrentBlog(response.data.blog);
          } else {
            throw new Error(response.data.message || 'Failed to fetch blog');
          }
        } else {
          // Fetch all blogs
          const response = await axiosInstance.get('/api/v1/blog/all');
          if (response.data.success) {
            setBlogs(response.data.blogs);
          } else {
            throw new Error(response.data.message || 'Failed to fetch blogs');
          }
        }
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch blog data';
        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        // Redirect to blogs list after error
        if (id) {
          setTimeout(() => {
            navigate('/blog');
          }, 2000);
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <Layout>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"
          />
        </div>
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="text-white text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300"
          >
            Back to Blogs
          </button>
        </div>
      ) : id && currentBlog ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => navigate('/blog')}
                className="mb-6 text-orange-400 hover:text-orange-500 flex items-center gap-2"
              >
                ← Back to Blogs
              </button>
              
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg border border-gray-700">
                {currentBlog.thumbnail && currentBlog.thumbnail.secure_url && (
                  <img
                    src={currentBlog.thumbnail.secure_url}
                    alt={currentBlog.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {currentBlog.title}
                  </h1>
                  <p className="text-gray-300 text-lg mb-6">
                    {currentBlog.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400">
                      Created: {new Date(currentBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="md:text-4xl text-2xl text-white font-inter font-[500] relative inline-block">
                Blogs By{" "}
                <span className="font-[600] font-lato text-orange-500">
                  Instructor
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-orange-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </h1>
            </motion.div>

            <motion.div 
              style={{ y: y1, opacity: opacity1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group cursor-pointer border border-gray-700"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="relative">
                    {blog.thumbnail && blog.thumbnail.secure_url && (
                      <img
                        src={blog.thumbnail.secure_url}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Blog Post
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <FaGraduationCap className="text-orange-500 text-xl mr-2" />
                      <h2 className="text-xl font-semibold text-white">
                        {blog.title}
                      </h2>
                    </div>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {(!blogs || blogs.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 max-w-2xl mx-auto"
              >
                <p className="text-gray-300 text-lg md:text-xl mb-4">
                  No blogs available at the moment.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Blog;