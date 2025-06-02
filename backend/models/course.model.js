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
            ]
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
    }
},
    {
        timestamps: true
    })

const Course = model("Course", courseSchema);

export default Course