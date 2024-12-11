import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog } from "../../Redux/Slices/BlogSlice"; // Replace with your blog slice
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
    category: "",
    createdBy: "",
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
      !userInput.description ||
      !userInput.category ||
      !userInput.createdBy
    ) {
      toast.error("All fields are mandatory");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("thumbnail", userInput.thumbnail);
    formData.append("title", userInput.title);
    formData.append("description", userInput.description);
    formData.append("category", userInput.category);
    formData.append("createdBy", userInput.createdBy);

    const response = await dispatch(addBlog(formData));
    if (response?.payload?.success) {
      navigate("/blogs"); // Redirect to blogs page
      setUserInput({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        thumbnail: undefined,
        thumbnailSrc: "",
      });
    }
    setIsLoading(false);
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
              {/* Category */}
              <InputBox
                label={"Category"}
                name={"category"}
                type={"text"}
                placeholder={"Enter Blog Category"}
                onChange={handleInputChange}
                value={userInput.category}
              />
              {/* Created By */}
              <InputBox
                label={"Created By"}
                name={"createdBy"}
                type={"text"}
                placeholder={"Enter Author Name"}
                onChange={handleInputChange}
                value={userInput.createdBy}
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
    </Layout>
  );
}
