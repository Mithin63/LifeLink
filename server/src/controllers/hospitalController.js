import { dbHelper } from '../config/database.js';
export const hospitalController = {
    // Get all hospitals
    getAllHospitals: async (req, res) => {
        try {
            const { city, search } = req.query;
            let sql = 'SELECT * FROM hospitals WHERE 1=1';
            const params = [];
            if (city && city !== 'All') {
                sql += ' AND LOWER(city) LIKE LOWER(?)';
                params.push(`%${city}%`);
            }
            if (search) {
                sql += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(city) LIKE LOWER(?))';
                params.push(`%${search}%`, `%${search}%`);
            }
            sql += ' ORDER BY name ASC';
            const hospitals = dbHelper.all(sql, params);
            return res.json({
                success: true,
                count: hospitals.length,
                hospitals: hospitals.map(h => ({
                    ...h,
                    verified: Boolean(h.verified),
                    inventory_summary: h.inventory_summary ? JSON.parse(h.inventory_summary) : {
                        'A+': 12, 'A-': 4, 'B+': 16, 'B-': 3, 'AB+': 8, 'AB-': 2, 'O+': 22, 'O-': 5
                    }
                }))
            });
        }
        catch (err) {
            console.error('getAllHospitals error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching hospitals.' });
        }
    },
    // Get hospital by ID
    getHospitalById: async (req, res) => {
        try {
            const { id } = req.params;
            const hospital = dbHelper.get('SELECT * FROM hospitals WHERE id = ? OR user_id = ?', [id, id]);
            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Hospital not found' });
            }
            const requests = dbHelper.all('SELECT * FROM blood_requests WHERE hospital_name = ? OR hospital_id = ? ORDER BY created_at DESC', [hospital.name, hospital.id]);
            return res.json({
                success: true,
                hospital: {
                    ...hospital,
                    verified: Boolean(hospital.verified),
                    inventory_summary: hospital.inventory_summary ? JSON.parse(hospital.inventory_summary) : {
                        'A+': 12, 'A-': 4, 'B+': 16, 'B-': 3, 'AB+': 8, 'AB-': 2, 'O+': 22, 'O-': 5
                    },
                    requests
                }
            });
        }
        catch (err) {
            console.error('getHospitalById error:', err);
            return res.status(500).json({ success: false, message: 'Server error fetching hospital.' });
        }
    },
    // Update hospital profile & inventory
    updateHospital: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, phone, address, city, state, inventory_summary } = req.body;
            const hospital = dbHelper.get('SELECT * FROM hospitals WHERE id = ? OR user_id = ?', [id, id]);
            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Hospital not found' });
            }
            const invJson = inventory_summary ? JSON.stringify(inventory_summary) : hospital.inventory_summary;
            dbHelper.run(`UPDATE hospitals SET
           name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           city = COALESCE(?, city),
           state = COALESCE(?, state),
           inventory_summary = COALESCE(?, inventory_summary)
         WHERE id = ?`, [name, phone, address, city, state, invJson, hospital.id]);
            return res.json({
                success: true,
                message: 'Hospital details updated successfully'
            });
        }
        catch (err) {
            console.error('updateHospital error:', err);
            return res.status(500).json({ success: false, message: 'Server error updating hospital.' });
        }
    }
};
