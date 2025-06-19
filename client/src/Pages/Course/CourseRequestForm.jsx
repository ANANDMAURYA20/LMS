import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourseRequest, createNewCourse } from '../../Redux/Slices/CourseSlice';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { getUserData } from '../../Redux/Slices/AuthSlice';

function CourseRequestForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, role, data } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        thumbnail: null,
        createdBy: ''
    });

    // Check authentication and role
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!isLoggedIn) {
                    toast.error('Please login to continue');
                    navigate('/login');
                    return;
                }
                
                if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
                    toast.error('Only instructors and admins can create courses');
                    navigate('/denied');
                    return;
                }

                // Only verify token if we haven't set the creator name yet
                if (!formData.createdBy && data) {
                    try {
                        await dispatch(getUserData()).unwrap();
                    } catch (error) {
                        toast.error('Session expired. Please login again.');
                        navigate('/login');
                        return;
                    }

                    // Set the createdBy field with the user's name from data
                    if (data && typeof data === 'object') {
                        setFormData(prev => ({
                            ...prev,
                            createdBy: data.name || data.fullName || data.email || 'Unknown Creator'
                        }));
                    }
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [isLoggedIn, role, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            thumbnail: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loadingToast = toast.loading(
                role === 'ADMIN' ? 'Creating course...' : 'Submitting course request...'
            );

            if (!isLoggedIn) {
                throw new Error('Please login to continue');
            }

            // Create FormData object
            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('description', formData.description);
            formDataObj.append('category', formData.category);
            formDataObj.append('createdBy', formData.createdBy);
            if (formData.thumbnail) {
                formDataObj.append('thumbnail', formData.thumbnail);
            }

            // Use different actions based on role
            if (role === 'ADMIN') {
                await dispatch(createNewCourse(formDataObj));
                navigate('/courses');
            } else {
                await dispatch(createCourseRequest(formDataObj));
                navigate('/instructor/courses');
            }

            toast.success(
                role === 'ADMIN'
                    ? 'Course created successfully!'
                    : 'Course request submitted for approval!',
                { id: loadingToast }
            );
        } catch (error) {
            console.error('Course submission error:', error);
            toast.error(error?.response?.data?.message || 'Failed to submit course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-white mb-6 hover:text-blue-400 transition-colors"
                    >
                        <AiOutlineArrowLeft className="mr-2" />
                        Back
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
                        <h1 className="text-3xl font-bold text-white mb-8">
                            {role === 'ADMIN' ? 'Create New Course' : 'Request New Course'}
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white mb-2" htmlFor="title">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    minLength="8"
                                    maxLength="59"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter course title"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    minLength="8"
                                    maxLength="500"
                                    rows="4"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                                    placeholder="Enter course description"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="category">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Development">Development</option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Music">Music</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="thumbnail">
                                    Course Thumbnail
                                </label>
                                <input
                                    type="file"
                                    id="thumbnail"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-semibold text-white ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors`}
                            >
                                {loading 
                                    ? (role === 'ADMIN' ? 'Creating Course...' : 'Submitting Request...') 
                                    : (role === 'ADMIN' ? 'Create Course' : 'Submit Course Request')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CourseRequestForm;