import express from 'express';


const adminRouter = express.Router();

// Admin routes go here
adminRouter.get('/dashboard', (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

export default adminRouter;