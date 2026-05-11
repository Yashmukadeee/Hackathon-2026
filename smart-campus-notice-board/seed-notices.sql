-- ============================================
-- Hackathon Goa 2026 - Cinematic Seed Data
-- Run this in Supabase SQL Editor after the schema
-- ============================================

-- Note: Replace '00000000-0000-0000-0000-000000000000' with your actual User ID from the users table
-- if you want the notices to be "owned" by you. Otherwise, they will just appear on the board.

INSERT INTO notices (title, content, summary, category, urgency, author_name, department, author_id)
VALUES 
(
  'HACKATHON GOA: The Scriptorium Opens', 
  'Welcome to the 2026 edition of Hackathon Goa. The opening ceremony will commence in the Grand Hall at 10:00 AM. Attendance is mandatory for all teams to receive their registration kits and physical access keys.', 
  'Mandatory opening ceremony in the Grand Hall for all registered teams.', 
  'Event', 
  'Critical', 
  'Dean of Technology', 
  'Administrative',
  (SELECT id FROM users LIMIT 1)
),
(
  'Connectivity Protocol: High-Speed Uplink', 
  'The campus fiber-optic network is now active. SSID: HERITAGE_GUEST. Security Protocol: WPA3. Please note that high-bandwidth streaming is restricted to ensure fair distribution for all developers working on heavy AI models.', 
  'Wi-Fi credentials and connectivity protocols for the event.', 
  'General', 
  'Important', 
  'IT Services', 
  'Infrastructure',
  (SELECT id FROM users LIMIT 1)
),
(
  'Mentor Scriptorium: Live Consultations', 
  'Our industry mentors are now available for technical consultation in the Library Annex. Areas of expertise include: Antigravity Metrics, Quantum Logic, and Neural Architectures. Book your slot via the mobile app.', 
  'Mentors are available for consultation in the Library Annex.', 
  'Academic', 
  'Normal', 
  'Chief Mentor', 
  'Education',
  (SELECT id FROM users LIMIT 1)
),
(
  'Nutrition Break: Mediterranean Courtyard', 
  'Refreshments and brain-fuel are served. Please head to the courtyard for the first meal of the hackathon. Remember to carry your participant ID card for scanner validation.', 
  'First meal break is now active in the courtyard.', 
  'General', 
  'Normal', 
  'Campus Logistics', 
  'Hospitality',
  (SELECT id FROM users LIMIT 1)
),
(
  'Final Submission: The Digital Seal', 
  'All projects must be submitted via the Heritage.AI Portal by 09:00 AM tomorrow. Ensure your README files are comprehensive and your demo videos are encoded in H.264 format.', 
  'Final project submission deadline and guidelines.', 
  'Academic', 
  'Critical', 
  'Judicial Committee', 
  'Examination',
  (SELECT id FROM users LIMIT 1)
);
