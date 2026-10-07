import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initDatabaseSchema, dbHelper } from './config/database.js';
import { seedDatabase } from './db/seedData.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
// API Health Check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        system: 'BloodConnect API Server',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api', matchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/notifications', notificationRoutes);
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Server Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
// Initialize database schema and auto-seed if empty
async function bootstrap() {
    try {
        initDatabaseSchema();
        const userCount = dbHelper.get('SELECT COUNT(*) as count FROM users')?.count || 0;
        if (userCount === 0) {
            console.log('Database empty. Running initial seed...');
            await seedDatabase();
        }
        app.listen(PORT, () => {
            console.log(`\n======================================================`);
            console.log(`🩸 BloodConnect API Server running on port ${PORT}`);
            console.log(`📡 URL: http://localhost:${PORT}`);
            console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`======================================================\n`);
        });
    }
    catch (error) {
        console.error('Failed to start BloodConnect Server:', error);
        process.exit(1);
    }
}
bootstrap();
