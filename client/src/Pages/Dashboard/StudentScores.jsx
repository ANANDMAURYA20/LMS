import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../Layout/Layout';
import { getAllScores } from '../../Redux/Slices/ScoreSlice';
import { FaGraduationCap, FaBookOpen, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function StudentScores() {
    const dispatch = useDispatch();
    const { scores, loading } = useSelector((state) => state.scores);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredScores, setFilteredScores] = useState([]);

    useEffect(() => {
        console.log("Component mounted");  // Debug log
        dispatch(getAllScores());
    }, [dispatch]);

    useEffect(() => {
        if (scores) {
            setFilteredScores(
                scores.filter((score) =>
                    score.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    score.courseId.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, scores]);

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    // Add this debug log
    console.log("Current state:", { loading, scores, filteredScores });

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    // Add a default return even if there's no data
    return (
        <Layout>
            <div className="min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-4">Student Scores</h1>
                {scores.length === 0 ? (
                    <div className="text-center text-gray-600">
                        No scores available
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                Student Scores Dashboard
                            </h1>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by student name or course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                                <FaSearch className="absolute right-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Course
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Lecture
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredScores.map((score) => (
                                            <motion.tr
                                                key={score._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <FaGraduationCap className="h-10 w-10 text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {score.userId.fullName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {score.userId.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FaBookOpen className="h-5 w-5 mr-2 text-blue-500" />
                                                        <span className="text-sm text-gray-900 dark:text-white">
                                                            {score.courseId.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {score.lectureTitle}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${getScoreColor(score.score)}`}>
                                                        {score.score}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {score.correctAnswers}/{score.questionsAttempted} correct
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(score.attemptedAt).toLocaleDateString()}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default StudentScores;


