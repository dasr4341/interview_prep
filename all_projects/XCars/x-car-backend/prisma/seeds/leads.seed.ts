import { LeadType, PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

export async function leadsSeed() {
  // Fetch existing Cars, Users, and ContactData (if needed)
  const cars = await prisma.car.findMany();
  const users = await prisma.user.findMany({
    where: {
      role: Roles.USER,
    },
  });

  // Check if there are cars and users to create leads
  if (cars.length === 0 || users.length === 0) {
    console.error(
      'Cars or Users are missing in the database. Seed them first.',
    );
    return;
  }

  // Define a date range for createdAt values
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  // Helper function to get a random date within the specified range
  function getRandomDateInRange(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  // Sample data for Leads
  const leadsData = cars.map((car, index) => {
    const user = users[index % users.length]; // Assign a user in round-robin fashion
    const contactId = null;
    const leadType = index % 2 === 0 ? LeadType.LEAD : LeadType.HOT_LEAD;
    const createdAt = getRandomDateInRange(startDate, endDate); // Random createdAt
    const updatedAt = getRandomDateInRange(startDate, endDate); // Random createdAt

    return {
      carId: car.id,
      userId: user.id,
      contactId,
      leadType,
      createdAt,
      updatedAt,
    };
  });

  // Insert leads into the database
  await prisma.leads.createMany({
    data: leadsData,
    skipDuplicates: true, // Skip duplicate entries based on unique constraints
  });

  console.log('Leads seeded successfully');
}
