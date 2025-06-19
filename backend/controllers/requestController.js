const CourseRequest = require('../models/CourseRequest');
const LectureRequest = require('../models/LectureRequest');
const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

// Submit course request
exports.submitCourseRequest = async (req, res) => {
    try {
        const courseRequest = new CourseRequest({
            ...req.body,
            instructor: req.user._id
        });
        await courseRequest.save();
        res.status(201).json({ message: 'Course request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit lecture request
exports.submitLectureRequest = async (req, res) => {
    try {
        const lectureRequest = new LectureRequest({
            ...req.body,
            instructor: req.user._id
        });
        await lectureRequest.save();
        res.status(201).json({ message: 'Lecture request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pending course requests
exports.getPendingCourseRequests = async (req, res) => {
    try {
        const requests = await CourseRequest.find({ status: 'pending' })
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all pending lecture requests
exports.getPendingLectureRequests = async (req, res) => {
    try {
        const requests = await LectureRequest.find({ status: 'pending' })
            .populate('instructor', 'name email')
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle course request (approve/reject)
exports.handleCourseRequest = async (req, res) => {
    try {
        const { requestId, action, comment } = req.body;
        const request = await CourseRequest.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = action;
        request.adminComment = comment;
        await request.save();

        if (action === 'approved') {
            const course = new Course({
                title: request.title,
                description: request.description,
                category: request.category,
                price: request.price,
                estimatedHours: request.estimatedHours,
                level: request.level,
                whatYouWillLearn: request.whatYouWillLearn,
                whoIsThisCourseFor: request.whoIsThisCourseFor,
                requirements: request.requirements,
                thumbnail: request.thumbnail,
                instructor: request.instructor
            });
            await course.save();
        }

        res.json({ message: `Course request ${action}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle lecture request (approve/reject)
exports.handleLectureRequest = async (req, res) => {
    try {
        const { requestId, action, comment } = req.body;
        const request = await LectureRequest.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = action;
        request.adminComment = comment;
        await request.save();

        if (action === 'approved') {
            const lecture = new Lecture({
                title: request.title,
                description: request.description,
                videoUrl: request.videoUrl,
                materials: request.materials,
                duration: request.duration,
                order: request.order,
                course: request.course,
                instructor: request.instructor
            });
            await lecture.save();
        }

        res.json({ message: `Lecture request ${action}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};