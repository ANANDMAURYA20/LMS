import axios from 'axios';
import AppError from '../utils/error.utils.js';

const generateQuestions = async (req, res, next) => {
    const { score, lectureTitle } = req.body;

    if (!lectureTitle) {
        return next(new AppError('Lecture title is required', 400));
    }

    const GEMINI_API_KEY = 'AIzaSyAO9bUM500OeaTpXuhoXw2ZafW0ivry9y8';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    try {
        const prompt = `Generate 10 multiple choice questions about "${lectureTitle}". 
            Each question should be formatted as a JSON object with the following structure:
            {
                "questions": [
                    {
                        "questionText": "What is...",
                        "options": ["option1", "option2", "option3", "option4"],
                        "correctOption": 0,
                        "explanation": "Explanation why this is correct"
                    }
                ]
            }
            Make questions suitable for someone who needs additional practice.`;

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from AI service');
        }

        // Parse the response and extract questions
        const generatedText = response.data.candidates[0].content.parts[0].text;
        
        // Clean the text to ensure it's valid JSON
        const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
        
        let questions;
        try {
            questions = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw AI Response:', cleanedText);
            throw new Error('Failed to parse AI response');
        }

        res.status(200).json({
            success: true,
            questions: questions.questions || questions // handle both possible response formats
        });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return next(new AppError(error.message || 'Failed to generate questions', 500));
    }
};

const analyzeStudentProgress = async (req, res, next) => {
    const userId = req.user.id;

    try {
        // Get all scores for the user
        const userScores = await Score.find({ userId })
            .populate('courseId')
            .sort({ attemptedAt: -1 });
        
        if (!userScores.length) {
            return res.status(200).json({
                success: true,
                analysis: {
                    summary: "You haven't attempted any quizzes yet. Start learning to see your progress!",
                    recommendations: ["Begin with introductory courses to build your foundation."]
                }
            });
        }

        const GEMINI_API_KEY = 'AIzaSyAO9bUM500OeaTpXuhoXw2ZafW0ivry9y8';
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        // Prepare data for AI analysis
        const scoreData = userScores.map(score => ({
            courseName: score.courseId.title,
            score: score.score,
            date: score.attemptedAt,
            questionsAttempted: score.questionsAttempted,
            correctAnswers: score.correctAnswers
        }));

        const prompt = `Analyze this student's learning progress based on their quiz scores:
            ${JSON.stringify(scoreData)}
            
            Provide a JSON response with the following structure:
            {
                "summary": "A brief 2-3 sentence summary of their overall performance",
                "strengths": ["List 2-3 areas where they're doing well"],
                "weaknesses": ["List 2-3 areas that need improvement"],
                "recommendations": ["Provide 3-4 specific recommendations to improve"],
                "progressTrend": "improving/declining/stable"
            }`;

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from AI service');
        }

        // Parse the response
        const generatedText = response.data.candidates[0].content.parts[0].text;
        const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
        
        let analysis;
        try {
            analysis = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Failed to parse AI response');
        }

        res.status(200).json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return next(new AppError(error.message || 'Failed to analyze progress', 500));
    }
};

const chatWithAI = async (req, res, next) => {
    const { message, lectureTitle } = req.body;

    if (!message) {
        return next(new AppError('Message is required', 400));
    }

    const GEMINI_API_KEY = 'AIzaSyAO9bUM500OeaTpXuhoXw2ZafW0ivry9y8';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

    try {
        const prompt = `You are a helpful learning assistant for an online course. 
            The current lecture is about "${lectureTitle || 'this topic'}".
            
            User question: ${message}
            
            Provide a helpful, concise, and educational response. If you don't know the specific answer based on the lecture title, 
            provide general educational guidance related to the topic. Keep your response under 150 words.`;

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from AI service');
        }

        const reply = response.data.candidates[0].content.parts[0].text;

        res.status(200).json({
            success: true,
            reply
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        return next(new AppError(error.message || 'Failed to get response from AI', 500));
    }
};

export { generateQuestions, analyzeStudentProgress, chatWithAI };

