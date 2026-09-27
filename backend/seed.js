import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import SiteContent from './models/SiteContent.js';

dotenv.config();

const seedData = async () => {
  await connectDB();

  try {
    // Create admin if not exists
    const adminExists = await Admin.findOne({ email: 'admin@studioy7.com' });
    if (!adminExists) {
      await Admin.create({
        email: 'admin@studioy7.com',
        password: 'admin123' // Change this in production!
      });
      console.log('✅ Admin account created: admin@studioy7.com / admin123');
    } else {
      console.log('ℹ️  Admin account already exists');
    }

    // Seed site content
    const sections = [
      {
        section: 'hero',
        content: {
          title: 'Capturing Real Stories Real Emotions',
          subtitle: 'Creating timeless memories through luxury wedding, couple, portrait, and event photography with care and creativity'
        }
      },
      {
        section: 'about',
        content: {
          title: 'Crafting Timeless Memories Since 2018',
          description: 'At Studio Y7, we believe every moment tells a story. Our passion for photography goes beyond just capturing images—we create emotional, cinematic experiences that you\'ll treasure forever.',
          mission: 'To capture authentic emotions and create visual stories that resonate for generations.',
          vision: 'To be the most trusted name in photography, known for artistry and professionalism.'
        }
      },
      {
        section: 'contact',
        content: {
          phone: '+91 98765 43210',
          email: 'hello@studioy7.com',
          address: 'Mumbai, India',
          whatsapp: 'https://wa.me/919876543210',
          instagram: 'https://instagram.com/studioy7',
          facebook: 'https://facebook.com/studioy7'
        }
      }
    ];

    for (const section of sections) {
      await SiteContent.findOneAndUpdate(
        { section: section.section },
        section,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Site content seeded successfully');
    console.log('\n🎉 Database setup complete!');
    console.log('\n📝 Default Admin Login:');
    console.log('   Email: admin@studioy7.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the admin password in production!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
