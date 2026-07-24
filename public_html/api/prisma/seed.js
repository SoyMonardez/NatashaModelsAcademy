const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const settings = [
    { key: 'isInscriptionOpen', value: 'true' },
    { key: 'academyName', value: 'Natasha Models Academy' },
  ];
  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrator';
  if (adminEmail || adminPassword) {
    if (!adminEmail || !adminPassword || adminPassword.length < 12) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) must both be configured');
    }
    await prisma.user.upsert({
      where: { email: adminEmail.trim().toLowerCase() },
      update: { name: adminName, role: 'ADMIN' },
      create: {
        email: adminEmail.trim().toLowerCase(),
        name: adminName,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'ADMIN',
      },
    });
    console.log('Configured administrator account');
  } else {
    console.log('Administrator creation skipped; no admin credentials were provided');
  }
}

main()
  .catch(error => { console.error(error); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());
