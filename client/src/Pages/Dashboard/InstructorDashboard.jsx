import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import { getInstructorCourses, getInstructorStats } from '../../Redux/Slices/InstructorSlice';
import { FaUsers, FaBookReader, FaChalkboardTeacher, FaUserGraduate, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses, stats, loading } = useSelector((state) => state.instructor);
  const { role } = useSelector((state) => state.auth);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    dispatch(getInstructorCourses());
    dispatch(getInstructorStats());
  }, [dispatch]);

  const handleCourseAction = () => {
    if (isAdmin) {
      // Admin can directly create courses
      navigate('/course/request');
    } else {
      // Instructor needs to request approval
      setRequestType('course');
      setShowRequestModal(true);
    }
  };

  const handleLectureAction = (course) => {
    if (isAdmin) {
      // Admin can directly add lectures
      navigate(`/course/${course._id}/lecture/add`, { state: course });
    } else {
      // Instructor needs to request approval
      setRequestType('lecture');
      setSelectedCourse(course);
      setShowRequestModal(true);
    }
  };

  const handleRequestSubmit = () => {
    if (requestType === 'course') {
      navigate('/course/request');
    } else if (requestType === 'lecture') {
      navigate(`/course/${selectedCourse._id}/lecture/request`);
    }
    setShowRequestModal(false);
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-2">
                <FaChalkboardTeacher className="text-2xl text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Total Courses</h3>
              </div>
              <p className="text-4xl font-bold text-blue-400">{stats.totalCourses}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-2">
                <FaBookReader className="text-2xl text-green-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Total Lectures</h3>
              </div>
              <p className="text-4xl font-bold text-green-400">{stats.totalLectures}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-2">
                <FaUsers className="text-2xl text-yellow-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Total Students</h3>
              </div>
              <p className="text-4xl font-bold text-yellow-400">
                {stats.totalStudents || 0}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center mb-2">
                <FaUserGraduate className="text-2xl text-purple-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Active Students</h3>
              </div>
              <p className="text-4xl font-bold text-purple-400">
                {stats.activeStudents || 0}
              </p>
            </motion.div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Courses</h1>
            <button
              onClick={handleCourseAction}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              <FaPlus />
              {isAdmin ? 'Create New Course' : 'Request New Course'}
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-300">You haven't created any courses yet.</p>
              <button
                onClick={handleCourseAction}
                className="inline-block mt-4 text-blue-400 hover:text-blue-300"
              >
                {isAdmin ? 'Create your first course' : 'Request your first course'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={course.thumbnail?.secure_url || '/path/to/default/image.jpg'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                    
                    {/* Course Stats */}
                    <div className="flex justify-between items-center">
                      <div className="bg-white/5 rounded-lg p-3 flex-grow mr-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Lectures</span>
                          <span className="text-blue-400 font-semibold">{course.numberOfLectures}</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 flex-grow ml-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Active Students</span>
                          <span className="text-purple-400 font-semibold">{course.activeStudents || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => handleLectureAction(course)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FaPlus className="text-sm" />
                        {isAdmin ? 'Add Lecture' : 'Request Lecture'}
                      </button>
                      <Link
                        to={`/course/edit/${course._id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit Course
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Confirmation Modal - Only shown for instructors */}
      {!isAdmin && showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {requestType === 'course' ? 'Request New Course' : 'Request New Lecture'}
            </h3>
            <p className="text-gray-300 mb-6">
              {requestType === 'course'
                ? 'You are about to request approval to create a new course. Would you like to proceed?'
                : `You are about to request approval to add a new lecture to "${selectedCourse?.title}". Would you like to proceed?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestType(null);
                  setSelectedCourse(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSubmit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}