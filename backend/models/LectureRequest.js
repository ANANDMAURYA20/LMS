const mongoose = require('mongoose');

const LectureRequestSchema = new mongoose.Schema({
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    materials: [{
        title: String,
        fileUrl: String,
        type: String, // pdf, doc, etc.
    }],
    duration: {
        type: Number, // in minutes
        required: true,
    },
    order: {
        type: Number, // position in course
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminComment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('LectureRequest', LectureRequestSchema);