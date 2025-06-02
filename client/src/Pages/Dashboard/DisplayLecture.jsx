import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseLectures,
  deleteCourseLecture,
  updateLectureQuestions
} from "../../Redux/Slices/LectureSlice";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import { axiosInstance } from '../../Helpers/axiosInstance';
import ChatBot from "../../components/ChatBot"; // Import the ChatBot component

export default function DisplayLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz state when changing lectures
  const handleLectureChange = (idx) => {
    setCurrentVideo(idx);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  async function onLectureDelete(courseId, lectureId) {
    await dispatch(
      deleteCourseLecture({ courseId: courseId, lectureId: lectureId })
    );
    await dispatch(getCourseLectures(courseId));
  }

  useEffect(() => {
    if (!state) navigate("/courses");
    dispatch(getCourseLectures(state._id));
  }, []);
  
  const handlePdfDownload = (secure_url) => {
    window.open(secure_url, '_blank');
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmitQuiz = async () => {
    const currentQuestions = lectures[currentVideo]?.questions || [];
    
    // Check if all questions are answered
    const unansweredQuestions = currentQuestions.filter((_, index) => 
      selectedAnswers[index] === undefined
    );

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting.`);
      return;
    }
    
    let correctAnswers = 0;
    currentQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / currentQuestions.length) * 100;
    setScore(percentage);
    setShowResults(true);

    // Save score to backend
    try {
      const response = await axiosInstance.post('/api/v1/scores', {
        courseId: state._id,
        lectureId: lectures[currentVideo]._id,
        score: percentage,
        questionsAttempted: currentQuestions.length,
        correctAnswers
      });

      if (response.data.success) {
        toast.success('Quiz submitted and score saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save score');
      console.error('Score saving error:', error);
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
            <div className="md:w-[48%] w-full max-h-[500px] overflow-y-auto">
              <ul className="w-full md:p-2 p-0 flex flex-col gap-5 shadow-sm">
                <li className="font-semibold bg-slate-50 dark:bg-slate-100 p-3 rounded-md shadow-lg sticky top-0 text-xl text-[#2320f7] font-nunito-sans flex items-center justify-between">
                  <p>Lectures list</p>
                  {role === "ADMIN" && (
                    <button
                      onClick={() =>
                        navigate("/course/addlecture", { state: { ...state } })
                      }
                      className="btn-primary px-3 py-2 font-inter rounded-md font-semibold text-sm"
                    >
                      Add new lecture
                    </button>
                  )}
                </li>
                {lectures &&
                  lectures.map((lecture, idx) => (
                    <li className="space-y-2" key={lecture._id}>
                      <div className="flex flex-col gap-2">
                        <p
                          className={`cursor-pointer text-base font-[500] font-open-sans ${
                            currentVideo === idx
                              ? "text-blue-600 dark:text-yellow-500"
                              : "text-gray-600 dark:text-white"
                          }`}
                          onClick={() => handleLectureChange(idx)}
                        >
                          <span className="font-inter">{idx + 1}. </span>
                          {lecture?.title}
                        </p>
                        
                        {lecture?.materials?.secure_url && (
                          <button
                            onClick={() => handlePdfDownload(lecture.materials.secure_url)}
                            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white font-inter font-[500] text-sm w-fit flex items-center gap-2"
                          >
                            Download PDF
                          </button>
                        )}
                        
                        {role === "ADMIN" && (
                          <button
                            onClick={() => onLectureDelete(state?._id, lecture?._id)}
                            className="bg-[#ff3838] px-2 py-1 rounded-md text-white font-inter font-[500] text-sm w-fit"
                          >
                            Delete lecture
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
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
                          onClick={() => !showResults && handleOptionSelect(qIndex, oIndex)}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            checked={selectedAnswers[qIndex] === oIndex}
                            onChange={() => !showResults && handleOptionSelect(qIndex, oIndex)}
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
    </Layout>
  );
}








