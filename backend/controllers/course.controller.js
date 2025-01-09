import courseModel from '../models/course.model.js'
import AppError from '../utils/error.utils.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

// get all courses
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseModel.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All courses',
            courses
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// get specific course
const getLecturesByCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await courseModel.findById(id)
        if (!course) {
            return next(new AppError('course not found', 500));
        }

        res.status(200).json({
            success: true,
            message: 'course',
            course
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// create course
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;

        if (!title || !description || !category || !createdBy) {
            return next(new AppError('All fields are required', 400));
        }

        const course = await courseModel.create({
            title,
            description,
            category,
            createdBy
        })

        if (!course) {
            return next(new AppError('Course could not created, please try again', 500));
        }

        // file upload
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'Learning-Management-System'
            })

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rmSync(`uploads/${req.file.filename}`);
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course successfully created',
            course
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// update course
const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await courseModel.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        )

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500));
        }

        if (req.file) {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);

            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'Learning-Management-System'
            })

            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;

                // Remove file from server
                fs.rmSync(`uploads/${req.file.filename}`);

            }

        }

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// remove course
const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await courseModel.findById(id);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 500));
        }

        await courseModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'course deleted successfully'
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

// add lecture to course by id
// const addLectureToCourseById = async (req, res, next) => {
//     try {
//         const { title, description } = req.body;
//         const { id } = req.params;

//         if (!title || !description) {
//             return next(new AppError('all fields are required', 500));
//         }

//         const course = await courseModel.findById(id);

//         if (!course) {
//             return next(new AppError('course with given id does not exist', 500));
//         }

//         const lectureData = {
//             title,
//             description,
//             lecture: {}
//         }

//         // file upload
//         if (req.file) {
//             try {
//                 const result = await cloudinary.v2.uploader.upload(req.file.path, {
//                     folder: 'Learning-Management-System',
//                     resource_type: "video"
//                 });
//                 if (result) {
//                     lectureData.lecture.public_id = result.public_id;
//                     lectureData.lecture.secure_url = result.secure_url;
//                 }

//                 fs.rmSync(`uploads/${req.file.filename}`);
//             } catch (e) {
//                  return next(new AppError(e.message, 500));
//             }
//         }

//         course.lectures.push(lectureData);
//         course.numberOfLectures = course.lectures.length;

//         await course.save();

//         res.status(200).json({
//             success: true,
//             message: 'lecture added successfully'
//         })

//     } catch (e) {
//          return next(new AppError(e.message, 500));
//     }
// }

// const addLectureToCourseById = async (req, res, next) => {
//     try {
//         const { title, description,link } = req.body;
//         const { id } = req.params;

//         if (!title || !description || !link) {
//             return next(new AppError('all fields are required', 500));
//         }

//         const course = await courseModel.findById(id);

//         if (!course) {
//             return next(new AppError('course with given id does not exist', 500));
//         }

//         const lectureData = {
//             title,
//             description,
//             link,
//             lecture: {},
//             materials: {}
//         }

//         // Video upload
//         if (req.files && req.files.lecture) {
//             try {
//                 const result = await cloudinary.v2.uploader.upload(req.files.lecture[0].path, {
//                     folder: 'Learning-Management-System',
//                     resource_type: "video"
//                 });
//                 if (result) {
//                     lectureData.lecture.public_id = result.public_id;
//                     lectureData.lecture.secure_url = result.secure_url;
//                 }

//                 fs.rmSync(`uploads/${req.files.lecture[0].filename}`);
//             } catch (e) {
//                 return next(new AppError(e.message, 500));
//             }
//         }

//         // PDF upload
//         if (req.files && req.files.pdf) {
//             try {
//                 const result = await cloudinary.v2.uploader.upload(req.files.pdf[0].path, {
//                     folder: 'Learning-Management-System',
//                     resource_type: "raw"
//                 });
//                 if (result) {
//                     lectureData.materials.public_id = result.public_id;
//                     lectureData.materials.secure_url = result.secure_url;
//                 }

//                 fs.rmSync(`uploads/${req.files.pdf[0].filename}`);
//             } catch (e) {
//                 return next(new AppError(e.message, 500));
//             }
//         }

//         course.lectures.push(lectureData);
//         course.numberOfLectures = course.lectures.length;

//         await course.save();

//         res.status(200).json({
//             success: true,
//             message: 'lecture added successfully'
//         })

//     } catch (e) {
//         return next(new AppError(e.message, 500));
//     }
// }



// delete lecture by course id and lecture id

const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description, link } = req.body;
        const { id } = req.params;

        // Parse questions from FormData
        let questions = [];
        if (req.body.questions) {
            try {
                questions = JSON.parse(req.body.questions);
            } catch (error) {
                return next(new AppError('Invalid questions format', 400));
            }
        }

        // Validate basic lecture details
        if (!title || !description || !link) {
            return next(new AppError('all fields are required', 500));
        }

        // Validate questions format if provided
        if (questions && questions.length > 0) {
            const isValidQuestions = questions.every(question => {
                return (
                    question.questionText && 
                    Array.isArray(question.options) &&
                    question.options.length >= 2 &&
                    typeof question.correctOption === 'number' &&
                    question.correctOption >= 0 && 
                    question.correctOption < question.options.length
                );
            });

            if (!isValidQuestions) {
                return next(new AppError('Invalid question format. Each question must have questionText, options array, and valid correctOption', 400));
            }
        }

        const course = await courseModel.findById(id);

        if (!course) {
            return next(new AppError('course with given id does not exist', 500));
        }

        const lectureData = {
            title,
            description,
            link,
            lecture: {},
            materials: {},
            questions // Add the parsed questions array
        }

        // Video upload
        if (req.files && req.files.lecture) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files.lecture[0].path, {
                    folder: 'Learning-Management-System',
                    resource_type: "video"
                });
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                fs.rmSync(`uploads/${req.files.lecture[0].filename}`);
            } catch (e) {
                return next(new AppError(e.message, 500));
            }
        }

        // PDF upload
        if (req.files && req.files.pdf) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files.pdf[0].path, {
                    folder: 'Learning-Management-System',
                    resource_type: "raw"
                });
                if (result) {
                    lectureData.materials.public_id = result.public_id;
                    lectureData.materials.secure_url = result.secure_url;
                }

                fs.rmSync(`uploads/${req.files.pdf[0].filename}`);
            } catch (e) {
                return next(new AppError(e.message, 500));
            }
        }

        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'lecture and questions added successfully'
        });

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}



const deleteCourseLecture = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.query;

        const course = await courseModel.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lectureIndex = course.lectures.findIndex(lecture => lecture._id.toString() === lectureId);

        if (lectureIndex === -1) {
            return next(new AppError('Lecture not found in the course', 404));
        }

        course.lectures.splice(lectureIndex, 1);

        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture deleted successfully'
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};


// update lecture by course id and lecture id
const updateCourseLecture = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.query;
        const { title, description } = req.body;

        if (!title || !description) {
            return next(new AppError('All fields are required', 400));
        }

        const course = await courseModel.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const lectureIndex = course.lectures.findIndex(lecture => lecture._id.toString() === lectureId);

        if (lectureIndex === -1) {
            return next(new AppError('Lecture not found in the course', 404));
        }

        const updatedLectureData = {
            title,
            description,
            lecture: {
                public_id: course.lectures[lectureIndex].lecture.public_id,
                secure_url: course.lectures[lectureIndex].lecture.secure_url
            }
        };

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'Learning-Management-System',
                    resource_type: "video"
                });
                if (result) {
                    updatedLectureData.lecture.public_id = result.public_id;
                    updatedLectureData.lecture.secure_url = result.secure_url;
                }

                // If there's an existing video, delete the old one from Cloudinary
                if (course.lectures[lectureIndex].lecture.public_id) {
                    await cloudinary.v2.uploader.destroy(course.lectures[lectureIndex].lecture.public_id);
                }

                fs.rmSync(`uploads/${req.file.filename}`);
            } catch (e) {
                return next(new AppError(e.message, 500));
            }
        }

        // Update the lecture details
        course.lectures[lectureIndex] = updatedLectureData;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture updated successfully'
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};









export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteCourseLecture,
    updateCourseLecture,
}