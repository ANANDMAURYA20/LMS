import Course from '../models/course.model.js';
import AppError from '../utils/error.utils.js';

// Get all courses created by the instructor
export const getInstructorCourses = async (req, res, next) => {
    try {
        // If admin, get all courses, otherwise get instructor's courses
        const courses = req.user.role === 'ADMIN' 
            ? await Course.find({})
            : await Course.find({ instructor: req.user.id });
        
        if (!courses || courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No courses found',
                courses: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            courses
        });
    } catch (error) {
        return next(new AppError('Failed to fetch courses', 500));
    }
};

export const getInstructorStats = async (req, res, next) => {
    try {
        let stats;
        
        if (req.user.role === 'ADMIN') {
            // For admin, get total stats across all courses
            const totalCourses = await Course.countDocuments({});
            const allCourses = await Course.find({}).select('numberOfLectures');
            const totalLectures = allCourses.reduce((acc, course) => acc + course.numberOfLectures, 0);
            
            stats = {
                totalCourses,
                totalLectures
            };
        } else {
            // For instructor, get their own stats
            const totalCourses = await Course.countDocuments({ instructor: req.user.id });
            const courses = await Course.find({ instructor: req.user.id }).select('numberOfLectures');
            const totalLectures = courses.reduce((acc, course) => acc + course.numberOfLectures, 0);
            
            stats = {
                totalCourses,
                totalLectures
            };
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};