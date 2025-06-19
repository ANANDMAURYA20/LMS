import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function LectureRequestForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const [courseDetails, setCourseDetails] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        lecture: null,
        materials: null,
        questions: []
    });

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/courses/${courseId}`);
                setCourseDetails(response.data.course);
            } catch (error) {
                toast.error('Failed to fetch course details');
                navigate('/instructor/courses');
            }
        };

        fetchCourseDetails();
    }, [courseId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            [type]: file
        }));
    };

    const handleAddQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    questionText: '',
                    options: ['', '', '', ''],
                    correctOption: 0
                }
            ]
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        setFormData(prev => {
            const newQuestions = [...prev.questions];
            if (field === 'option') {
                newQuestions[index].options[value.optionIndex] = value.text;
            } else {
                newQuestions[index][field] = value;
            }
            return {
                ...prev,
                questions: newQuestions
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('courseId', courseId);
            
            // Append basic fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            
            // Append lecture file if exists
            if (formData.lecture) {
                formDataToSend.append('lecture', formData.lecture);
            }
            
            // Append materials file if exists
            if (formData.materials) {
                formDataToSend.append('materials', formData.materials);
            }
            
            // Append questions as JSON string
            if (formData.questions.length > 0) {
                formDataToSend.append('questions', JSON.stringify(formData.questions));
            }

            const response = await axiosInstance.post('/api/v1/request/lectures', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Lecture request submitted successfully');
            navigate('/instructor/courses');
        } catch (error) {
            console.error('Error submitting lecture request:', error);
            toast.error(error?.response?.data?.message || 'Failed to submit lecture request');
        } finally {
            setLoading(false);
        }
    };

    if (!courseDetails) {
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
                        <h1 className="text-3xl font-bold text-white mb-2">Request New Lecture</h1>
                        <p className="text-gray-300 mb-8">For course: {courseDetails.title}</p>

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
                                    rows="4"
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                                    placeholder="Enter lecture description"
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

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-white">Questions</label>
                                    <button
                                        type="button"
                                        onClick={handleAddQuestion}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Add Question
                                    </button>
                                </div>

                                {formData.questions.map((question, index) => (
                                    <div key={index} className="bg-white/5 p-4 rounded-lg space-y-4">
                                        <input
                                            type="text"
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                                            placeholder="Question text"
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                        />

                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${index}`}
                                                    checked={question.correctOption === optionIndex}
                                                    onChange={() => handleQuestionChange(index, 'correctOption', optionIndex)}
                                                    className="text-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleQuestionChange(index, 'option', {
                                                        optionIndex,
                                                        text: e.target.value
                                                    })}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                    className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        ))}
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
                                {loading ? 'Submitting Request...' : 'Submit Lecture Request'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default LectureRequestForm; 