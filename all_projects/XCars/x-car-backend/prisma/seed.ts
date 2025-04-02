import { PrismaClient } from '@prisma/client';
import { users, dealers, admins } from '../prisma/seeds/user.seed';
import { carSeed } from '../prisma/seeds/car.seed';
const prisma = new PrismaClient();
import * as bcrypt from 'bcryptjs';
import { appEnv } from '../src/config/app-env';
import { leadsSeed } from './seeds/leads.seed';
import { dealerDocumentSeed } from './seeds/dealerDoc.seed';

async function main() {
  //users seed creation
  try {
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email, phoneNumber: user.phoneNumber },
      });
      if (existingUser) continue;
      else await prisma.user.create({ data: user });
    }
  } catch (error) {
    console.log('User seeding failed');
    console.log(error);
  }

  //dealers seed creation
  try {
    for (const dealer of dealers) {
      const existingDealer = await prisma.user.findUnique({
        where: { email: dealer.email, phoneNumber: dealer.phoneNumber },
      });
      if (existingDealer) continue;
      else await prisma.user.create({ data: dealer });
    }
  } catch (error) {
    console.log('Dealer seeding failed');
    console.log(error);
  }

  // admin seed creation
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(appEnv.ADMIN_PASSWORD, salt);
    for await (const admin of admins) {
      await prisma.admin.create({
        data: { ...admin, password: hashedPassword },
      });
    }
  } catch (error) {
    console.log('Admin seeding failed');
    console.log(error);
  }

  // cars seed creation
  try {
    await carSeed();
  } catch (error) {
    console.log('car seeding failed');
    console.log(error);
  }

  try {
    await leadsSeed();
  } catch (error) {
    console.log('lead seeding failed');
    console.log(error);
  }

  try {
    await dealerDocumentSeed();
  } catch (error) {
    console.log('dealer document seeding failed');
    console.log(error);
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding finished');
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
