import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseLectures,
  deleteCourseLecture,
} from "../../Redux/Slices/LectureSlice";
import Layout from "../../Layout/Layout";

export default function DisplayLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);

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

  // Function to handle PDF download
  const handlePdfDownload = (secure_url) => {
    // Open the PDF in a new window/tab which will trigger download
    window.open(secure_url, '_blank');
  };

  return (
    <Layout hideFooter={true} hideNav={true} hideBar={true}>
      <section className="flex flex-col gap-6 items-center md:py-8 py-0 px-0 h-screen overflow-y-scroll">
        <div className="flex flex-col dark:bg-base-100 relative md:gap-12 gap-5 rounded-lg md:py-10 md:pt-3 py-0 pt-3 md:px-7 px-0 md:w-[780px] w-full h-full overflow-y-hidden shadow-custom dark:shadow-xl">
          <h1 className="text-center relative md:px-0 px-3 w-fit dark:text-purple-500 md:text-2xl text-lg font-bold font-inter after:content-[' '] after:absolute after:-bottom-2 md:after:left-0 after:left-3 after:h-[3px] after:w-[60%] after:rounded-full after:bg-yellow-400 dark:after:bg-yellow-600">
            Course:{" "}
            <span className="text-violet-500 dark:text-yellow-500 font-nunito-sans">
              {state?.title}
            </span>
          </h1>
          <div className="flex md:flex-row flex-col md:justify-between w-full h-full">
            {/* Left section for lecture video and details */}
            <div className="md:w-[48%] w-full md:p-3 p-1 overflow-y-scroll md:h-full h-[40%] flex justify-center">
              <div className="w-full h-[170px] border bg-[#0000003d] shadow-lg">
                <video
                  src={lectures && lectures?.[currentVideo]?.lecture?.secure_url}
                  disablePictureInPicture
                  disableRemotePlayback
                  controls
                  controlsList="nodownload"
                  className="h-full mx-auto"
                ></video>
                <div className="py-7">
                  <h1 className="text-[17px] text-gray-700 font-[500] dark:text-white font-lato">
                    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
                      Title:{" "}
                    </span>
                    {lectures && lectures?.[currentVideo]?.title}
                  </h1>
                  <p className="text-[16.5px] pb-12 text-gray-700 font-[500] dark:text-slate-300 font-lato">
                    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
                      Description:{" "}
                    </span>
                    {lectures && lectures?.[currentVideo]?.description}
                  </p>
                  <p className="text-[16.5px] pb-12 text-gray-700 font-[500] dark:text-slate-300 font-lato">
                    
                  {lectures && lectures?.[currentVideo]?.link && (
  <p className="text-[16.5px] pb-12 text-gray-700 font-[500] dark:text-slate-300 font-lato">
    <span className="text-blue-500 dark:text-yellow-500 font-inter font-semibold text-lg">
      Download pdf:{" "}
    </span>
    <a href={lectures && lectures?.[currentVideo]?.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Show PDF</a>
  </p>
)}
                    
                  </p>
                </div>
              </div>
            </div>

            {/* Right section for lectures list and PDF materials */}
            <div className="md:w-[48%] pb-12 md:flex-row flex-col w-full md:h-full h-[60%] overflow-y-scroll">
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
                          onClick={() => setCurrentVideo(idx)}
                        >
                          <span className="font-inter">{idx + 1}. </span>
                          {lecture?.title}
                        </p>
                        
                        {/* PDF Download Button */}
                        {lecture?.materials?.secure_url && (
                          <button
                            onClick={() => handlePdfDownload(lecture.materials.secure_url)}
                            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white font-inter font-[500] text-sm w-fit flex items-center gap-2"
                          >
                            Download PDF
                          </button>
                        )}

                        {/* <a href="https://drive.google.com/file/d/13bpvjCJ5dFTqeG-WudgB8Pe4-r558ZX0/view?usp=sharing">Download pdf</a> */}
                        
                        {/* Admin Delete Button */}
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
      </section>
    </Layout>
  );
}