import React from "react";

import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AboutUs from "./Pages/About";
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ChangePassword from "./Pages/Password/ChangePassword"
import ForgotPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import CourseList from "./Pages/Course/CourseList";
import Contact from "./Pages/Contact";
import Denied from "./Pages/Denied";
import CourseDescription from "./Pages/Course/CourseDescription";
import EmailVerification from "./Pages/EmailVerification";
import ResendVerification from "./Pages/ResendVerification";

import RequireAuth from "./Components/auth/RequireAuth";
import CreateCourse from "./Pages/Course/CreateCourse";
import Profile from "./Pages/User/Profile";
import Checkout from "./Pages/Payment/Checkout";
import CheckoutSuccess from "./Pages/Payment/CheckoutSuccess";
import CheckoutFail from "./Pages/Payment/CheckoutFail";
import DisplayLecture from "./Pages/Dashboard/DisplayLecture";
import AddLecture from "./Pages/Dashboard/AddLecture";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import Userdata from "./Pages/Dashboard/Userdata";
import AdminUserEdit from "./Pages/Dashboard/AdminUserEdit"; 


import Blog from "./Pages/Blog";
import AddBlog from "./Pages/Dashboard/AddBlog";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
       <Route path="/resend-verification" element={<ResendVerification />} />

          <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/user/profile/reset-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/user/profile/reset-password/:resetToken"
          element={<ResetPassword />}
        />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/description" element={<CourseDescription />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/userdata" element={<Userdata />} />
          <Route path="/admin/addblog" element={<AddBlog />} />
          <Route path="/admin/users/:userId/edit" element={<AdminUserEdit />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route
            path="/user/profile/change-password"
            element={<ChangePassword />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFail />} />
          <Route path="/course/displaylectures" element={<DisplayLecture />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;



// import React from 'react'
// import logo from '../src/assets/images/logo.png'

// function App() {
//   return (
//     <div>
//       <div className="h-screen w-full flex justify-center items-center bg-purple-500">
//   <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
//     <img src={logo} alt="" />
//     <h2 className="text-3xl font-bold text-gray-900">We're Currently Under Maintenance</h2>
//     <p className="text-lg text-gray-600">We apologize for the inconvenience. Our team is working hard to get everything available.</p>
//     <div className="flex justify-center mt-6">
//       <a href="#" className="px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600">Contact Developer</a>
//     </div>
//   </div>
// </div>
//     </div>
//   )
// }

// export default App
