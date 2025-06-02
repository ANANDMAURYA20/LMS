import AppError from "../utils/error.utils.js";
import jwt from "jsonwebtoken";
import userModel from '../models/user.model.js';
import courseModel from '../models/course.model.js';


const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError("Unauthenticated, please login again", 400))
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;

    next();
}

// authorised roles
const authorisedRoles = (...roles) => async (req, res, next) => {
    const currentUserRoles = req.user.role;
    if (!roles.includes(currentUserRoles)) {
        return next(new AppError("You do not have permission to access this routes", 403))
    }
    next();
}

// Add a new middleware to check if the instructor owns the course
const isInstructorCourse = async (req, res, next) => {
    try {
        const { id } = req.params; // Course ID
        const userId = req.user.id; // User ID from JWT

        // Skip this check for admins
        if (req.user.role === 'ADMIN') {
            return next();
        }

        // For instructors, verify they own the course
        if (req.user.role === 'INSTRUCTOR') {
            const course = await courseModel.findById(id);
            
            if (!course) {
                return next(new AppError('Course not found', 404));
            }
            
            // Check if the instructor is the owner of the course
            if (course.instructor.toString() !== userId) {
                return next(new AppError('You are not authorized to modify this course', 403));
            }
            
            next();
        } else {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const authorizeSubscriber = async (req, res, next) => {
    const {role, id} = req.user; 
    const user = await userModel.findById(id);
    const subscriptionStatus = user.subscription.status;
    if (role !== 'ADMIN' && role !== 'INSTRUCTOR' && subscriptionStatus !== 'active') {
        return next(
            new AppError('Please subscribe to access this route!', 403)
        )
    }

    next();
}

export {
    isLoggedIn,
    authorisedRoles,
    authorizeSubscriber,
    isInstructorCourse
}