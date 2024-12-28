import { useRef, useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBlog,deleteBlog } from "../../Redux/Slices/BlogSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function AddBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const thumbnailRef = useRef(null);
  const [userInput, setUserInput] = useState({
    title: "",
    description: "",
    link:"",
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
    if (
        !userInput.thumbnail ||
        !userInput.title ||
        !userInput.link ||
        !userInput.description
    ) {
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
        
        // Reset form
        setUserInput({
            title: "",
            description: "",
            link:"",
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

const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const URL = BASE_URL+ 'api/v1/blog/all'

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  async function onBlogDelete(id) {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await dispatch(deleteBlog(id));
        
        if (res?.payload?.success) {
          setBlogs(blogs.filter(blog => blog._id !== id));
          toast.success("Blog deleted successfully");
       navigate(-1);
        }
      } catch (error) {
        console.error("Failed to delete blog:", error);
        toast.error("Failed to delete blog");
      }
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          autoComplete="off"
          noValidate
          className="flex flex-col dark:bg-base-100 gap-7 rounded-lg md:py-5 py-7 md:px-7 px-3 md:w-[750px] w-full shadow-custom dark:shadow-xl"
        >
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-xl text-green-500"
              onClick={() => navigate(-1)}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-center dark:text-purple-500 md:text-4xl text-2xl font-bold font-inter">
              Add New Blog
            </h1>
          </header>
          <div className="w-full flex md:flex-row md:justify-between justify-center flex-col md:gap-0 gap-5">
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* Thumbnail */}
              <div className="border border-gray-300 h-[200px] flex justify-center cursor-pointer">
                {userInput.thumbnailSrc && (
                  <img
                    src={userInput.thumbnailSrc}
                    alt="Thumbnail Preview"
                    className="object-fill w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      thumbnailRef.current.click();
                    }}
                  />
                )}
                {!userInput.thumbnailSrc && (
                  <label
                    className="font-[500] text-xl h-full w-full flex justify-center items-center cursor-pointer font-lato"
                    htmlFor="thumbnail"
                  >
                    Choose Thumbnail
                  </label>
                )}
                <input
                  type="file"
                  className="hidden"
                  id="thumbnail"
                  ref={thumbnailRef}
                  name="thumbnail"
                  onChange={handleThumbnail}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* Title */}
              <InputBox
                label={"Title"}
                name={"title"}
                type={"text"}
                placeholder={"Enter Blog Title"}
                onChange={handleInputChange}
                value={userInput.title}
              />
              {/* Link */}
              <InputBox
                label={"Link"}
                name={"link"}
                type={"text"}
                placeholder={"Enter Blog Link"}
                onChange={handleInputChange}
                value={userInput.link}
              />
              {/* Description */}
              <TextArea
                label={"Description"}
                name={"description"}
                rows={5}
                type={"text"}
                placeholder={"Enter Blog Description"}
                onChange={handleInputChange}
                value={userInput.description}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 bg-yellow-500 text-white dark:text-base-200  transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer"
          >
            {isLoading ? "Adding Blog..." : "Add New Blog"}
          </button>
        </form>
      </section>
      <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div 
          key={blog._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
            {blog.thumbnail && blog.thumbnail.secure_url && (
              <img 
                src={blog.thumbnail.secure_url} 
                alt={blog.title} 
                className="w-full h-48 object-cover"
                />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {blog.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                  onClick={() => onBlogDelete(blog._id)} 
                  >
                  Delet blog
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
}