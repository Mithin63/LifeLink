import { dbHelper } from '../config/database.js';
import { computeSmartDonorMatches } from '../services/matchingService.js';
import { notificationService } from '../services/notificationService.js';
export const matchController = {
    // Get matches for a request
    getMatchesByRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const request = dbHelper.get('SELECT * FROM blood_requests WHERE id = ? OR request_number = ?', [id, id]);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Request not found.' });
            }
            // Query saved matches joined with donor info
            const matches = dbHelper.all(`SELECT 
           m.id as match_id, m.compatibility_score, m.distance, m.status as match_status, m.contacted_at,
           d.id as donor_id, d.user_id, d.blood_group, d.city, d.state, d.address, d.latitude, d.longitude,
           d.last_donation_date, d.available, d.verified, d.donation_count,
           u.name, u.phone, u.email, u.avatar_url
         FROM donor_matches m
         JOIN donor_profiles d ON m.donor_id = d.id
         JOIN users u ON d.user_id = u.id
         WHERE m.request_id = ?
         ORDER BY m.compatibility_score DESC, m.distance ASC`, [request.id]);
            return res.json({
                success: true,
                request_id: request.id,
                request_number: request.request_number,
                blood_group: request.blood_group,
                disclaimer: 'Smart matching assists in identifying compatible donors; final medical eligibility must be determined by qualified healthcare professionals.',
                count: matches.length,
                matches: matches.map(m => ({
                    ...m,
                    available: Boolean(m.available),
                    verified: Boolean(m.verified)
                }))
            });
        }
        catch (err) {
            console.error('getMatchesByRequest error:', err);
            return res.status(500).json({ success: false, message: 'Server error retrieving matches.' });
        }
    },
    // Rerun or trigger matching for a request
    runMatching: async (req, res) => {
        try {
            const { id } = req.params;
            const request = dbHelper.get('SELECT * FROM blood_requests WHERE id = ? OR request_number = ?', [id, id]);
            if (!request) {
                return res.status(404).json({ success: false, message: 'Request not found.' });
            }
            const allDonors = dbHelper.all(`SELECT 
           d.id, d.user_id, d.blood_group, d.city, d.state, d.address,
           d.latitude, d.longitude, d.last_donation_date, d.available, d.verified, d.donation_count,
           u.name, u.phone, u.email
         FROM donor_profiles d
         JOIN users u ON d.user_id = u.id`);
            const matchedResults = computeSmartDonorMatches({
                blood_group: request.blood_group,
                latitude: request.latitude,
                longitude: request.longitude,
                city: request.city,
                priority: request.priority
            }, allDonors);
            // Refresh donor_matches records
            dbHelper.run('DELETE FROM donor_matches WHERE request_id = ?', [request.id]);
            for (const m of matchedResults) {
                dbHelper.run(`INSERT INTO donor_matches (request_id, donor_id, compatibility_score, distance, status, created_at)
           VALUES (?, ?, ?, ?, 'Suggested', datetime('now'))`, [request.id, m.donor_id, m.compatibility_score, m.distance]);
            }
            // Update request status to 'Donors Being Matched' if it was 'Request Created'
            if (request.status === 'Request Created' && matchedResults.length > 0) {
                dbHelper.run(`UPDATE blood_requests SET status = 'Donors Being Matched' WHERE id = ?`, [request.id]);
            }
            return res.json({
                success: true,
                message: `Found ${matchedResults.length} compatible donors.`,
                disclaimer: 'Smart matching assists in identifying compatible donors; final medical eligibility must be determined by qualified healthcare professionals.',
                matches: matchedResults
            });
        }
        catch (err) {
            console.error('runMatching error:', err);
            return res.status(500).json({ success: false, message: 'Server error computing matches.' });
        }
    },
    // Contact a matched donor
    contactDonor: async (req, res) => {
        try {
            const { id } = req.params; // match_id
            const { message } = req.body;
            const match = dbHelper.get(`SELECT m.*, r.request_number, r.blood_group, r.hospital_name, r.city, r.patient_name, d.user_id as donor_user_id, u.name as donor_name
         FROM donor_matches m
         JOIN blood_requests r ON m.request_id = r.id
         JOIN donor_profiles d ON m.donor_id = d.id
         JOIN users u ON d.user_id = u.id
         WHERE m.id = ?`, [id]);
            if (!match) {
                return res.status(404).json({ success: false, message: 'Match record not found.' });
            }
            // Update match status to 'Contacted'
            dbHelper.run(`UPDATE donor_matches SET status = 'Contacted', contacted_at = datetime('now') WHERE id = ?`, [id]);
            // Advance blood request status to 'Donor Contacted' if earlier in lifecycle
            dbHelper.run(`UPDATE blood_requests SET status = 'Donor Contacted', updated_at = datetime('now') 
         WHERE id = ? AND status IN ('Request Created', 'Donors Being Matched')`, [match.request_id]);
            // Notify donor
            notificationService.create({
                userId: match.donor_user_id,
                title: `Donation Request: ${match.blood_group} for ${match.patient_name}`,
                message: message || `You have been contacted for urgent blood requirement at ${match.hospital_name}, ${match.city}. Request ID: ${match.request_number}`,
                type: 'match',
                link: `/donor/requests`
            });
            return res.json({
                success: true,
                message: `Request sent to donor ${match.donor_name} successfully.`,
                match_id: id,
                status: 'Contacted'
            });
        }
        catch (err) {
            console.error('contactDonor error:', err);
            return res.status(500).json({ success: false, message: 'Server error contacting donor.' });
        }
    },
    // Update match status (e.g. Confirm or Accept)
    updateMatchStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const validStatuses = ['Suggested', 'Contacted', 'Accepted', 'Declined', 'Confirmed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status.' });
            }
            const match = dbHelper.get('SELECT * FROM donor_matches WHERE id = ?', [id]);
            if (!match) {
                return res.status(404).json({ success: false, message: 'Match not found.' });
            }
            dbHelper.run(`UPDATE donor_matches SET status = ? WHERE id = ?`, [status, id]);
            if (status === 'Confirmed') {
                dbHelper.run(`UPDATE blood_requests SET status = 'Donor Confirmed', updated_at = datetime('now') WHERE id = ?`, [match.request_id]);
            }
            return res.json({
                success: true,
                message: `Match status updated to ${status}`,
                status
            });
        }
        catch (err) {
            console.error('updateMatchStatus error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating match status.' });
        }
    }
};
