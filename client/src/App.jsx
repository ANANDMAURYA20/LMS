import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import CourseRequestForm from "./Pages/Course/CourseRequestForm";
import LectureRequestForm from "./Pages/Course/LectureRequestForm";
import AddLectureForm from "./Pages/Course/AddLectureForm";
import Profile from "./Pages/User/Profile";
import Checkout from "./Pages/Payment/Checkout";
import CheckoutSuccess from "./Pages/Payment/CheckoutSuccess";
import CheckoutFail from "./Pages/Payment/CheckoutFail";
import DisplayLecture from "./Pages/Dashboard/DisplayLecture";
// Remove this line
import AddLecture from "./Pages/Dashboard/AddLecture";
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import AdminApprovalDashboard from "./Pages/Dashboard/AdminApprovalDashboard";
import Userdata from "./Pages/Dashboard/Userdata";
import AdminUserEdit from "./Pages/Dashboard/AdminUserEdit"; 

import Blog from "./Pages/Blog";
import AddBlog from "./Pages/Dashboard/AddBlog";
import StudentScores from './Pages/Dashboard/StudentScores';
import ProgressDashboard from './Pages/Dashboard/ProgressDashboard';
import InstructorDashboard from './Pages/Dashboard/InstructorDashboard';
import EditCourse from './Pages/Course/EditCourse';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course/create" element={<Navigate to="/course/request" replace />} />
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

        <Route element={<RequireAuth allowedRoles={["INSTRUCTOR", "ADMIN"]} />}>
          <Route path="/instructor/courses" element={<InstructorDashboard />} />
          <Route path="/course/request" element={<CourseRequestForm />} />
          <Route path="/course/:courseId/lecture/request" element={<LectureRequestForm />} />
          <Route path="/course/:courseId/lecture/add" element={<AddLectureForm />} />
          <Route path="/course/edit/:courseId" element={<EditCourse />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["STUDENT", "ADMIN", "INSTRUCTOR"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/profile/change-password" element={<ChangePassword />}/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFail />} />
          <Route path="/courses/:courseId/lectures" element={<DisplayLecture />} />
          <Route path="/user/progress" element={<ProgressDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/scores" element={<StudentScores />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<AdminApprovalDashboard />} />
          <Route path="/admin/userdata" element={<Userdata />} />
          <Route path="/admin/addblog" element={<AddBlog />} />
          <Route path="/admin/users/:userId/edit" element={<AdminUserEdit />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;





