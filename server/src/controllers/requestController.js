import { dbHelper } from '../config/database.js';
import { computeSmartDonorMatches } from '../services/matchingService.js';
import { notificationService } from '../services/notificationService.js';
export const requestController = {
    // Create emergency or standard blood request
    createRequest: async (req, res) => {
        try {
            const { patient_name, blood_group, units_required, hospital_name, hospital_address, city, address, latitude, longitude, required_date, required_time, priority = 'Normal', reason, contact_number } = req.body;
            if (!patient_name || !blood_group || !units_required || !hospital_name || !city || !contact_number) {
                return res.status(400).json({
                    success: false,
                    message: 'Patient name, blood group, units, hospital, city, and contact number are required.'
                });
            }
            // Requester ID from authenticated user, or default demo patient (ID 2)
            const requesterId = req.user ? req.user.id : 2;
            // Generate unique Request Number: BR-2026-XXXX
            const countRes = dbHelper.get('SELECT COUNT(*) as count FROM blood_requests');
            const nextNum = (countRes?.count || 0) + 1;
            const requestNumber = `BR-2026-${String(nextNum).padStart(4, '0')}`;
            const insertRes = dbHelper.run(`INSERT INTO blood_requests (
           request_number, requester_id, patient_name, blood_group, units_required,
           hospital_name, hospital_address, city, address, latitude, longitude,
           required_date, required_time, priority, reason, contact_number, status,
           created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Request Created', datetime('now'), datetime('now'))`, [
                requestNumber,
                requesterId,
                patient_name.trim(),
                blood_group,
                parseInt(units_required, 10) || 1,
                hospital_name.trim(),
                hospital_address || '',
                city.trim(),
                address || '',
                latitude || 16.5062,
                longitude || 80.6480,
                required_date || new Date().toISOString().split('T')[0],
                required_time || '10:00 AM',
                priority,
                reason || '',
                contact_number.trim()
            ]);
            const requestId = Number(insertRes.lastInsertRowid);
            // Trigger Smart Donor Matching
            const allDonors = dbHelper.all(`SELECT 
           d.id, d.user_id, d.blood_group, d.city, d.state, d.address,
           d.latitude, d.longitude, d.last_donation_date, d.available, d.verified, d.donation_count,
           u.name, u.phone, u.email
         FROM donor_profiles d
         JOIN users u ON d.user_id = u.id`);
            const matchedResults = computeSmartDonorMatches({
                blood_group,
                latitude: latitude || 16.5062,
                longitude: longitude || 80.6480,
                city,
                priority
            }, allDonors);
            // Save top matches into donor_matches table
            for (const m of matchedResults.slice(0, 10)) {
                dbHelper.run(`INSERT INTO donor_matches (request_id, donor_id, compatibility_score, distance, status, created_at)
           VALUES (?, ?, ?, ?, 'Suggested', datetime('now'))`, [requestId, m.donor_id, m.compatibility_score, m.distance]);
            }
            // Send in-app notification to requester
            notificationService.create({
                userId: requesterId,
                title: `Blood Request Created: ${requestNumber}`,
                message: `Your request for ${units_required} unit(s) of ${blood_group} blood has been created and matched with ${matchedResults.length} donors.`,
                type: priority === 'Emergency' ? 'emergency' : 'request_update',
                link: `/patient/requests/${requestId}`
            });
            // If Emergency, notify all donors & hospitals
            if (priority === 'Emergency') {
                notificationService.notifyEmergency(requestId, blood_group, hospital_name, city);
            }
            const createdRequest = dbHelper.get('SELECT * FROM blood_requests WHERE id = ?', [requestId]);
            return res.status(201).json({
                success: true,
                message: 'Blood request created successfully',
                request_number: requestNumber,
                request: createdRequest,
                matches_found: matchedResults.length,
                matches: matchedResults
            });
        }
        catch (err) {
            console.error('createRequest error:', err);
            return res.status(500).json({ success: false, message: 'Server error creating request.', error: err.message });
        }
    },
    // Get all requests with filters
    getAllRequests: async (req, res) => {
        try {
            const { status, blood_group, priority, city, requester_id, search, limit = 50 } = req.query;
            let sql = `
        SELECT 
          r.*,
          u.name as requester_name,
          u.email as requester_email,
          u.phone as requester_phone,
          (SELECT COUNT(*) FROM donor_matches m WHERE m.request_id = r.id) as match_count
        FROM blood_requests r
        JOIN users u ON r.requester_id = u.id
        WHERE 1=1
      `;
            const params = [];
            if (status && status !== 'All') {
                sql += ` AND r.status = ?`;
                params.push(status);
            }
            if (blood_group && blood_group !== 'All' && blood_group !== 'Any') {
                sql += ` AND r.blood_group = ?`;
                params.push(blood_group);
            }
            if (priority && priority !== 'All') {
                sql += ` AND r.priority = ?`;
                params.push(priority);
            }
            if (city && city !== 'All') {
                sql += ` AND LOWER(r.city) LIKE LOWER(?)`;
                params.push(`%${city}%`);
            }
            if (requester_id) {
                sql += ` AND r.requester_id = ?`;
                params.push(requester_id);
            }
            if (search) {
                sql += ` AND (LOWER(r.request_number) LIKE LOWER(?) OR LOWER(r.patient_name) LIKE LOWER(?) OR LOWER(r.hospital_name) LIKE LOWER(?) OR LOWER(r.city) LIKE LOWER(?))`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }
            sql += ` ORDER BY 
        CASE 
          WHEN r.priority = 'Emergency' THEN 1
          WHEN r.priority = 'Urgent' THEN 2
          ELSE 3
        END,
        r.created_at DESC
        LIMIT ?`;
            params.push(Number(limit));
            const requests = dbHelper.all(sql, params);
            return res.json({
                success: true,
                count: requests.length,
                requests
            });
        }
        catch (err) {
            console.error('getAllRequests error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching requests.', error: err.message });
        }
    },
    // Get request by ID
    getRequestById: async (req, res) => {
        try {
            const { id } = req.params;
            const request = dbHelper.get(`SELECT 
           r.*,
           u.name as requester_name,
           u.email as requester_email,
           u.phone as requester_phone
         FROM blood_requests r
         JOIN users u ON r.requester_id = u.id
         WHERE r.id = ? OR r.request_number = ?`, [id, id]);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Blood request not found.' });
            }
            // Fetch donor matches
            const matches = dbHelper.all(`SELECT 
           m.*,
           d.blood_group, d.city, d.state, d.last_donation_date, d.available, d.verified, d.donation_count,
           u.name as donor_name, u.phone as donor_phone, u.email as donor_email, u.avatar_url
         FROM donor_matches m
         JOIN donor_profiles d ON m.donor_id = d.id
         JOIN users u ON d.user_id = u.id
         WHERE m.request_id = ?
         ORDER BY m.compatibility_score DESC, m.distance ASC`, [request.id]);
            return res.json({
                success: true,
                request,
                matches
            });
        }
        catch (err) {
            console.error('getRequestById error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching request details.' });
        }
    },
    // Update request status
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const validStatuses = [
                'Request Created',
                'Donors Being Matched',
                'Donor Contacted',
                'Donor Confirmed',
                'Blood Arranged',
                'Completed',
                'Cancelled'
            ];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }
            const request = dbHelper.get('SELECT * FROM blood_requests WHERE id = ? OR request_number = ?', [id, id]);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Request not found' });
            }
            dbHelper.run(`UPDATE blood_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`, [status, request.id]);
            // Notify requester of status change
            notificationService.create({
                userId: request.requester_id,
                title: `Status Update: ${request.request_number}`,
                message: `Your blood request status has been updated to "${status}".`,
                type: 'request_update',
                link: `/patient/requests/${request.id}`
            });
            return res.json({
                success: true,
                message: `Status updated to ${status}`,
                status
            });
        }
        catch (err) {
            console.error('updateStatus error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating status.' });
        }
    },
    // Delete / cancel request
    deleteRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const request = dbHelper.get('SELECT * FROM blood_requests WHERE id = ? OR request_number = ?', [id, id]);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Request not found' });
            }
            if (req.user && req.user.role !== 'admin' && req.user.id !== request.requester_id) {
                return res.status(403).json({ success: false, message: 'Not authorized to delete this request.' });
            }
            dbHelper.run('DELETE FROM blood_requests WHERE id = ?', [request.id]);
            return res.json({ success: true, message: 'Blood request deleted successfully.' });
        }
        catch (err) {
            console.error('deleteRequest error:', err);
            return res.status(500).json({ success: false, message: 'Server error deleting request.' });
        }
    }
};
