import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lectureId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    questionsAttempted: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    }
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;
