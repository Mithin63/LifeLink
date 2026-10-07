import bcrypt from 'bcryptjs';
import { dbHelper, initDatabaseSchema } from '../config/database.js';
export async function seedDatabase() {
    console.log('🌱 Initializing database schema...');
    initDatabaseSchema();
    // Check if users already seeded
    const userCount = dbHelper.get('SELECT COUNT(*) as count FROM users')?.count || 0;
    if (userCount > 0) {
        console.log('Database already contains records. Refreshing seed data...');
        dbHelper.exec(`
      DELETE FROM notifications;
      DELETE FROM donations;
      DELETE FROM donor_matches;
      DELETE FROM blood_requests;
      DELETE FROM donor_profiles;
      DELETE FROM hospitals;
      DELETE FROM blood_banks;
      DELETE FROM users;
      DELETE FROM sqlite_sequence;
    `);
    }
    console.log('🔑 Hashing passwords...');
    const commonHash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);
    const donorHash = await bcrypt.hash('donor123', 10);
    const patientHash = await bcrypt.hash('patient123', 10);
    const hospitalHash = await bcrypt.hash('hospital123', 10);
    console.log('👤 Inserting demo users...');
    // 1. Core Role Users
    dbHelper.run(`INSERT INTO users (id, name, email, phone, password_hash, role, created_at) VALUES
     (1, 'Admin BloodConnect', 'admin@bloodconnect.org', '+91 9876543210', ?, 'admin', datetime('now', '-30 days')),
     (2, 'Mithin Patient', 'patient@bloodconnect.org', '+91 9876543211', ?, 'patient', datetime('now', '-25 days')),
     (3, 'Rahul Kumar', 'donor@bloodconnect.org', '+91 9876543212', ?, 'donor', datetime('now', '-20 days')),
     (4, 'City Care Hospital Admin', 'hospital@bloodconnect.org', '+91 9876543213', ?, 'hospital', datetime('now', '-18 days')),
     (5, 'Red Cross Blood Bank', 'bank@bloodconnect.org', '+91 9876543214', ?, 'blood_bank', datetime('now', '-15 days'))`, [adminHash, patientHash, donorHash, hospitalHash, commonHash]);
    // 2. Additional Donors Users
    const donorUsers = [
        { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '+91 9848011221', blood_group: 'A+', city: 'Vijayawada', lat: 16.5120, lon: 80.6410, available: 1, verified: 1, last_don: '2026-05-12', count: 4 },
        { name: 'Arjun Patel', email: 'arjun.patel@example.com', phone: '+91 9848011222', blood_group: 'B+', city: 'Guntur', lat: 16.3067, lon: 80.4365, available: 1, verified: 1, last_don: '2026-06-04', count: 6 },
        { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 9848011223', blood_group: 'O+', city: 'Guntur', lat: 16.2990, lon: 80.4420, available: 1, verified: 1, last_don: '2026-04-18', count: 2 },
        { name: 'Suresh Babu', email: 'suresh.babu@example.com', phone: '+91 9848011224', blood_group: 'AB+', city: 'Vijayawada', lat: 16.5180, lon: 80.6550, available: 0, verified: 1, last_don: '2026-02-10', count: 8 },
        { name: 'Anjali Verma', email: 'anjali.verma@example.com', phone: '+91 9848011225', blood_group: 'A-', city: 'Tenali', lat: 16.2430, lon: 80.6400, available: 1, verified: 1, last_don: '2026-05-20', count: 3 },
        { name: 'Karan Singh', email: 'karan.singh@example.com', phone: '+91 9848011226', blood_group: 'O-', city: 'Vijayawada', lat: 16.4950, lon: 80.6380, available: 1, verified: 1, last_don: '2026-06-15', count: 5 },
        { name: 'Pooja Nair', email: 'pooja.nair@example.com', phone: '+91 9848011227', blood_group: 'B-', city: 'Vijayawada', lat: 16.5210, lon: 80.6290, available: 1, verified: 0, last_don: '2026-04-02', count: 1 },
        { name: 'Vikram Rao', email: 'vikram.rao@example.com', phone: '+91 9848011228', blood_group: 'AB-', city: 'Guntur', lat: 16.3120, lon: 80.4280, available: 1, verified: 1, last_don: '2026-03-14', count: 7 },
        { name: 'Meera Iyer', email: 'meera.iyer@example.com', phone: '+91 9848011229', blood_group: 'O+', city: 'Vijayawada', lat: 16.5020, lon: 80.6450, available: 1, verified: 1, last_don: '2026-07-01', count: 9 },
        { name: 'Rohan Deshmukh', email: 'rohan.deshmukh@example.com', phone: '+91 9848011230', blood_group: 'A+', city: 'Hyderabad', lat: 17.3850, lon: 78.4867, available: 1, verified: 1, last_don: '2026-05-30', count: 3 },
        { name: 'Divya Nambiar', email: 'divya.n@example.com', phone: '+91 9848011231', blood_group: 'B+', city: 'Bengaluru', lat: 12.9716, lon: 77.5946, available: 1, verified: 1, last_don: '2026-06-25', count: 4 },
        { name: 'Manoj Krishna', email: 'manoj.k@example.com', phone: '+91 9848011232', blood_group: 'O-', city: 'Vijayawada', lat: 16.5080, lon: 80.6510, available: 1, verified: 1, last_don: '2026-06-10', count: 5 }
    ];
    let currentUserId = 6;
    for (const d of donorUsers) {
        dbHelper.run(`INSERT INTO users (id, name, email, phone, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?, 'donor', datetime('now', '-10 days'))`, [currentUserId, d.name, d.email, d.phone, commonHash]);
        dbHelper.run(`INSERT INTO donor_profiles (
         user_id, blood_group, date_of_birth, gender, city, state, address,
         latitude, longitude, last_donation_date, available, verified, donation_count, created_at
       ) VALUES (?, ?, '1996-08-15', 'Male', ?, 'Andhra Pradesh', 'Ring Road Area', ?, ?, ?, ?, ?, ?, datetime('now', '-10 days'))`, [currentUserId, d.blood_group, d.city, d.lat, d.lon, d.last_don, d.available, d.verified, d.count]);
        currentUserId++;
    }
    // Insert donor profile for primary demo donor (User ID 3: Rahul Kumar, O+)
    dbHelper.run(`INSERT INTO donor_profiles (
       user_id, blood_group, date_of_birth, gender, city, state, address,
       latitude, longitude, last_donation_date, available, verified, donation_count, created_at
     ) VALUES (3, 'O+', '1995-04-20', 'Male', 'Vijayawada', 'Andhra Pradesh', 'MG Road, Benz Circle', 16.5062, 80.6480, '2026-07-10', 1, 1, 5, datetime('now', '-20 days'))`);
    console.log('🏥 Inserting hospitals...');
    const hospitals = [
        { name: 'City Care Hospital', email: 'citycare@hospital.org', phone: '+91 866 2456789', address: 'MG Road, Governorpet', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5085, lon: 80.6432, verified: 1, user_id: 4 },
        { name: 'Apollo Hospital', email: 'apollo.vja@hospital.org', phone: '+91 866 2889900', address: 'Ring Road, Near Benz Circle', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5020, lon: 80.6550, verified: 1, user_id: null },
        { name: 'Sunrise Multispecialty Hospital', email: 'sunrise@hospital.org', phone: '+91 866 2334455', address: 'Kothapet Main Road', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5160, lon: 80.6380, verified: 1, user_id: null },
        { name: 'Life Care Hospital', email: 'lifecare@hospital.org', phone: '+91 863 2223344', address: 'Brodipet 4th Lane', city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3080, lon: 80.4350, verified: 1, user_id: null },
        { name: 'Global Health City', email: 'global@hospital.org', phone: '+91 863 2998877', address: 'Lakshmipuram Main Road', city: 'Guntur', state: 'Andhra Pradesh', lat: 16.2990, lon: 80.4410, verified: 1, user_id: null },
        { name: 'AIIMS Mangalagiri', email: 'aiims.m@gov.in', phone: '+91 864 5280000', address: 'Mangalagiri Campus', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.4350, lon: 80.5600, verified: 1, user_id: null }
    ];
    for (const h of hospitals) {
        dbHelper.run(`INSERT INTO hospitals (user_id, name, email, phone, address, city, state, latitude, longitude, verified, inventory_summary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-30 days'))`, [
            h.user_id,
            h.name,
            h.email,
            h.phone,
            h.address,
            h.city,
            h.state,
            h.lat,
            h.lon,
            h.verified,
            JSON.stringify({ 'A+': 15, 'A-': 4, 'B+': 18, 'B-': 5, 'AB+': 8, 'AB-': 2, 'O+': 24, 'O-': 6 })
        ]);
    }
    console.log('🏦 Inserting blood banks...');
    const bloodBanks = [
        { name: 'Red Cross Society Blood Bank', email: 'redcross.vja@org.in', phone: '+91 866 2577888', address: 'Governorpet, Old Bus Stand', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5110, lon: 80.6400, user_id: 5 },
        { name: 'Rotary Central Blood Bank', email: 'rotary.bb@org.in', phone: '+91 863 2233999', address: 'Kothapet, Guntur', city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3050, lon: 80.4390, user_id: null },
        { name: 'Lions District Blood Centre', email: 'lions.vja@org.in', phone: '+91 866 2488777', address: 'Eluru Road', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5170, lon: 80.6490, user_id: null }
    ];
    for (const b of bloodBanks) {
        dbHelper.run(`INSERT INTO blood_banks (user_id, name, email, phone, address, city, state, latitude, longitude, stock_summary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-30 days'))`, [
            b.user_id,
            b.name,
            b.email,
            b.phone,
            b.address,
            b.city,
            b.state,
            b.lat,
            b.lon,
            JSON.stringify({ 'A+': 32, 'A-': 8, 'B+': 40, 'B-': 12, 'AB+': 16, 'AB-': 5, 'O+': 55, 'O-': 14 })
        ]);
    }
    console.log('🩸 Inserting sample blood requests matching mockup...');
    const requests = [
        {
            req_num: 'BR-2026-0001',
            requester_id: 2,
            patient_name: 'Harish Varma',
            blood_group: 'A+',
            units: 2,
            hospital: 'City Care Hospital',
            city: 'Vijayawada',
            date: '2026-10-04',
            time: '10:00 AM',
            priority: 'Emergency',
            status: 'Donor Contacted',
            reason: 'Emergency surgery scheduled due to vehicular accident',
            contact: '+91 9848011221'
        },
        {
            req_num: 'BR-2026-0002',
            requester_id: 2,
            patient_name: 'Kavitha Devi',
            blood_group: 'O+',
            units: 1,
            hospital: 'Apollo Hospital',
            city: 'Vijayawada',
            date: '2026-09-28',
            time: '02:30 PM',
            priority: 'Urgent',
            status: 'Donor Confirmed',
            reason: 'Post-delivery complications needing fresh blood units',
            contact: '+91 9848011222'
        },
        {
            req_num: 'BR-2026-0003',
            requester_id: 2,
            patient_name: 'Rajesh Naidu',
            blood_group: 'B+',
            units: 2,
            hospital: 'Sunrise Hospital',
            city: 'Vijayawada',
            date: '2026-09-20',
            time: '11:00 AM',
            priority: 'Normal',
            status: 'Blood Arranged',
            reason: 'Routine chemotherapy support',
            contact: '+91 9848011223'
        },
        {
            req_num: 'BR-2026-0004',
            requester_id: 2,
            patient_name: 'Lakshmi Narayana',
            blood_group: 'AB+',
            units: 1,
            hospital: 'Life Care Hospital',
            city: 'Guntur',
            date: '2026-09-15',
            time: '04:00 PM',
            priority: 'Normal',
            status: 'Completed',
            reason: 'Cardiology procedure recovery',
            contact: '+91 9848011224'
        },
        {
            req_num: 'BR-2026-0005',
            requester_id: 2,
            patient_name: 'Ramesh Chowdary',
            blood_group: 'O-',
            units: 3,
            hospital: 'Global Hospital',
            city: 'Guntur',
            date: '2026-09-10',
            time: '09:00 AM',
            priority: 'Emergency',
            status: 'Donors Being Matched',
            reason: 'Rare blood type emergency replacement for trauma unit',
            contact: '+91 9848011225'
        }
    ];
    for (const r of requests) {
        const res = dbHelper.run(`INSERT INTO blood_requests (
         request_number, requester_id, patient_name, blood_group, units_required,
         hospital_name, hospital_address, city, latitude, longitude,
         required_date, required_time, priority, reason, contact_number, status, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, 'Hospital Road', ?, 16.5062, 80.6480, ?, ?, ?, ?, ?, ?, datetime('now', '-5 days'), datetime('now'))`, [
            r.req_num,
            r.requester_id,
            r.patient_name,
            r.blood_group,
            r.units,
            r.hospital,
            r.city,
            r.date,
            r.time,
            r.priority,
            r.reason,
            r.contact,
            r.status
        ]);
        const reqId = Number(res.lastInsertRowid);
        // Insert matched donors for each request
        dbHelper.run(`INSERT INTO donor_matches (request_id, donor_id, compatibility_score, distance, status, created_at)
       VALUES 
       (?, 1, 98, 2.3, 'Contacted', datetime('now', '-4 days')),
       (?, 2, 92, 4.1, 'Suggested', datetime('now', '-4 days')),
       (?, 3, 88, 5.8, 'Suggested', datetime('now', '-4 days')),
       (?, 6, 85, 7.8, 'Suggested', datetime('now', '-4 days'))`, [reqId, reqId, reqId, reqId]);
    }
    console.log('🏆 Inserting donation history records...');
    dbHelper.run(`INSERT INTO donations (donor_id, request_id, hospital_name, donation_date, units, status, certificate_id, created_at) VALUES
     (1, 4, 'City Care Hospital', '2026-05-12', 1, 'Completed', 'CERT-2026-A101', datetime('now', '-120 days')),
     (1, NULL, 'Red Cross Society', '2026-01-10', 1, 'Completed', 'CERT-2026-A102', datetime('now', '-240 days')),
     (2, 3, 'Sunrise Hospital', '2026-06-04', 1, 'Completed', 'CERT-2026-B201', datetime('now', '-100 days')),
     (6, 2, 'Apollo Hospital', '2026-06-15', 1, 'Completed', 'CERT-2026-O301', datetime('now', '-90 days'))`);
    console.log('🔔 Inserting demo notifications...');
    dbHelper.run(`INSERT INTO notifications (user_id, title, message, type, link, is_read, created_at) VALUES
     (2, '🚨 Emergency Match Found', '3 compatible A+ donors found for your request BR-2026-0001 at City Care Hospital.', 'emergency', '/patient/requests/1', 0, datetime('now', '-10 minutes')),
     (2, 'Donor Confirmed', 'Donor Sneha Reddy has confirmed availability for request BR-2026-0002.', 'match', '/patient/requests/2', 1, datetime('now', '-2 hours')),
     (3, '🩸 Urgent Blood Needed', 'A+ blood is urgently required at City Care Hospital (2.3 km away).', 'emergency', '/donor/requests', 0, datetime('now', '-30 minutes')),
     (1, 'System Health Check', 'BloodConnect backup and synchronization completed with zero errors.', 'system', '/admin/dashboard', 1, datetime('now', '-1 day'))`);
    console.log('✅ Seed completed successfully! All tables loaded with rich data.');
}
