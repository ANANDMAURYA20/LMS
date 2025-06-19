import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be at least 8 character'],
        maxLength: [59, 'Title should be less than 60 character'],
        trim: true
    },
    description: {
        type: String,
        required: true,
        minLength: [8, 'Description must be at least 8 character'],
        maxLength: [500, 'Description should be less than 500 character'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    thumbnail: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    approvalStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    rejectionReason: {
        type: String,
        default: null
    },
    lectures: [
        {
            title: String,
            description: String,
            link: String,
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
            questions: [
                {
                    questionText: {
                        type: String,
                    },
                    options: [{
                        type: String,
                    }],
                    correctOption: {
                        type: Number,
                    },
                }
            ],
            approvalStatus: {
                type: String,
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                default: 'PENDING'
            },
            rejectionReason: {
                type: String,
                default: null
            }
        }
    ],
    numberOfLectures: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Add student tracking
    enrolledStudents: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        lastAccessed: {
            type: Date,
            default: Date.now
        },
        completedLectures: [{
            lecture: {
                type: Number,  // Index of the lecture in the lectures array
                required: true
            },
            completedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    totalEnrollments: {
        type: Number,
        default: 0
    },
    activeStudents: {
        type: Number,
        default: 0,
        get: function() {
            // Count students who accessed the course in the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return this.enrolledStudents.filter(student => 
                student.lastAccessed >= thirtyDaysAgo
            ).length;
        }
    }
},
{
    timestamps: true,
    toJSON: { getters: true }
});

const Course = model("Course", courseSchema);

export default Course