import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbHelper } from '../config/database.js';
const JWT_SECRET = process.env.JWT_SECRET || 'bloodconnect_super_secret_jwt_key_2026_production';
export const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { name, email, phone, password, role = 'patient', blood_group, date_of_birth, gender, city, state, address, latitude, longitude, last_donation_date, available = 1, hospital_name, bank_name } = req.body;
            if (!name || !email || !phone || !password) {
                return res.status(400).json({ success: false, message: 'Name, email, phone, and password are required.' });
            }
            // Check if email already exists
            const existingUser = dbHelper.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
            if (existingUser) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const userRole = role.toLowerCase().replace(/[^a-z_]/g, '');
            const userInsert = dbHelper.run(`INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`, [name.trim(), email.toLowerCase().trim(), phone.trim(), passwordHash, userRole]);
            const userId = Number(userInsert.lastInsertRowid);
            // If user is a donor, create donor_profile
            if (userRole === 'donor' && blood_group) {
                dbHelper.run(`INSERT INTO donor_profiles (
             user_id, blood_group, date_of_birth, gender, city, state, address,
             latitude, longitude, last_donation_date, available, verified, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`, [
                    userId,
                    blood_group,
                    date_of_birth || null,
                    gender || null,
                    city || 'Vijayawada',
                    state || 'Andhra Pradesh',
                    address || '',
                    latitude || 16.5062,
                    longitude || 80.6480,
                    last_donation_date || null,
                    available ? 1 : 0
                ]);
            }
            else if (userRole === 'hospital') {
                dbHelper.run(`INSERT INTO hospitals (user_id, name, email, phone, address, city, state, latitude, longitude, verified, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`, [
                    userId,
                    hospital_name || name,
                    email.toLowerCase().trim(),
                    phone.trim(),
                    address || 'Main Road',
                    city || 'Vijayawada',
                    state || 'Andhra Pradesh',
                    latitude || 16.5062,
                    longitude || 80.6480
                ]);
            }
            else if (userRole === 'blood_bank') {
                dbHelper.run(`INSERT INTO blood_banks (user_id, name, email, phone, address, city, state, latitude, longitude, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`, [
                    userId,
                    bank_name || name,
                    email.toLowerCase().trim(),
                    phone.trim(),
                    address || 'Red Cross Centre',
                    city || 'Vijayawada',
                    state || 'Andhra Pradesh',
                    latitude || 16.5062,
                    longitude || 80.6480
                ]);
            }
            const token = jwt.sign({ id: userId, email: email.toLowerCase().trim(), role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({
                success: true,
                message: 'Account registered successfully.',
                token,
                user: {
                    id: userId,
                    name,
                    email: email.toLowerCase().trim(),
                    phone,
                    role: userRole,
                    blood_group: blood_group || null
                }
            });
        }
        catch (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
        }
    },
    // Login
    login: async (req, res) => {
        try {
            const { emailOrPhone, password } = req.body;
            if (!emailOrPhone || !password) {
                return res.status(400).json({ success: false, message: 'Email/Phone and password are required.' });
            }
            const identifier = emailOrPhone.trim().toLowerCase();
            const user = dbHelper.get('SELECT * FROM users WHERE LOWER(email) = ? OR phone = ?', [identifier, identifier]);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
            }
            // Fetch donor profile or hospital details if present
            let donorProfile = null;
            if (user.role === 'donor') {
                donorProfile = dbHelper.get('SELECT * FROM donor_profiles WHERE user_id = ?', [user.id]);
            }
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    avatar_url: user.avatar_url,
                    donorProfile
                }
            });
        }
        catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
        }
    },
    // Get current authenticated user
    getMe: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = dbHelper.get('SELECT id, name, email, phone, role, avatar_url, created_at FROM users WHERE id = ?', [req.user.id]);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            let donorProfile = null;
            let hospitalProfile = null;
            if (user.role === 'donor') {
                donorProfile = dbHelper.get('SELECT * FROM donor_profiles WHERE user_id = ?', [user.id]);
            }
            else if (user.role === 'hospital') {
                hospitalProfile = dbHelper.get('SELECT * FROM hospitals WHERE user_id = ?', [user.id]);
            }
            return res.json({
                success: true,
                user: {
                    ...user,
                    donorProfile,
                    hospitalProfile
                }
            });
        }
        catch (err) {
            console.error('getMe error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching user.', error: err.message });
        }
    },
    // Logout (client side clears token, server sends success)
    logout: async (_req, res) => {
        return res.json({ success: true, message: 'Logged out successfully' });
    }
};
