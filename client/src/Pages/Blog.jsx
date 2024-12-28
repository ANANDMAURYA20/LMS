import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { layouts } from 'chart.js';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const URL = BASE_URL+ 'api/v1/blog/all'

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Layout>

    <div className="container mx-auto px-4 py-8">
    <h1 className="md:text-4xl text-2xl w-fit text-blue-600 dark:text-white font-inter font-[500] after:content-[' '] relative after:absolute after:-bottom-3.5 after:left-0 after:h-1.5 after:w-[60%] after:rounded-full after:bg-yellow-400 dark:after:bg-yellow-600 mb-10">
          Blogs By {" "}
          <span className="font-[600] font-lato text-yellow-500">
            Lyceum
          </span>
        </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {blogs.map((blog) => (
          <div 
          key={blog._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
            {blog.thumbnail && blog.thumbnail.secure_url && (
              <img 
                src={blog.thumbnail.secure_url} 
                alt={blog.title} 
                className="w-full h-48 object-cover"
                />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {blog.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <a href={blog.link} target="_blank" rel="noreferrer noopener">
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                  >
                  Read More
                </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
</Layout>
  );
};

export default Blog;