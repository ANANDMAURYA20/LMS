import { Router } from "express";
const router = Router();
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, deleteCourseLecture, updateCourseLecture } from '../controllers/course.controller.js'
import { isLoggedIn, authorisedRoles, authorizeSubscriber, isInstructorCourse } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js"; 

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn, 
        authorisedRoles('ADMIN', 'INSTRUCTOR'), 
        upload.single("thumbnail"), 
        createCourse
    );

router.route('/:id')
    .get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId)
    .put(
        isLoggedIn, 
        authorisedRoles('ADMIN', 'INSTRUCTOR'),
        isInstructorCourse,
        upload.single("thumbnail"),
        updateCourse
    )
    .delete(
        isLoggedIn, 
        authorisedRoles('ADMIN', 'INSTRUCTOR'),
        isInstructorCourse,
        removeCourse
    );

router.route('/:id/lectures')
    .post(
        isLoggedIn,
        authorisedRoles('ADMIN', 'INSTRUCTOR'),
        isInstructorCourse,
        upload.fields([
            { name: 'lecture', maxCount: 1 },
            { name: 'materials', maxCount: 1 }
        ]),
        addLectureToCourseById
    );

router.route('/:courseId/lectures/:lectureId')
    .delete(
        isLoggedIn,
        authorisedRoles('ADMIN', 'INSTRUCTOR'),
        isInstructorCourse,
        deleteCourseLecture
    )
    .put(
        isLoggedIn,
        authorisedRoles('ADMIN', 'INSTRUCTOR'),
        isInstructorCourse,
        upload.single("lecture"),
        updateCourseLecture
    );

export default router;