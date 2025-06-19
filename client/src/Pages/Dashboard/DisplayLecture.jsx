import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseLectures,
  deleteCourseLecture,
  updateLectureQuestions
} from "../../Redux/Slices/LectureSlice";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import { axiosInstance } from '../../Helpers/axiosInstance';
import ChatBot from "../../Components/ChatBot";
import { FaTrash, FaPlus, FaVideo, FaDownload } from 'react-icons/fa';

export default function DisplayLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { courseId } = useParams();
  const { lectures } = useSelector((state) => state.lecture);
  const { role, data } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [deletingLecture, setDeletingLecture] = useState(null);

  useEffect(() => {
    if (!courseId) {
      navigate("/courses");
      return;
    }
    dispatch(getCourseLectures(courseId));
  }, [courseId, dispatch]);

  // Reset quiz state when changing lectures
  const handleLectureChange = (idx) => {
    setCurrentVideo(idx);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  async function onLectureDelete(courseId, lectureId) {
    try {
      const loadingToast = toast.loading("Deleting lecture...");
      
      // Delete the lecture using axios directly
      await axiosInstance.delete(`/api/v1/courses/${courseId}/lectures/${lectureId}`);
      
      // Refresh the lectures list
      await dispatch(getCourseLectures(courseId));
      
      toast.success("Lecture deleted successfully", { 
        id: loadingToast,
        duration: 3000
      });
      
      setDeletingLecture(null);
    } catch (error) {
      console.error("Delete lecture error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete lecture", {
        duration: 3000
      });
    }
  }

  // Function to handle delete confirmation
  const handleDeleteClick = (courseId, lectureId, lectureTitle) => {
    setDeletingLecture({ courseId, lectureId, title: lectureTitle });
  };

  const handlePdfDownload = (secure_url) => {
    window.open(secure_url, '_blank');
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex
      });
    }
  };

  const handleSubmitQuiz = () => {
    const currentLecture = lectures[currentVideo];
    if (!currentLecture?.questions || currentLecture.questions.length === 0) return;

    let correctAnswers = 0;
    currentLecture.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOption) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / currentLecture.questions.length) * 100;
    setScore(calculatedScore);
    setShowResults(true);

    // Save score to backend
    saveScore(calculatedScore);
  };

  const saveScore = async (score) => {
    try {
      await axiosInstance.post('/api/v1/scores', {
        courseId: courseId,
        lectureId: lectures[currentVideo]._id,
        score: score
      });
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleGenerateAIQuestions = async () => {
    if (score < 60) {
      try {
        const loadingId = toast.loading("Generating new practice questions...");
        
        const response = await axiosInstance.post('/api/v1/ai/generate-questions', {
          score: score,
          lectureTitle: lectures[currentVideo]?.title
        });
        
        if (response.data.success && response.data.questions) {
          // Create a new action to update the questions
          dispatch(updateLectureQuestions({
            lectureIndex: currentVideo,
            questions: response.data.questions
          }));
          
          // Reset quiz state
          setSelectedAnswers({});
          setShowResults(false);
          setScore(0);
          
          toast.success("New practice questions generated!", { id: loadingId });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error generating questions:', error);
        toast.error(error.response?.data?.message || "Failed to generate new questions");
      }
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  // Function to check if user can manage lectures
  const canManageLectures = () => {
    return role === "ADMIN" || (role === "INSTRUCTOR" && state?.instructor === data?._id);
  };

  return (
    <Layout hideFooter={true} hideNav={true} hideBar={true}>
      <section className="flex flex-col gap-6 items-center py-8 px-4">
        {/* Main content section */}
        <div className="flex flex-col dark:bg-base-100 relative md:gap-12 gap-5 rounded-lg md:py-10 md:pt-3 py-4 pt-3 md:px-7 px-4 md:w-[780px] w-full shadow-custom dark:shadow-xl">
          <h1 className="text-center relative md:px-0 px-3 w-fit dark:text-purple-500 md:text-2xl text-lg font-bold font-inter after:content-[' '] after:absolute after:-bottom-2 md:after:left-0 after:left-3 after:h-[3px] after:w-[60%] after:rounded-full after:bg-yellow-400 dark:after:bg-yellow-600">
            Course:{" "}
            <span className="text-violet-500 dark:text-yellow-500 font-nunito-sans">
              {state?.title}
            </span>
          </h1>

          <div className="flex md:flex-row flex-col md:justify-between w-full">
            {/* Left section for lecture video and details */}
            <div className="md:w-[48%] w-full md:p-3 p-1">
              <div className="w-full">
                <video
                  src={lectures && lectures?.[currentVideo]?.lecture?.secure_url}
                  disablePictureInPicture
                  disableRemotePlayback
                  controls
                  controlsList="nodownload"
                  className="h-[170px] mx-auto"
                ></video>
                <div className="py-7">
                  <h1 className="text-[17px] text-gray-700 font-[500] dark:text-white font-lato">
                    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
                      Title:{" "}
                    </span>
                    {lectures && lectures?.[currentVideo]?.title}
                  </h1>
                  <p className="text-[16.5px] pb-5 text-gray-700 font-[500] dark:text-slate-300 font-lato">
                    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
                      Description:{" "}
                    </span>
                    {lectures && lectures?.[currentVideo]?.description}
                  </p>
                  
                  <p className="text-[16.5px] text-gray-700 font-[500] dark:text-slate-300 font-lato">
                    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
                      Lecture pdf:{" "}
                    </span>
                    <a href={lectures && lectures?.[currentVideo]?.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      See PDF
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right section for lectures list */}
            <div className="md:w-[48%] w-full">
              <div className="bg-slate-50 dark:bg-slate-100 p-4 rounded-lg shadow-lg mb-4 sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#2320f7]">Lectures List</h3>
                  {canManageLectures() && (
                    <button
                      onClick={() => {
                        if (role === 'ADMIN') {
                          navigate(`/course/${courseId}/lecture/add`, { 
                            state: { 
                              _id: courseId,
                              title: state?.title,
                              instructor: state?.instructor 
                            } 
                          });
                        } else {
                          navigate(`/course/${courseId}/lecture/request`, { 
                            state: { 
                              _id: courseId,
                              title: state?.title,
                              instructor: state?.instructor 
                            } 
                          });
                        }
                      }}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md"
                    >
                      <FaPlus className="text-sm" />
                      <span>{role === 'ADMIN' ? 'Add Lecture' : 'Request Lecture'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                <ul className="w-full flex flex-col gap-4">
                  {lectures &&
                    lectures.map((lecture, idx) => (
                      <li 
                        key={lecture._id}
                        className={`p-4 rounded-lg transition-all duration-300 ${
                          currentVideo === idx
                            ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                            : "bg-white/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          {/* Lecture Title and Number */}
                          <div className="flex items-center gap-3">
                            <FaVideo className={`text-lg ${
                              currentVideo === idx
                                ? "text-blue-500 dark:text-blue-400"
                                : "text-gray-400"
                            }`} />
                            <p
                              className={`cursor-pointer text-base font-medium ${
                                currentVideo === idx
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                              onClick={() => handleLectureChange(idx)}
                            >
                              <span className="font-semibold">Lecture {idx + 1}:</span> {lecture?.title}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-7">
                            {lecture?.materials?.secure_url && (
                              <button
                                onClick={() => handlePdfDownload(lecture.materials.secure_url)}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300"
                              >
                                <FaDownload className="text-xs" />
                                <span>PDF</span>
                              </button>
                            )}
                            
                            {canManageLectures() && (
                              <button
                                onClick={() => handleDeleteClick(courseId, lecture?._id, lecture?.title)}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300"
                              >
                                <FaTrash className="text-xs" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="flex flex-col dark:bg-base-100 rounded-lg md:py-8 py-4 md:px-7 px-4 md:w-[780px] w-full shadow-custom dark:shadow-xl">
          <h2 className="text-center text-2xl font-bold text-blue-500 dark:text-yellow-500 font-inter mb-6">
            Practice Questions
          </h2>
          
          {lectures?.[currentVideo]?.questions?.length > 0 ? (
            <>
              <div className="space-y-6">
                {lectures[currentVideo].questions.map((question, qIndex) => (
                  <div 
                    key={qIndex} 
                    className="border dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg"
                  >
                    <h3 className="text-[17px] font-[500] text-gray-700 dark:text-white font-lato mb-4">
                      <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold">
                        Question {qIndex + 1}:{" "}
                      </span>
                      {question.questionText}
                    </h3>
                    
                    <div className="space-y-3 pl-4">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-center gap-3 p-3 border dark:border-gray-700 rounded-md cursor-pointer
                            ${showResults 
                              ? oIndex === question.correctOption 
                                ? 'bg-green-100 dark:bg-green-900'
                                : selectedAnswers[qIndex] === oIndex
                                  ? 'bg-red-100 dark:bg-red-900'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                              : selectedAnswers[qIndex] === oIndex
                                ? 'bg-blue-50 dark:bg-blue-900'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          onClick={() => !showResults && handleAnswerSelect(qIndex, oIndex)}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={selectedAnswers[qIndex] === oIndex}
                            onChange={() => !showResults && handleAnswerSelect(qIndex, oIndex)}
                            className="w-4 h-4"
                            disabled={showResults}
                          />
                          <label className="cursor-pointer text-gray-600 dark:text-gray-300 font-lato">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4">
                {showResults && (
                  <div className="text-center mb-4">
                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      Your Score: {score.toFixed(1)}%
                    </p>
                    
                    {showResults && score < 60 && (
                      
                      <button
                        onClick={handleGenerateAIQuestions}
                        className="mt-4 px-6 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        Generate Practice Questions
                      </button>
                      
                    )}
                    <p>Don't worry AI will help you to make you better</p>
                  </div>
                )}
                
                <button
                  onClick={showResults ? handleRetakeQuiz : handleSubmitQuiz}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors
                    ${showResults 
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-violet-500 hover:bg-violet-600'
                    }`}
                >
                  {showResults ? 'Retake Quiz' : 'Submit Answers'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 font-lato py-4">
              No questions available for this lecture.
            </p>
          )}
        </div>
        
        {/* Add the ChatBot component */}
        <ChatBot lectureTitle={lectures && lectures[currentVideo]?.title} />
      </section>

      {/* Delete Confirmation Modal */}
      {deletingLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Lecture
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the lecture "{deletingLecture.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingLecture(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onLectureDelete(deletingLecture.courseId, deletingLecture.lectureId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}








