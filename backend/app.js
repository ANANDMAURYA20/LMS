import { configDotenv } from 'dotenv';
configDotenv();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'; 
import courseRoutes from './routes/course.routes.js'; 
import paymentRoutes from './routes/payment.routes.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import express from 'express';
import connectToDb from './config/db.config.js';
import errorMiddleware from './middleware/error.middleware.js';
import blogRoutes from './routes/blog.routes.js'

const app = express();

const CLIENT_URLS = process.env.CLIENT_URL
console.log(CLIENT_URLS)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: CLIENT_URLS,
    methods: ['GET', 'POST','DELETE','PUT'], 
    credentials: true, 
}));


app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/courses', courseRoutes); 
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/', miscellaneousRoutes);

 

// app.all('*', (req, res) => {
//     res.status(404).send('OOPS!! 404 page not found');
// })

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use(errorMiddleware);

// db init
connectToDb();

export default app;