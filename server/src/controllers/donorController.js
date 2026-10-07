import { dbHelper } from '../config/database.js';
import { calculateHaversineDistance } from '../services/matchingService.js';
export const donorController = {
    // Get all donors with filtering & distance calculation
    getAllDonors: async (req, res) => {
        try {
            const { blood_group, city, available, lat, lon, verified, search } = req.query;
            let sql = `
        SELECT 
          d.id, d.user_id, d.blood_group, d.date_of_birth, d.gender,
          d.city, d.state, d.address, d.latitude, d.longitude,
          d.last_donation_date, d.available, d.verified, d.donation_count,
          u.name, u.email, u.phone, u.avatar_url
        FROM donor_profiles d
        JOIN users u ON d.user_id = u.id
        WHERE 1=1
      `;
            const params = [];
            if (blood_group && blood_group !== 'All' && blood_group !== 'Any') {
                sql += ` AND d.blood_group = ?`;
                params.push(blood_group);
            }
            if (city && city !== 'All') {
                sql += ` AND LOWER(d.city) LIKE LOWER(?)`;
                params.push(`%${city}%`);
            }
            if (available !== undefined && available !== '' && available !== 'all') {
                sql += ` AND d.available = ?`;
                params.push(available === 'true' || available === '1' ? 1 : 0);
            }
            if (verified !== undefined && verified !== '') {
                sql += ` AND d.verified = ?`;
                params.push(verified === 'true' || verified === '1' ? 1 : 0);
            }
            if (search) {
                sql += ` AND (LOWER(u.name) LIKE LOWER(?) OR LOWER(d.city) LIKE LOWER(?) OR LOWER(d.blood_group) LIKE LOWER(?))`;
                params.push(`%${search}%`, `%${search}%`, `%${search}%`);
            }
            sql += ` ORDER BY d.available DESC, d.verified DESC, d.donation_count DESC`;
            const donors = dbHelper.all(sql, params);
            // Compute dynamic distance if user supplied coordinates
            const userLat = lat ? parseFloat(lat) : null;
            const userLon = lon ? parseFloat(lon) : null;
            const results = donors.map((donor) => {
                let distance = 3.5;
                if (userLat && userLon && donor.latitude && donor.longitude) {
                    distance = calculateHaversineDistance(userLat, userLon, donor.latitude, donor.longitude);
                }
                else if (donor.latitude && donor.longitude) {
                    // Default reference center point (e.g. city center)
                    distance = calculateHaversineDistance(16.5062, 80.6480, donor.latitude, donor.longitude);
                }
                return {
                    ...donor,
                    available: Boolean(donor.available),
                    verified: Boolean(donor.verified),
                    distance
                };
            });
            // Sort by distance if coordinates were given
            if (userLat && userLon) {
                results.sort((a, b) => a.distance - b.distance);
            }
            return res.json({
                success: true,
                count: results.length,
                donors: results
            });
        }
        catch (err) {
            console.error('getAllDonors error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching donors.', error: err.message });
        }
    },
    // Get donor by ID
    getDonorById: async (req, res) => {
        try {
            const { id } = req.params;
            const donor = dbHelper.get(`SELECT 
           d.*, u.name, u.email, u.phone, u.avatar_url
         FROM donor_profiles d
         JOIN users u ON d.user_id = u.id
         WHERE d.id = ? OR d.user_id = ?`, [id, id]);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor profile not found' });
            }
            const donations = dbHelper.all(`SELECT * FROM donations WHERE donor_id = ? ORDER BY donation_date DESC`, [donor.id]);
            return res.json({
                success: true,
                donor: {
                    ...donor,
                    available: Boolean(donor.available),
                    verified: Boolean(donor.verified),
                    donations
                }
            });
        }
        catch (err) {
            console.error('getDonorById error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching donor details.', error: err.message });
        }
    },
    // Update donor profile
    updateDonorProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const { blood_group, date_of_birth, gender, city, state, address, latitude, longitude, last_donation_date, available, name, phone } = req.body;
            const donor = dbHelper.get('SELECT * FROM donor_profiles WHERE id = ? OR user_id = ?', [id, id]);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor profile not found' });
            }
            // Authorization check (admin or owner)
            if (req.user && req.user.role !== 'admin' && req.user.id !== donor.user_id) {
                return res.status(403).json({ success: false, message: 'Not authorized to update this profile.' });
            }
            dbHelper.run(`UPDATE donor_profiles SET
           blood_group = COALESCE(?, blood_group),
           date_of_birth = COALESCE(?, date_of_birth),
           gender = COALESCE(?, gender),
           city = COALESCE(?, city),
           state = COALESCE(?, state),
           address = COALESCE(?, address),
           latitude = COALESCE(?, latitude),
           longitude = COALESCE(?, longitude),
           last_donation_date = COALESCE(?, last_donation_date),
           available = COALESCE(?, available),
           updated_at = datetime('now')
         WHERE id = ?`, [
                blood_group,
                date_of_birth,
                gender,
                city,
                state,
                address,
                latitude,
                longitude,
                last_donation_date,
                available !== undefined ? (available ? 1 : 0) : null,
                donor.id
            ]);
            if (name || phone) {
                dbHelper.run(`UPDATE users SET
             name = COALESCE(?, name),
             phone = COALESCE(?, phone),
             updated_at = datetime('now')
           WHERE id = ?`, [name, phone, donor.user_id]);
            }
            const updatedDonor = dbHelper.get(`SELECT d.*, u.name, u.email, u.phone FROM donor_profiles d JOIN users u ON d.user_id = u.id WHERE d.id = ?`, [donor.id]);
            return res.json({
                success: true,
                message: 'Donor profile updated successfully',
                donor: {
                    ...updatedDonor,
                    available: Boolean(updatedDonor.available),
                    verified: Boolean(updatedDonor.verified)
                }
            });
        }
        catch (err) {
            console.error('updateDonorProfile error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating profile.', error: err.message });
        }
    },
    // Toggle availability status
    toggleAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { available } = req.body;
            const donor = dbHelper.get('SELECT * FROM donor_profiles WHERE id = ? OR user_id = ?', [id, id]);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor profile not found' });
            }
            const newStatus = available !== undefined ? (available ? 1 : 0) : donor.available ? 0 : 1;
            dbHelper.run(`UPDATE donor_profiles SET available = ?, updated_at = datetime('now') WHERE id = ?`, [newStatus, donor.id]);
            return res.json({
                success: true,
                message: `Status updated to ${newStatus ? 'Available' : 'Not Available'}`,
                available: Boolean(newStatus)
            });
        }
        catch (err) {
            console.error('toggleAvailability error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating availability.', error: err.message });
        }
    },
    // Get donation history
    getDonations: async (req, res) => {
        try {
            const { id } = req.params;
            const donor = dbHelper.get('SELECT id FROM donor_profiles WHERE id = ? OR user_id = ?', [id, id]);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            const donations = dbHelper.all(`SELECT d.*, r.request_number, r.patient_name
         FROM donations d
         LEFT JOIN blood_requests r ON d.request_id = r.id
         WHERE d.donor_id = ?
         ORDER BY d.donation_date DESC`, [donor.id]);
            return res.json({ success: true, donations });
        }
        catch (err) {
            console.error('getDonations error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching donations.' });
        }
    },
    // Record a donation
    recordDonation: async (req, res) => {
        try {
            const { id } = req.params;
            const { hospital_name, donation_date, units = 1, request_id } = req.body;
            const donor = dbHelper.get('SELECT * FROM donor_profiles WHERE id = ? OR user_id = ?', [id, id]);
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
            dbHelper.run(`INSERT INTO donations (donor_id, request_id, hospital_name, donation_date, units, status, certificate_id, created_at)
         VALUES (?, ?, ?, ?, ?, 'Completed', ?, datetime('now'))`, [donor.id, request_id || null, hospital_name || 'City Care Hospital', donation_date || new Date().toISOString().split('T')[0], units, certificateId]);
            // Increment donor donation count and update last_donation_date
            dbHelper.run(`UPDATE donor_profiles SET
           donation_count = donation_count + ?,
           last_donation_date = ?,
           updated_at = datetime('now')
         WHERE id = ?`, [units, donation_date || new Date().toISOString().split('T')[0], donor.id]);
            return res.status(201).json({
                success: true,
                message: 'Donation recorded successfully',
                certificate_id: certificateId
            });
        }
        catch (err) {
            console.error('recordDonation error:', err);
            return res.status(500).json({ success: false, message: 'Server error recording donation.' });
        }
    }
};
