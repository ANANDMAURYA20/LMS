import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Layout from '../../Layout/Layout';
import { motion } from 'framer-motion';
import { updateCourse, getCourseById } from '../../Redux/Slices/CourseSlice';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null,
    previewImage: ''
  });

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await dispatch(getCourseById(courseId)).unwrap();
        if (response?.success) {
          const course = response.course;
          setCourseData({
            title: course.title,
            description: course.description,
            category: course.category,
            previewImage: course.thumbnail?.secure_url || ''
          });
        }
      } catch (error) {
        toast.error('Failed to fetch course details');
        navigate('/instructor/courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, dispatch, navigate]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        thumbnail: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('category', courseData.category);
      if (courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail);
      }

      const response = await dispatch(updateCourse({ id: courseId, formData })).unwrap();
      if (response?.success) {
        toast.success('Course updated successfully');
        navigate('/instructor/courses');
      }
    } catch (error) {
      toast.error('Failed to update course');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Course</h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-blue-900/30 rounded-lg text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-blue-900/30 rounded-lg text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-blue-900/30 rounded-lg text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              {/* Thumbnail */}
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Course Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {courseData.previewImage && (
                    <img
                      src={courseData.previewImage}
                      alt="Course thumbnail"
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/50 file:text-white hover:file:bg-blue-500/70"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updating}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
              >
                {updating ? 'Updating Course...' : 'Update Course'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 