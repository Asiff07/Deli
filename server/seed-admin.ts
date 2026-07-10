import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('AdminPass123!', salt);
    
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@lumendeli.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }
    
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lumendeli.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
