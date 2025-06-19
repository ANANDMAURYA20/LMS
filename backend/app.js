import { configDotenv } from 'dotenv';
configDotenv();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import multer from 'multer';
import userRoutes from './routes/user.routes.js'; 
import courseRoutes from './routes/course.routes.js'; 
import paymentRoutes from './routes/payment.routes.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import instructorRoutes from './routes/instructor.routes.js';
import express from 'express';
import connectToDb from './config/db.config.js';
import errorMiddleware from './middleware/error.middleware.js';
import blogRoutes from './routes/blog.routes.js';
import scoreRoutes from './routes/score.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';
import requestRoutes from './routes/request.routes.js';
import fs from 'fs';

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'];

console.log('Allowed Origins:', ALLOWED_ORIGINS);

// Configure multer for handling file uploads
const upload = multer({
    dest: 'uploads/'
});
//debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Configure CORS
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'], 
    credentials: true,
}));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// API Routes
app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/courses', courseRoutes); 
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1', miscellaneousRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/scores', scoreRoutes);
app.use('/api/v1/instructor', instructorRoutes);
app.use('/api/v1/admin', adminRoutes);

// Debug log before mounting request routes
console.log('Mounting request routes at /api/v1/request');
app.use('/api/v1/request', requestRoutes);

// Debug middleware to catch unmatched routes
app.use((req, res, next) => {
    console.log(`No route matched for ${req.method} ${req.url}`);
    next();
});

// 404 handler
app.all('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).send('OOPS!!! 404 Page Not Found');
});

// Health check route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use(errorMiddleware);

// db init
connectToDb();

export default app;



