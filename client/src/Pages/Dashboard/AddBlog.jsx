import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBlog, deleteBlog } from "../../Redux/Slices/BlogSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AddBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  const [isLoading, setIsLoading] = useState(false);
  const thumbnailRef = useRef(null);
  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
    link: "",
    thumbnail: undefined,
    thumbnailSrc: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleThumbnail(e) {
    const file = e.target.files[0];
    const source = window.URL.createObjectURL(file);
    setUserInput({
      ...userInput,
      thumbnail: file,
      thumbnailSrc: source,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.thumbnail || !userInput.title || !userInput.link || !userInput.description) {
      toast.error("All fields are mandatory");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("thumbnail", userInput.thumbnail);
    formData.append("title", userInput.title);
    formData.append("link", userInput.link);
    formData.append("description", userInput.description);

    try {
      const response = await dispatch(addBlog(formData)).unwrap();
      toast.success("Blog created successfully");
      navigate(0);
      setUserInput({
        title: "",
        description: "",
        link: "",
        thumbnail: undefined,
        thumbnailSrc: "",
      });
    } catch (error) {
      console.error("Blog creation error:", error);
      toast.error(error?.message || "Failed to create blog");
    } finally {
      setIsLoading(false);
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
              <div className="flex items-center justify-center relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-0 text-xl text-white/80 hover:text-white transition-colors duration-300"
                  onClick={() => navigate(-1)}
                >
                  <AiOutlineArrowLeft />
                </motion.button>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Create New Blog
                </h1>
              </div>
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
                      htmlFor="thumbnail"
                      className="cursor-pointer block"
                    >
                      {userInput.thumbnailSrc ? (
                        <img
                          className="w-full h-48 object-cover rounded-lg"
                          src={userInput.thumbnailSrc}
                          alt="Preview"
                        />
                      ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-300">
                          <BsCloudUpload className="text-4xl mb-2" />
                          <span className="text-sm">
                            Click to upload blog thumbnail
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="thumbnail"
                        ref={thumbnailRef}
                        onChange={handleThumbnail}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </motion.div>

                  {/* Title Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <InputBox
                      label="Blog Title"
                      name="title"
                      type="text"
                      placeholder="Enter blog title"
                      onChange={handleInputChange}
                      value={userInput.title}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                    />
                  </motion.div>

                  {/* Link Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <InputBox
                      label="Blog Link"
                      name="link"
                      type="text"
                      placeholder="Enter blog link"
                      onChange={handleInputChange}
                      value={userInput.link}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                    />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  {/* Description Input */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <TextArea
                      label="Blog Description"
                      name="description"
                      rows={8}
                      placeholder="Enter blog description"
                      onChange={handleInputChange}
                      value={userInput.description}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium backdrop-blur-sm mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Blog...
                  </span>
                ) : (
                  "Create Blog"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}