import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool, initDB } from './config/db.js';

dotenv.config();

const seed = async () => {
  console.log('🌱 Starting Supabase PostgreSQL Seeding for K12 Hunar CRM...');

  const dbReady = await initDB();
  if (!dbReady) {
    console.error('❌ Could not connect to Supabase database. Please check your DATABASE_URL in .env');
    process.exit(1);
  }

  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@k12hunar.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'K12 Hunar SuperAdmin';

    // Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    console.log(`🔐 Hashing password for admin: ${adminEmail}`);

    // Upsert Admin
    await pool.query(
      `
      INSERT INTO admins (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP;
    `,
      [adminName, adminEmail.toLowerCase(), passwordHash]
    );

    console.log(`✓ Admin user successfully seeded: ${adminEmail} (Password: ${adminPassword})`);

    // Insert initial inquiries
    const sampleInquiries = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.parent@gmail.com',
        phone: '+91 98765 43210',
        user_type: 'Parent',
        category: 'Admission',
        message: 'Looking for Grade 8 admission details for academic year 2026-2027.',
        status: 'Pending',
      },
      {
        name: 'Priya Patel',
        email: 'priya.student@outlook.com',
        phone: '+91 91234 56789',
        user_type: 'Student',
        category: 'Scholarship',
        message: 'Interested in applying for the National Hunar Talent Scholarship for STEM.',
        status: 'In Progress',
      },
      {
        name: 'St. Xavier High School',
        email: 'principal@stxaviers.edu',
        phone: '+91 99887 76655',
        user_type: 'School',
        category: 'Concert',
        message: 'Requesting partnership for our Annual Inter-School Music and Cultural Concert.',
        status: 'Resolved',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan.v@yahoo.com',
        phone: '+91 94567 89012',
        user_type: 'Student',
        category: 'General Query',
        message: 'Need syllabus and past year papers for the K12 Hunar Olympiad.',
        status: 'Pending',
      },
      {
        name: 'Anita Deshmukh',
        email: 'anita.d@gmail.com',
        phone: '+91 97654 32109',
        user_type: 'Parent',
        category: 'Scholarship',
        message: 'What is the eligibility criteria for the girl child merit scholarship?',
        status: 'In Progress',
      },
      {
        name: 'Delhi Public International School',
        email: 'contact@dpis-delhi.org',
        phone: '+91 98112 23344',
        user_type: 'School',
        category: 'Admission',
        message: 'Inquiring about bulk student enrollment and curriculum integration for Hunar coding bootcamps.',
        status: 'Pending',
      },
    ];

    for (const inq of sampleInquiries) {
      await pool.query(
        `
        INSERT INTO inquiries (name, email, phone, user_type, category, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING;
      `,
        [inq.name, inq.email, inq.phone, inq.user_type, inq.category, inq.message, inq.status]
      );
    }

    console.log(`✓ Sample inquiries seeded (${sampleInquiries.length} records).`);
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seed();
