import Score from '../models/score.model.js';
import AppError from '../utils/error.utils.js';
import Course from '../models/course.model.js';

// Save score
export const saveScore = async (req, res, next) => {
    try {
        const { courseId, lectureId, score, questionsAttempted, correctAnswers } = req.body;
        const userId = req.user.id;

        if (!courseId || !lectureId || score === undefined) {
            return next(new AppError('Missing required fields', 400));
        }

        const scoreRecord = await Score.create({
            userId,
            courseId,
            lectureId,
            score,
            questionsAttempted,
            correctAnswers
        });

        res.status(201).json({
            success: true,
            message: 'Score saved successfully',
            scoreRecord
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Get all scores (for admin)
export const getAllScores = async (req, res, next) => {
    try {
        const scores = await Score.find()
            .populate('userId', 'fullName email')
            .populate('courseId', 'title')
            .sort('-attemptedAt');

        // Get lecture titles
        const scoresWithLectureTitles = await Promise.all(
            scores.map(async (score) => {
                const course = await Course.findById(score.courseId);
                const lecture = course.lectures.find(l => l._id.toString() === score.lectureId);
                return {
                    ...score.toObject(),
                    lectureTitle: lecture ? lecture.title : 'Unknown Lecture'
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Scores fetched successfully',
            scores: scoresWithLectureTitles
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// Get scores by user ID
export const getUserScores = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user.id;
        const scores = await Score.find({ userId })
            .populate('courseId', 'title')
            .sort('-attemptedAt');

        res.status(200).json({
            success: true,
            message: 'User scores fetched successfully',
            scores
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
