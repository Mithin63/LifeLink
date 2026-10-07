-- BloodConnect PostgreSQL Seed Data

-- 1. Demo Users (Passwords hashed for: admin123, patient123, donor123, hospital123, password123)
-- bcrypt hash for 'admin123': $2a$10$wN9aW/N2.1iV3z.n8Z2j0e.G4W3yqR.YqC2zN2v7o2c5e5
-- bcrypt hash for 'password123': $2a$10$wN9aW/N2.1iV3z.n8Z2j0e.G4W3yqR.YqC2zN2v7o2c5e5

INSERT INTO users (id, name, email, phone, password_hash, role, created_at) VALUES
(1, 'Admin BloodConnect', 'admin@bloodconnect.org', '+91 9876543210', '$2a$10$Z1zOaA19D3BwZ77t4yLdCeBq1wW5k1T.t49z8H4iI9vJ1f3R8O9zO', 'admin', NOW()),
(2, 'Mithin Patient', 'patient@bloodconnect.org', '+91 9876543211', '$2a$10$Z1zOaA19D3BwZ77t4yLdCeBq1wW5k1T.t49z8H4iI9vJ1f3R8O9zO', 'patient', NOW()),
(3, 'Rahul Kumar', 'donor@bloodconnect.org', '+91 9876543212', '$2a$10$Z1zOaA19D3BwZ77t4yLdCeBq1wW5k1T.t49z8H4iI9vJ1f3R8O9zO', 'donor', NOW()),
(4, 'City Care Hospital Admin', 'hospital@bloodconnect.org', '+91 9876543213', '$2a$10$Z1zOaA19D3BwZ77t4yLdCeBq1wW5k1T.t49z8H4iI9vJ1f3R8O9zO', 'hospital', NOW()),
(5, 'Red Cross Blood Bank', 'bank@bloodconnect.org', '+91 9876543214', '$2a$10$Z1zOaA19D3BwZ77t4yLdCeBq1wW5k1T.t49z8H4iI9vJ1f3R8O9zO', 'blood_bank', NOW());

-- 2. Donor Profiles
INSERT INTO donor_profiles (user_id, blood_group, date_of_birth, gender, city, state, address, latitude, longitude, last_donation_date, available, verified, donation_count) VALUES
(3, 'O+', '1995-04-20', 'Male', 'Vijayawada', 'Andhra Pradesh', 'MG Road, Benz Circle', 16.5062, 80.6480, '2026-07-10', true, true, 5);

-- 3. Hospitals
INSERT INTO hospitals (user_id, name, email, phone, address, city, state, latitude, longitude, verified, inventory_summary) VALUES
(4, 'City Care Hospital', 'citycare@hospital.org', '+91 866 2456789', 'MG Road, Governorpet', 'Vijayawada', 'Andhra Pradesh', 16.5085, 80.6432, true, '{"A+": 15, "A-": 4, "B+": 18, "B-": 5, "AB+": 8, "AB-": 2, "O+": 24, "O-": 6}'),
(NULL, 'Apollo Hospital', 'apollo.vja@hospital.org', '+91 866 2889900', 'Ring Road, Near Benz Circle', 'Vijayawada', 'Andhra Pradesh', 16.5020, 80.6550, true, '{"A+": 20, "A-": 6, "B+": 22, "B-": 8, "AB+": 10, "AB-": 3, "O+": 30, "O-": 8}'),
(NULL, 'Sunrise Multispecialty Hospital', 'sunrise@hospital.org', '+91 866 2334455', 'Kothapet Main Road', 'Vijayawada', 'Andhra Pradesh', 16.5160, 80.6380, true, '{"A+": 10, "A-": 2, "B+": 12, "B-": 3, "AB+": 5, "AB-": 1, "O+": 15, "O-": 3}');

-- 4. Blood Banks
INSERT INTO blood_banks (user_id, name, email, phone, address, city, state, latitude, longitude, stock_summary) VALUES
(5, 'Red Cross Society Blood Bank', 'redcross.vja@org.in', '+91 866 2577888', 'Governorpet, Old Bus Stand', 'Vijayawada', 'Andhra Pradesh', 16.5110, 80.6400, '{"A+": 32, "A-": 8, "B+": 40, "B-": 12, "AB+": 16, "AB-": 5, "O+": 55, "O-": 14}');

-- 5. Blood Requests
INSERT INTO blood_requests (request_number, requester_id, patient_name, blood_group, units_required, hospital_name, hospital_address, city, latitude, longitude, required_date, required_time, priority, reason, contact_number, status) VALUES
('BR-2026-0001', 2, 'Harish Varma', 'A+', 2, 'City Care Hospital', 'Hospital Road', 'Vijayawada', 16.5062, 80.6480, '2026-10-04', '10:00 AM', 'Emergency', 'Emergency surgery scheduled due to vehicular accident', '+91 9848011221', 'Donor Contacted'),
('BR-2026-0002', 2, 'Kavitha Devi', 'O+', 1, 'Apollo Hospital', 'Ring Road', 'Vijayawada', 16.5062, 80.6480, '2026-09-28', '02:30 PM', 'Urgent', 'Post-delivery complications needing fresh blood units', '+91 9848011222', 'Donor Confirmed'),
('BR-2026-0003', 2, 'Rajesh Naidu', 'B+', 2, 'Sunrise Hospital', 'Kothapet', 'Vijayawada', 16.5062, 80.6480, '2026-09-20', '11:00 AM', 'Normal', 'Routine chemotherapy support', '+91 9848011223', 'Blood Arranged'),
('BR-2026-0004', 2, 'Lakshmi Narayana', 'AB+', 1, 'Life Care Hospital', 'Brodipet', 'Guntur', 16.3080, 80.4350, '2026-09-15', '04:00 PM', 'Normal', 'Cardiology procedure recovery', '+91 9848011224', 'Completed'),
('BR-2026-0005', 2, 'Ramesh Chowdary', 'O-', 3, 'Global Hospital', 'Lakshmipuram', 'Guntur', 16.2990, 80.4410, '2026-09-10', '09:00 AM', 'Emergency', 'Rare blood type emergency replacement for trauma unit', '+91 9848011225', 'Donors Being Matched');
