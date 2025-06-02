import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import { getInstructorCourses, getInstructorStats } from '../../Redux/Slices/InstructorSlice';

export default function InstructorDashboard() {
  const dispatch = useDispatch();
  const { courses, stats, loading } = useSelector((state) => state.instructor);

  useEffect(() => {
    dispatch(getInstructorCourses());
    dispatch(getInstructorStats());
  }, [dispatch]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Total Courses</h3>
              <p className="text-4xl font-bold text-blue-400">{stats.totalCourses}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Total Lectures</h3>
              <p className="text-4xl font-bold text-blue-400">{stats.totalLectures}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Courses</h1>
            <Link
              to="/course/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              Create New Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-300">You haven't created any courses yet.</p>
              <Link
                to="/course/create"
                className="inline-block mt-4 text-blue-400 hover:text-blue-300"
              >
                Create your first course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={course.thumbnail?.secure_url || '/path/to/default/image.jpg'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {course.numberOfLectures} lectures
                      </span>
                      <Link
                        to={`/course/edit/${course._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 