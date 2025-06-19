import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctOption: {
        type: Number,
        required: true
    }
});

const lectureRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [8, 'Title must be at least 8 characters'],
        maxlength: [60, 'Title cannot exceed 60 characters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lecture: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    materials: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    questions: [questionSchema],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

const LectureRequest = mongoose.model('LectureRequest', lectureRequestSchema);

export default LectureRequest; 