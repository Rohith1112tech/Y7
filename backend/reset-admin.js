import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

const resetAdmin = async () => {
  await connectDB();

  try {
    const email = process.env.ADMIN_EMAIL || 'admin@studioy7.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await Admin.findOne({ email });
    if (admin) {
      admin.password = password;
      await admin.save();
      console.log(`✅ Admin password reset for: ${email}`);
    } else {
      admin = await Admin.create({ email, password });
      console.log(`✅ New admin created: ${email}`);
    }

    console.log('\n📝 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Remember to use a secure password in production!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to reset admin:', error.message);
    process.exit(1);
  }
};

resetAdmin();
