import { dbHelper } from '../config/database.js';
export const notificationController = {
    // Get notifications for logged in user
    getUserNotifications: async (req, res) => {
        try {
            const userId = req.user ? req.user.id : 1;
            const notifications = dbHelper.all(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30`, [userId]);
            const unreadCount = dbHelper.get(`SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`, [userId])?.count || 0;
            return res.json({
                success: true,
                unreadCount,
                notifications: notifications.map(n => ({
                    ...n,
                    is_read: Boolean(n.is_read)
                }))
            });
        }
        catch (err) {
            console.error('getUserNotifications error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching notifications.' });
        }
    },
    // Mark notification as read
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user ? req.user.id : 1;
            dbHelper.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
            return res.json({ success: true, message: 'Notification marked as read.' });
        }
        catch (err) {
            console.error('markAsRead error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating notification.' });
        }
    },
    // Mark all as read
    markAllAsRead: async (req, res) => {
        try {
            const userId = req.user ? req.user.id : 1;
            dbHelper.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
            return res.json({ success: true, message: 'All notifications marked as read.' });
        }
        catch (err) {
            console.error('markAllAsRead error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating notifications.' });
        }
    }
};
