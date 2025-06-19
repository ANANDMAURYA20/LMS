import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function AddLectureForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        lecture: null,
        materials: null,
        questions: []
    });

    // Check authentication and role
    useEffect(() => {
        const checkAuthAndCourse = async () => {
            if (!isLoggedIn) {
                toast.error('Please login to continue');
                navigate('/login');
                return;
            }
            
            if (role !== 'ADMIN') {
                toast.error('Only admins can directly add lectures');
                navigate('/denied');
                return;
            }

            // Check if we have course data in location state
            if (!location.state || !location.state._id) {
                toast.error('Course information is missing');
                navigate('/courses');
                return;
            }
        };

        checkAuthAndCourse();
    }, [isLoggedIn, role, navigate, location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        if (!updatedQuestions[index]) {
            updatedQuestions[index] = {
                questionText: '',
                options: ['', ''],
                correctOption: 0
            };
        }
        
        if (field === 'options') {
            updatedQuestions[index].options[value.index] = value.text;
        } else {
            updatedQuestions[index][field] = value;
        }
        
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    questionText: '',
                    options: ['', ''],
                    correctOption: 0
                }
            ]
        }));
    };

    const removeQuestion = (index) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].options.push('');
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options
            .filter((_, i) => i !== optionIndex);
        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let loadingToast;
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            if (formData.link) {
                formDataToSend.append('link', formData.link);
            }
            
            if (formData.lecture) {
                formDataToSend.append('lecture', formData.lecture);
            }
            
            if (formData.materials) {
                formDataToSend.append('materials', formData.materials);
            }

            if (formData.questions && formData.questions.length > 0) {
                // Validate questions before sending
                const validQuestions = formData.questions.every(q => 
                    q.questionText && 
                    Array.isArray(q.options) && 
                    q.options.length >= 2 && 
                    typeof q.correctOption === 'number' && 
                    q.correctOption >= 0 && 
                    q.correctOption < q.options.length
                );

                if (!validQuestions) {
                    toast.error('Please ensure all questions have text, at least 2 options, and a valid correct option');
                    setLoading(false);
                    return;
                }

                formDataToSend.append('questions', JSON.stringify(formData.questions));
            }

            loadingToast = toast.loading('Preparing to upload...');

            const response = await axiosInstance.post(
                `/api/v1/courses/${location.state._id}/lectures`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 600000, // 10 minutes timeout
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        if (percentCompleted < 100) {
                            toast.loading(`Uploading: ${percentCompleted}%`, { id: loadingToast });
                        } else {
                            toast.loading('Processing...', { id: loadingToast });
                        }
                    }
                }
            );
            
            // Dismiss the loading toast
            toast.dismiss(loadingToast);
            
            // Show success toast
            toast.success('Lecture added successfully!', {
                duration: 3000,
                position: 'top-center'
            });

            // Wait for 1 second to ensure toast is visible
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Then navigate
            navigate(`/courses/${location.state._id}/lectures`);
        } catch (error) {
            // Dismiss the loading toast if it exists
            if (loadingToast) {
                toast.dismiss(loadingToast);
            }
            
            let errorMessage = 'Failed to add lecture';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Upload timed out. Please try with a smaller file or check your connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            console.error('Error details:', error);
            toast.error(errorMessage, {
                duration: 3000,
                position: 'top-center'
            });
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
                            Add New Lecture to {location.state?.title}
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white mb-2" htmlFor="title">
                                    Lecture Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    minLength="3"
                                    maxLength="100"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter lecture title"
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
                                    minLength="10"
                                    maxLength="500"
                                    rows="4"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                                    placeholder="Enter lecture description"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="link">
                                    External Resource Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="link"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter resource link"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="lecture">
                                    Lecture Video
                                </label>
                                <input
                                    type="file"
                                    id="lecture"
                                    accept="video/*"
                                    onChange={(e) => handleFileChange(e, 'lecture')}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2" htmlFor="materials">
                                    Additional Materials (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="materials"
                                    onChange={(e) => handleFileChange(e, 'materials')}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Questions Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-white text-lg font-semibold">
                                        Quiz Questions (Optional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Add Question
                                    </button>
                                </div>

                                {formData.questions.map((question, qIndex) => (
                                    <div key={qIndex} className="bg-white/5 p-4 rounded-lg space-y-4">
                                        <div className="flex justify-between">
                                            <h4 className="text-white font-medium">Question {qIndex + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                            placeholder="Enter question"
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                        />

                                        <div className="space-y-2">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={question.correctOption === oIndex}
                                                        onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                                                        className="text-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleQuestionChange(qIndex, 'options', {
                                                            index: oIndex,
                                                            text: e.target.value
                                                        })}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                                    />
                                                    {question.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {question.options.length < 4 && (
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(qIndex)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Add Option
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                {loading ? 'Adding Lecture...' : 'Add Lecture'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AddLectureForm;