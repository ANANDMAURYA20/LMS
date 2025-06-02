import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { axiosInstance } from '../Helpers/axiosInstance';
import toast from 'react-hot-toast';

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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"
          />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-white text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
          >
            Back to Blogs
          </button>
        </div>
      </Layout>
    );
  }

  // Single Blog View
  if (id && currentBlog) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => navigate('/blog')}
                className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                ← Back to Blogs
              </button>
              
              <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Created: {new Date(currentBlog.createdAt).toLocaleDateString()}
                    </span>
                    <motion.a
                      href={currentBlog.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      Read Full Article
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Blog List View
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="md:text-4xl text-2xl text-white font-inter font-[500] relative inline-block">
              Blogs By{" "}
              <span className="font-[600] font-lato text-blue-400">
                Ai-Tutor
              </span>
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-blue-500"
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
                className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 cursor-pointer"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                {blog.thumbnail && blog.thumbnail.secure_url && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    src={blog.thumbnail.secure_url}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-4">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <motion.button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 backdrop-blur-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                    >
                      Read More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;