import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPendingCourseRequests,
    updateCourseRequestStatus
} from '../../Redux/Slices/CourseSlice';
import { getStatsData } from '../../Redux/Slices/StatSlice';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaSpinner, FaUsers, FaStar, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PieChart } from 'react-minimal-pie-chart';

function AdminDashboard() {
    const dispatch = useDispatch();
    const { pendingRequests, loading: reduxLoading } = useSelector((state) => state.course);
    const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);
    const { role } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchAllPendingItems();
        dispatch(getStatsData());
    }, [dispatch]);

    const fetchAllPendingItems = async () => {
        try {
            dispatch(getPendingCourseRequests());
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch pending items');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await dispatch(updateCourseRequestStatus({
                requestId,
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
            })).unwrap();
            setRejectionReason('');
            fetchAllPendingItems();
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    if (loading || reduxLoading) {
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
                    {/* Statistics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">User Statistics</h2>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <FaUsers className="text-4xl text-blue-400 mx-auto mb-2" />
                                    <p className="text-lg text-gray-300">Total Users</p>
                                    <p className="text-3xl font-bold text-white">{allUsersCount}</p>
                                </div>
                                <div className="text-center">
                                    <FaStar className="text-4xl text-yellow-400 mx-auto mb-2" />
                                    <p className="text-lg text-gray-300">Subscribed Users</p>
                                    <p className="text-3xl font-bold text-white">{subscribedCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">User Distribution</h2>
                            <div className="w-48 h-48 mx-auto">
                                <PieChart
                                    data={[
                                        { title: 'Regular Users', value: allUsersCount - subscribedCount, color: '#60A5FA' },
                                        { title: 'Subscribed Users', value: subscribedCount, color: '#FBBF24' }
                                    ]}
                                    label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                                    labelStyle={{
                                        fill: '#fff',
                                        fontSize: '5px',
                                        fontFamily: 'sans-serif'
                                    }}
                                />
                            </div>
                            <div className="flex justify-center mt-4 space-x-4">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                                    <span className="text-gray-300">Regular Users</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                                    <span className="text-gray-300">Subscribed Users</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Requests Section */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Course Requests</h2>
                        {pendingRequests?.length === 0 ? (
                            <p className="text-gray-400">No pending course requests</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {pendingRequests?.map((request) => (
                                    <motion.div
                                        key={request._id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 rounded-lg p-4 space-y-4"
                                    >
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">{request.title}</h3>
                                            <div className="flex items-center text-gray-400 text-sm mt-1">
                                                <FaChalkboardTeacher className="mr-2" />
                                                <p>Instructor: {request.instructor?.fullName}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 line-clamp-2">{request.description}</p>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleStatusUpdate(request._id, 'APPROVED')}
                                                className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                            >
                                                <FaCheck className="mr-1" /> Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = window.prompt('Enter rejection reason:');
                                                    if (reason) {
                                                        setRejectionReason(reason);
                                                        handleStatusUpdate(request._id, 'REJECTED');
                                                    }
                                                }}
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
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;