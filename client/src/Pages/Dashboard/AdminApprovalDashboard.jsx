import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

function AdminApprovalDashboard() {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [pendingLectures, setPendingLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    useEffect(() => {
        fetchPendingItems();
    }, []);

    const fetchPendingItems = async () => {
        try {
            const [coursesResponse, lecturesResponse] = await Promise.all([
                axiosInstance.get('/api/v1/admin/pending-courses'),
                axiosInstance.get('/api/v1/admin/pending-lectures')
            ]);

            setPendingCourses(coursesResponse.data.pendingCourses);
            setPendingLectures(lecturesResponse.data.pendingLectures);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch pending items');
            setLoading(false);
        }
    };

    const handleApproval = async (type, courseId, lectureId = null) => {
        try {
            const endpoint = lectureId
                ? `/api/v1/admin/courses/${courseId}/lectures/${lectureId}/approval`
                : `/api/v1/admin/courses/${courseId}/approval`;

            await axiosInstance.patch(endpoint, {
                status: 'APPROVED'
            });

            toast.success(`${type} approved successfully`);
            fetchPendingItems();
        } catch (error) {
            toast.error(`Failed to approve ${type.toLowerCase()}`);
        }
    };

    const openRejectionModal = (item, type) => {
        setSelectedItem({ ...item, type });
        setShowRejectionModal(true);
    };

    const handleRejection = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            const endpoint = selectedItem.type === 'Lecture'
                ? `/api/v1/admin/courses/${selectedItem.courseId}/lectures/${selectedItem.lectureId}/approval`
                : `/api/v1/admin/courses/${selectedItem._id}/approval`;

            await axiosInstance.patch(endpoint, {
                status: 'REJECTED',
                rejectionReason
            });

            toast.success(`${selectedItem.type} rejected successfully`);
            setShowRejectionModal(false);
            setRejectionReason('');
            setSelectedItem(null);
            fetchPendingItems();
        } catch (error) {
            toast.error(`Failed to reject ${selectedItem.type.toLowerCase()}`);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Pending Courses Section */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Pending Courses</h2>
                        {pendingCourses.length === 0 ? (
                            <p className="text-gray-400">No pending courses</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {pendingCourses.map((course) => (
                                    <motion.div
                                        key={course._id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 rounded-lg p-4 space-y-4"
                                    >
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                                            <p className="text-gray-400 text-sm">By {course.createdBy}</p>
                                        </div>
                                        <p className="text-gray-300 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleApproval('Course', course._id)}
                                                className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                            >
                                                <FaCheck className="mr-1" /> Approve
                                            </button>
                                            <button
                                                onClick={() => openRejectionModal(course, 'Course')}
                                                className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                            >
                                                <FaTimes className="mr-1" /> Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pending Lectures Section */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Pending Lectures</h2>
                        {pendingLectures.length === 0 ? (
                            <p className="text-gray-400">No pending lectures</p>
                        ) : (
                            <div className="space-y-6">
                                {pendingLectures.map((course) => (
                                    <div key={course.courseId} className="bg-white/5 rounded-lg p-4">
                                        <h3 className="text-xl font-semibold text-white mb-4">
                                            Course: {course.courseTitle}
                                        </h3>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {course.pendingLectures.map((lecture) => (
                                                <motion.div
                                                    key={lecture.lectureId}
                                                    whileHover={{ scale: 1.02 }}
                                                    className="bg-white/5 rounded-lg p-4 space-y-4"
                                                >
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white">
                                                            {lecture.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-gray-300 line-clamp-2">
                                                        {lecture.description}
                                                    </p>
                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            onClick={() => handleApproval('Lecture', course.courseId, lecture.lectureId)}
                                                            className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                                        >
                                                            <FaCheck className="mr-1" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectionModal({ ...lecture, courseId: course.courseId }, 'Lecture')}
                                                            className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                                        >
                                                            <FaTimes className="mr-1" /> Reject
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
                    >
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Reject {selectedItem.type}
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                            className="w-full h-32 p-2 bg-gray-700 text-white rounded-md resize-none mb-4"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectionModal(false);
                                    setRejectionReason('');
                                    setSelectedItem(null);
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejection}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            >
                                Reject
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </Layout>
    );
}

export default AdminApprovalDashboard; 