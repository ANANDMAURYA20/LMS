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
            createdBy,
            instructor: req.user.id // Associate course with the instructor
        })

        if (!course) {
            return next(new AppError('Course could not be created, please try again', 500));
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
const addLectureToCourseById = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const { title, description, link, questions } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new AppError('Title and description are required', 400));
        }

        console.log('Finding course with ID:', id);
        const course = await courseModel.findById(id);

        if (!course) {
            return next(new AppError('Course with given id does not exist', 404));
        }

        const lectureData = {
            title,
            description,
            link: link || '',
            lecture: {},
            materials: {},
            questions: []
        };

        // Parse questions if they exist
        if (questions) {
            try {
                lectureData.questions = JSON.parse(questions);
            } catch (error) {
                console.error('Error parsing questions:', error);
                return next(new AppError('Invalid questions format', 400));
            }
        }

        // Upload lecture video
        if (req.files && req.files.lecture && req.files.lecture[0]) {
            try {
                console.log('Uploading lecture video...');
                const result = await cloudinary.v2.uploader.upload(req.files.lecture[0].path, {
                    folder: 'Learning-Management-System',
                    resource_type: "video",
                    chunk_size: 20000000, // Increased to 20MB chunks
                    timeout: 600000, // 10 minutes timeout
                    eager_async: true,
                    eager_notification_url: null
                });
                
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                // Remove the temporary file after successful upload
                if (fs.existsSync(req.files.lecture[0].path)) {
                    fs.rmSync(req.files.lecture[0].path);
                }
                console.log('Lecture video uploaded successfully');
            } catch (error) {
                // Clean up temporary file in case of error
                if (fs.existsSync(req.files.lecture[0].path)) {
                    fs.rmSync(req.files.lecture[0].path);
                }
                console.error('Error uploading lecture video:', error);
                return next(new AppError(`Error uploading lecture video: ${error.message}`, 500));
            }
        } else {
            console.log('No lecture video file provided');
            return next(new AppError('Lecture video is required', 400));
        }

        // Upload materials (if any)
        if (req.files && req.files.materials && req.files.materials[0]) {
            try {
                console.log('Uploading materials...');
                const result = await cloudinary.v2.uploader.upload(req.files.materials[0].path, {
                    folder: 'Learning-Management-System',
                    resource_type: 'auto'
                });
                
                if (result) {
                    lectureData.materials.public_id = result.public_id;
                    lectureData.materials.secure_url = result.secure_url;
                }

                fs.rmSync(req.files.materials[0].path);
                console.log('Materials uploaded successfully');
            } catch (error) {
                console.error('Error uploading materials:', error);
                // Don't return error for materials as they're optional
                // Just log the error and continue
            }
        }

        console.log('Adding lecture to course...');
        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();
        console.log('Course saved successfully');

        res.status(200).json({
            success: true,
            message: 'Lecture added successfully',
            course
        });

    } catch (error) {
        console.error('Error in addLectureToCourseById:', error);
        // Clean up uploaded files if they exist
        if (req.files) {
            if (req.files.lecture && req.files.lecture[0]) {
                fs.unlink(req.files.lecture[0].path, (err) => {
                    if (err) console.error('Error deleting lecture file:', err);
                });
            }
            if (req.files.materials && req.files.materials[0]) {
                fs.unlink(req.files.materials[0].path, (err) => {
                    if (err) console.error('Error deleting materials file:', err);
                });
            }
        }
        return next(new AppError(error.message || 'Error adding lecture', 500));
    }
};

// delete lecture by course id and lecture id
const deleteCourseLecture = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.params;
        console.log('Deleting lecture:', { courseId, lectureId });

        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        // Find the lecture
        const lectureIndex = course.lectures.findIndex(
            lecture => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return next(new AppError('Lecture not found', 404));
        }

        const lecture = course.lectures[lectureIndex];

        // Delete video from Cloudinary if it exists
        if (lecture.lecture && lecture.lecture.public_id) {
            try {
                await cloudinary.v2.uploader.destroy(lecture.lecture.public_id, {
                    resource_type: 'video'
                });
            } catch (error) {
                console.error('Error deleting video from Cloudinary:', error);
            }
        }

        // Delete materials from Cloudinary if they exist
        if (lecture.materials && lecture.materials.public_id) {
            try {
                await cloudinary.v2.uploader.destroy(lecture.materials.public_id);
            } catch (error) {
                console.error('Error deleting materials from Cloudinary:', error);
            }
        }

        // Remove the lecture from the course
        course.lectures.splice(lectureIndex, 1);
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteCourseLecture:', error);
        return next(new AppError(error.message || 'Error deleting lecture', 500));
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