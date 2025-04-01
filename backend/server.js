import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import adminRouter from './routes/adminRoute.js'; 
import appointmentRouter from './routes/appointmentRoute.js';
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectDB()
app.use('/api/admin', adminRouter); 
app.use('/api/appointment', appointmentRouter);
app.use('/api/user', userRouter); 
app.use('/api/doctor', doctorRouter);
app.get('/', (req, res) => {
    res.send('API WORKING')
  });
  
  app.listen(port, () => console.log("Server Started", port))