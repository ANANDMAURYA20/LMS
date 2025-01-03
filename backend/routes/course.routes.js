import { Router } from "express";
const router = Router();
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, deleteCourseLecture, updateCourseLecture } from '../controllers/course.controller.js'
import { isLoggedIn, authorisedRoles, authorizeSubscriber } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js"; 

router.route('/')
    .get(getAllCourses)
    .post(isLoggedIn, authorisedRoles('ADMIN'), upload.single("thumbnail"), createCourse)
    .delete(isLoggedIn, authorisedRoles('ADMIN'), deleteCourseLecture)
    .put(isLoggedIn, authorisedRoles('ADMIN'), upload.single("lecture"), updateCourseLecture)

router.route('/:id')
    .get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId)
    .put(isLoggedIn, authorisedRoles("ADMIN"), upload.single("thumbnail"), updateCourse)
    .delete(isLoggedIn, authorisedRoles('ADMIN'), removeCourse)
    router.post('/:id', upload.fields([
        { name: 'lecture', maxCount: 1 },
        { name: 'pdf', maxCount: 1 }
    ]), addLectureToCourseById);

export default router