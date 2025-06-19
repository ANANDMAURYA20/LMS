import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import { motion } from "framer-motion";
import { BsCloudUpload } from "react-icons/bs";

// Add this near the top of the file
import { useSelector } from "react-redux";

export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Add this line to get the user role
  const { role } = useSelector((state) => state.auth);
  
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [userInput, setUserInput] = useState({
    title: "",
    category: "",
    createdBy: "",
    description: "",
    thumbnail: null,
    previewImage: "",
  });

  // Add this useEffect to check role on component mount
  React.useEffect(() => {
    console.log('Current user role:', role);
    console.log('Is logged in:', localStorage.getItem('isLoggedIn'));
  }, [role]);

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    if (uploadImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener("load", function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadImage,
        });
      });
    }
  }

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  // Change the function declaration to async
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!role) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
  
    try {
      setIsCreatingCourse(true);
      const formData = new FormData();
      formData.append("title", userInput.title);
      formData.append("category", userInput.category);
      formData.append("createdBy", userInput.createdBy);
      formData.append("description", userInput.description);
      if (userInput.thumbnail) {
        formData.append("thumbnail", userInput.thumbnail);
      }
  
      // Use createNewCourse instead of createCourseRequest
      const response = await dispatch(createNewCourse(formData));
      if (response?.payload?.success) {
        toast.success("Course created successfully");
        setUserInput({
          title: "",
          category: "",
          createdBy: "",
          description: "",
          thumbnail: null,
          previewImage: "",
        });
        navigate("/courses");
      }
    } catch (error) {
      console.error('Course creation error:', error);
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error?.response?.data?.message || "Failed to create course");
      }
    } finally {
      setIsCreatingCourse(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Create New Course
              </h1>
              <p className="text-gray-300">Share your knowledge with the world</p>
            </motion.div>

            <form onSubmit={onFormSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Thumbnail Upload */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-dashed border-blue-400/50 rounded-xl p-4 text-center"
                  >
                    <label
                      htmlFor="image_uploads"
                      className="cursor-pointer block"
                    >
                      {userInput.previewImage ? (
                        <img
                          className="w-full h-48 object-cover rounded-lg"
                          src={userInput.previewImage}
                          alt="Preview"
                        />
                      ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-300">
                          <BsCloudUpload className="text-4xl mb-2" />
                          <span className="text-sm">
                            Click to upload course thumbnail
                          </span>
                        </div>
                      )}
                    </label>
                    <input
                      className="hidden"
                      type="file"
                      id="image_uploads"
                      accept=".jpg, .jpeg, .png"
                      name="image_uploads"
                      onChange={handleImageUpload}
                    />
                  </motion.div>

                  {/* Title */}
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={userInput.title}
                      onChange={handleUserInput}
                      placeholder="Course Title"
                      className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <input
                      type="text"
                      name="category"
                      value={userInput.category}
                      onChange={handleUserInput}
                      placeholder="Course Category"
                      className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Instructor */}
                  <div className="relative">
                    <input
                      type="text"
                      name="createdBy"
                      value={userInput.createdBy}
                      onChange={handleUserInput}
                      placeholder="Instructor Name"
                      className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <textarea
                      name="description"
                      value={userInput.description}
                      onChange={handleUserInput}
                      placeholder="Course Description"
                      rows="8"
                      className="w-full px-4 py-3 bg-blue-900/30 dark:bg-gray-700/30 rounded-lg backdrop-blur-sm text-white placeholder-gray-300 border border-white/10 focus:border-blue-400/50 focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isCreatingCourse}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm mt-6"
              >
                {isCreatingCourse ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Course...
                  </span>
                ) : (
                  "Create Course"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}