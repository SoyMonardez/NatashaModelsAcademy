const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Initialize settings
  const settings = [
    { key: 'isInscriptionOpen', value: 'true' },
    { key: 'academyName', value: 'Natasha Models Academy' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s
    });
  }

  // Add dummy courses if none exist
  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: [
        { title: 'Pasarela Profesional', youtubeUrl: 'dQw4w9WgXcQ', type: 'FREE', category: 'Modeling', professor: 'Natasha R.' },
        { title: 'Fotografía Editorial', youtubeUrl: 'dQw4w9WgXcQ', type: 'PREMIUM', category: 'Modeling', professor: 'Carlos M.' },
        { title: 'Maquillaje de Pasarela', youtubeUrl: 'dQw4w9WgXcQ', type: 'FREE', category: 'Beauty', professor: 'Ana L.' },
        { title: 'Marketing Personal', youtubeUrl: 'dQw4w9WgXcQ', type: 'PREMIUM', category: 'Professional', professor: 'Roberto G.' }
      ]
    });
  }

  // Create a default admin user for testing
  // Password is 'admin123' hashed (approx for seed, though using bcrypt is better)
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@natasha.com' },
    update: {},
    create: {
      email: 'admin@natasha.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Seed completed! Default Admin: admin@natasha.com / admin123');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
