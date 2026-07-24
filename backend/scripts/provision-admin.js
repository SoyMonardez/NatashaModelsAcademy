'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim();

async function main() {
  if (!email || !password || !name) {
    console.log('Admin provisioning skipped: ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME are not fully configured.');
    return;
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length > 100 || password.length < 12 || password.length > 128) {
    throw new Error('Admin provisioning configuration is invalid.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, password: passwordHash, name, role: 'ADMIN' },
    update: { password: passwordHash, name, role: 'ADMIN' },
  });
  console.log('Administrator account provisioned.');
}

main()
  .catch((error) => {
    console.error('Administrator provisioning failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());