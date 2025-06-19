import Course from "../models/course.model.js";
import CourseRequest from "../models/courseRequest.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";

// Get all courses created by the instructor
export const getInstructorCourses = async (req, res, next) => {
  try {
    // If admin, get all courses, otherwise get instructor's courses
    const courses =
      req.user.role === "ADMIN"
        ? await Course.find({}).populate(
            "enrolledStudents.student",
            "name email"
          )
        : await Course.find({ instructor: req.user.id }).populate(
            "enrolledStudents.student",
            "name email"
          );

    if (!courses || courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses found",
        courses: [],
      });
    }

    // Process each course to include student statistics
    const coursesWithStats = courses.map((course) => {
      const courseObj = course.toObject();

      // Calculate total enrollments (total number of enrolled students)
      courseObj.totalEnrollments = course.enrolledStudents?.length || 0;

      // Calculate active students (accessed in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeStudents = course.enrolledStudents?.filter((student) => {
        const lastAccessed = new Date(student.lastAccessed);
        return lastAccessed >= thirtyDaysAgo;
      });

      courseObj.activeStudents = activeStudents?.length || 0;
      courseObj.inactiveStudents =
        courseObj.totalEnrollments - courseObj.activeStudents;

      // Add enrolled students details
      courseObj.studentDetails = course.enrolledStudents.map((enrollment) => ({
        student: enrollment.student,
        enrolledAt: enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed,
        completedLectures: enrollment.completedLectures?.length || 0,
        isActive: new Date(enrollment.lastAccessed) >= thirtyDaysAgo,
      }));

      return courseObj;
    });

    // Log for debugging
    console.log(
      "Processed courses with stats:",
      coursesWithStats.map((c) => ({
        id: c._id,
        title: c.title,
        totalEnrollments: c.totalEnrollments,
        activeStudents: c.activeStudents,
        inactiveStudents: c.inactiveStudents,
      }))
    );

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: coursesWithStats,
    });
  } catch (error) {
    console.error("Error in getInstructorCourses:", error);
    return next(new AppError("Failed to fetch courses", 500));
  }
};

export const getInstructorStats = async (req, res, next) => {
  try {
    let stats;

    if (req.user.role === "ADMIN") {
      // For admin, get total stats across all courses
      const totalCourses = await Course.countDocuments({});
      const allCourses = await Course.find({})
        .select("numberOfLectures enrolledStudents")
        .populate("enrolledStudents.student", "name email");

      const totalLectures = allCourses.reduce(
        (acc, course) => acc + (course.numberOfLectures || 0),
        0
      );

      // Calculate total and active students
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let totalStudents = 0;
      let activeStudents = 0;
      let inactiveStudents = 0;

      // Get unique students across all courses
      const uniqueStudents = new Set();
      const activeStudentIds = new Set();

      allCourses.forEach((course) => {
        course.enrolledStudents.forEach((enrollment) => {
          const studentId = enrollment.student._id.toString();
          uniqueStudents.add(studentId);

          if (new Date(enrollment.lastAccessed) >= thirtyDaysAgo) {
            activeStudentIds.add(studentId);
          }
        });
      });

      totalStudents = uniqueStudents.size;
      activeStudents = activeStudentIds.size;
      inactiveStudents = totalStudents - activeStudents;

      stats = {
        totalCourses,
        totalLectures,
        totalStudents,
        activeStudents,
        inactiveStudents,
      };
    } else {
      // For instructor, get their own stats
      const totalCourses = await Course.countDocuments({
        instructor: req.user.id,
      });
      const courses = await Course.find({ instructor: req.user.id })
        .select("numberOfLectures enrolledStudents")
        .populate("enrolledStudents.student", "name email");

      const totalLectures = courses.reduce(
        (acc, course) => acc + (course.numberOfLectures || 0),
        0
      );

      // Calculate total and active students
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get unique students across instructor's courses
      const uniqueStudents = new Set();
      const activeStudentIds = new Set();

      courses.forEach((course) => {
        course.enrolledStudents.forEach((enrollment) => {
          const studentId = enrollment.student._id.toString();
          uniqueStudents.add(studentId);

          if (new Date(enrollment.lastAccessed) >= thirtyDaysAgo) {
            activeStudentIds.add(studentId);
          }
        });
      });

      const totalStudents = uniqueStudents.size;
      const activeStudents = activeStudentIds.size;
      const inactiveStudents = totalStudents - activeStudents;

      stats = {
        totalCourses,
        totalLectures,
        totalStudents,
        activeStudents,
        inactiveStudents,
      };
    }

    // Log for debugging
    console.log("Calculated stats:", stats);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error in getInstructorStats:", error);
    return next(new AppError(error.message, 500));
  }
};

// Create a new course request
export const createCourseRequest = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const file = req.file;
    if (!file) {
      return next(new AppError("Please upload thumbnail", 400));
    }

    // Upload file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "course_thumbnails",
    });

    // Validate required fields
    if (!title || !description || !category) {
      return next(new AppError("Please provide all required fields", 400));
    }

    // Create course request
    const courseRequest = await CourseRequest.create({
      title,
      description,
      category,
      instructor: req.user.id,
      thumbnail: result.secure_url,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Course request created successfully",
      courseRequest,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Get instructor's course requests
export const getInstructorCourseRequests = async (req, res, next) => {
  try {
    const requests = await CourseRequest.find({ instructor: req.user.id }).sort(
      "-createdAt"
    );

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch course requests", 500));
  }
};
