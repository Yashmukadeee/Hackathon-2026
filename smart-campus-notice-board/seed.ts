import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Seed failed.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleNotices = [
  {
    title: 'HACKATHON GOA: The Scriptorium Opens',
    content: 'Welcome to the 2026 edition of Hackathon Goa. The opening ceremony will commence in the Grand Hall at 10:00 AM. Attendance is mandatory for all teams to receive their registration kits and physical access keys.',
    summary: 'Mandatory opening ceremony in the Grand Hall for all registered teams.',
    category: 'Event',
    urgency: 'Critical',
    author_name: 'Dean of Technology',
    department: 'Administrative',
  },
  {
    title: 'Connectivity Protocol: High-Speed Uplink',
    content: 'The campus fiber-optic network is now active. SSID: HERITAGE_GUEST. Security Protocol: WPA3. Please note that high-bandwidth streaming is restricted to ensure fair distribution for all developers working on heavy AI models.',
    summary: 'Wi-Fi credentials and connectivity protocols for the event.',
    category: 'General',
    urgency: 'Important',
    author_name: 'IT Services',
    department: 'Infrastructure',
  },
  {
    title: 'Mentor Scriptorium: Live Consultations',
    content: 'Our industry mentors are now available for technical consultation in the Library Annex. Areas of expertise include: Antigravity Metrics, Quantum Logic, and Neural Architectures. Book your slot via the mobile app.',
    summary: 'Mentors are available for consultation in the Library Annex.',
    category: 'Academic',
    urgency: 'Normal',
    author_name: 'Chief Mentor',
    department: 'Education',
  },
  {
    title: 'Nutrition Break: Mediterranean Courtyard',
    content: 'Refreshments and brain-fuel are served. Please head to the courtyard for the first meal of the hackathon. Remember to carry your participant ID card for scanner validation.',
    summary: 'First meal break is now active in the courtyard.',
    category: 'General',
    urgency: 'Normal',
    author_name: 'Campus Logistics',
    department: 'Hospitality',
  },
  {
    title: 'Final Submission: The Digital Seal',
    content: 'All projects must be submitted via the Heritage.AI Portal by 09:00 AM tomorrow. Ensure your README files are comprehensive and your demo videos are encoded in H.264 format.',
    summary: 'Final project submission deadline and guidelines.',
    category: 'Academic',
    urgency: 'Critical',
    author_name: 'Judicial Committee',
    department: 'Examination',
  }
];

async function seed() {
  console.log('📜 Initializing Scriptorium Seed...');

  // Get a valid user ID for the author_id field
  // We'll use the service role or first user if available
  const { data: users } = await supabase.from('users').select('id').limit(1);
  
  if (!users || users.length === 0) {
    console.error('❌ No users found in the database. Please sign up first or create a user in the auth table.');
    return;
  }

  const userId = users[0].id;
  const noticesWithAuthor = sampleNotices.map(n => ({ ...n, author_id: userId }));

  const { error } = await supabase.from('notices').insert(noticesWithAuthor);

  if (error) {
    console.error('❌ Error seeding notices:', error.message);
  } else {
    console.log('✅ Archives successfully populated! Your board is now live.');
  }
}

seed();
