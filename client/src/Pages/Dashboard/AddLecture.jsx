import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addCourseLecture } from "../../Redux/Slices/LectureSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "../../Components/InputBox/InputBox";
import TextArea from "../../Components/InputBox/TextArea";
import Layout from "../../Layout/Layout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

export default function AddLecture() {
  const courseDetails = useLocation().state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const pdfRef = useRef(null);
  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    link: "",
    videoSrc: "",
    pdf: undefined,
    pdfName: "",
    questions: [
      {
        questionText: "",
        options: ["", ""],
        correctOption: 0,
        explanation: ""
      }
    ]
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  function handleQuestionChange(index, field, value) {
    const updatedQuestions = [...userInput.questions];
    if (field === 'questionText' || field === 'explanation') {
      updatedQuestions[index][field] = value;
    } else if (field === 'correctOption') {
      updatedQuestions[index][field] = parseInt(value);
    }
    setUserInput({
      ...userInput,
      questions: updatedQuestions
    });
  }

  function handleOptionChange(questionIndex, optionIndex, value) {
    const updatedQuestions = [...userInput.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setUserInput({
      ...userInput,
      questions: updatedQuestions
    });
  }

  function addOption(questionIndex) {
    const updatedQuestions = [...userInput.questions];
    updatedQuestions[questionIndex].options.push("");
    setUserInput({
      ...userInput,
      questions: updatedQuestions
    });
  }

  function removeOption(questionIndex, optionIndex) {
    const updatedQuestions = [...userInput.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setUserInput({
        ...userInput,
        questions: updatedQuestions
      });
    } else {
      toast.error("Minimum 2 options are required");
    }
  }

  function addQuestion() {
    setUserInput({
      ...userInput,
      questions: [
        ...userInput.questions,
        {
          questionText: "",
          options: ["", ""],
          correctOption: 0,
          explanation: ""
        }
      ]
    });
  }

  function removeQuestion(index) {
    if (userInput.questions.length > 1) {
      const updatedQuestions = userInput.questions.filter((_, i) => i !== index);
      setUserInput({
        ...userInput,
        questions: updatedQuestions
      });
    } else {
      toast.error("At least one question is required");
    }
  }

  function handleVideo(e) {
    const video = e.target.files[0];
    const source = window.URL.createObjectURL(video);
    setUserInput({
      ...userInput,
      lecture: video,
      videoSrc: source,
    });
  }

  function handlePDF(e) {
    const pdf = e.target.files[0];
    if (pdf.type !== "application/pdf") {
      toast.error("Please upload PDF files only");
      return;
    }
    setUserInput({
      ...userInput,
      pdf: pdf,
      pdfName: pdf.name
    });
  }


  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.lecture || !userInput.title || !userInput.description || !userInput.link) {
      toast.error("All fields are mandatory");
      return;
    }

    let hasError = false;

    // Validate questions
    for (let i = 0; i < userInput.questions.length; i++) {
      const question = userInput.questions[i];
      
      if (!question.questionText || question.questionText.trim() === "") {
        toast.error(`Question ${i + 1}: Question text cannot be empty`);
        hasError = true;
        break;
      }

      if (!question.options || question.options.length < 2) {
        toast.error(`Question ${i + 1}: Must have at least 2 options`);
        hasError = true;
        break;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j] || question.options[j].trim() === "") {
          toast.error(`Question ${i + 1}, Option ${j + 1}: Cannot be empty`);
          hasError = true;
          break;
        }
      }

      if (question.correctOption === undefined || 
          question.correctOption < 0 || 
          question.correctOption >= question.options.length) {
        toast.error(`Question ${i + 1}: Please select a valid correct option`);
        hasError = true;
        break;
      }
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("lecture", userInput.lecture);
      formData.append("title", userInput.title);
      formData.append("link", userInput.link);
      formData.append("description", userInput.description);
      formData.append("questions", JSON.stringify(userInput.questions));

      if (userInput.pdf) {
        formData.append("pdf", userInput.pdf);
      }

      const data = { formData, id: userInput.id };

      const response = await dispatch(addCourseLecture(data));
      if (response?.payload?.success) {
        navigate(-1);
        setUserInput({
          id: courseDetails?._id,
          lecture: undefined,
          title: "",
          link: "",
          description: "",
          videoSrc: "",
          pdf: undefined,
          pdfName: "",
          questions: [{
            questionText: "",
            options: ["", ""],
            correctOption: 0,
            explanation: ""
          }]
        });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
}


  useEffect(() => {
    if (!courseDetails) navigate("/courses");
  }, []);

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
              Add new lecture
            </h1>
          </header>
          <div className="w-full flex md:flex-row md:justify-between justify-center flex-col md:gap-0 gap-5">
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* lecture video */}
              <div className="border border-gray-300 h-[200px] flex justify-center cursor-pointer">
                {userInput.videoSrc ? (
                  <video
                    muted
                    src={userInput.videoSrc}
                    controls
                    controlsList="nodownload nofullscreen"
                    disablePictureInPicture
                    className="object-fill w-full"
                    onClick={() => videoRef.current.click()}
                  ></video>
                ) : (
                  <label
                    className="font-[500] text-xl h-full w-full flex justify-center items-center cursor-pointer font-lato"
                    htmlFor="lecture"
                  >
                    Choose Your Video
                  </label>
                )}
                <input
                  type="file"
                  className="hidden"
                  id="lecture"
                  ref={videoRef}
                  name="lecture"
                  onChange={handleVideo}
                  accept="video/mp4, video/x-mp4, video/*"
                />
              </div>

              {/* PDF upload */}
              <div 
                className="border border-gray-300 p-4 rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => pdfRef.current.click()}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUpload className="text-2xl text-gray-600" />
                  <span className="font-medium">
                    {userInput.pdfName || "Upload PDF Materials (Optional)"}
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={pdfRef}
                  onChange={handlePDF}
                  accept=".pdf"
                />
              </div>
            </div>
            <div className="md:w-[48%] w-full flex flex-col gap-5">
              {/* title */}
              <InputBox
                label={"Title"}
                name={"title"}
                type={"text"}
                placeholder={"Enter Lecture Title"}
                onChange={handleInputChange}
                value={userInput.title}
              />
                    <InputBox
                label={"Link"}
                name={"link"}
                type={"text"}
                placeholder={"Enter Link for pdf"}
                onChange={handleInputChange}
                value={userInput.link}
              />
              {/* description */}
              <TextArea
                label={"Description"}
                name={"description"}
                rows={5}
                type={"text"}
                placeholder={"Enter Lecture Description"}
                onChange={handleInputChange}
                value={userInput.description}
              />
          
            </div>
            </div>
            <div className="w-full mt-5">
            <h2 className="text-xl font-bold mb-4">MCQ Questions</h2>
            {userInput.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-8 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-500"
                  >
                    <AiOutlineMinusCircle className="text-xl" />
                  </button>
                </div>

                {/* Question Text */}
                <TextArea
                  label="Question Text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                  placeholder="Enter your question"
                  className="mb-4"
                />

                {/* Options */}
                <div className="ml-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        className="text-red-500"
                      >
                        <AiOutlineMinusCircle />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="text-green-500 flex items-center gap-1 mt-2"
                  >
                    <AiOutlinePlusCircle /> Add Option
                  </button>
                </div>

                {/* Correct Option */}
                <div className="mt-4">
                  <label className="block mb-2">Correct Option:</label>
                  <select
                    value={question.correctOption}
                    onChange={(e) => handleQuestionChange(questionIndex, 'correctOption', e.target.value)}
                    className="p-2 border rounded"
                  >
                    {question.options.map((_, index) => (
                      <option key={index} value={index}>
                        Option {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Explanation */}
                <TextArea
                  label="Explanation (Optional)"
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                  placeholder="Explain the correct answer"
                  className="mt-4"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-2 bg-green-500 text-white rounded-md flex items-center justify-center gap-2"
            >
              <AiOutlinePlusCircle /> Add New Question
            </button>
          </div>

          {/* submit btn */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 bg-yellow-500 text-white dark:text-base-200 transition-all ease-in-out duration-300 rounded-md py-2 font-nunito-sans font-[500] text-lg cursor-pointer"
          >
            {isLoading ? "Adding Lecture..." : "Add New Lecture"}
          </button>
        </form>
      </section>



    </Layout>
  );
}