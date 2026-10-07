import { dbHelper } from '../config/database.js';
export const notificationService = {
    create: ({ userId, title, message, type = 'system', link = '' }) => {
        try {
            const result = dbHelper.run(`INSERT INTO notifications (user_id, title, message, type, link, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, 0, datetime('now'))`, [userId, title, message, type, link]);
            return result;
        }
        catch (err) {
            console.error('Failed to create notification:', err);
            return null;
        }
    },
    notifyRole: (role, title, message, type = 'system', link = '') => {
        try {
            const users = dbHelper.all(`SELECT id FROM users WHERE role = ?`, [role]);
            for (const u of users) {
                notificationService.create({
                    userId: u.id,
                    title,
                    message,
                    type,
                    link
                });
            }
        }
        catch (err) {
            console.error('Failed to notify role:', err);
        }
    },
    notifyEmergency: (requestId, bloodGroup, hospitalName, city) => {
        try {
            // Find all compatible donors in the city or general donors
            const donors = dbHelper.all(`SELECT u.id as user_id FROM donor_profiles d
         JOIN users u ON d.user_id = u.id
         WHERE d.available = 1`);
            for (const d of donors) {
                notificationService.create({
                    userId: d.user_id,
                    title: `🚨 EMERGENCY: ${bloodGroup} Blood Needed`,
                    message: `Urgent requirement for ${bloodGroup} blood at ${hospitalName}, ${city}. Please check if you can donate!`,
                    type: 'emergency',
                    link: `/donor/requests`
                });
            }
        }
        catch (err) {
            console.error('Failed to send emergency notification:', err);
        }
    }
};
