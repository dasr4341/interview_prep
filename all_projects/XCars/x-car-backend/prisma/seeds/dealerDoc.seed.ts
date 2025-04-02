import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

const dummyDoc = 'seed/x-cars/dummy-pdf_2.pdf';

export async function dealerDocumentSeed() {
  const dealers = await prisma.user.findMany({
    where: {
      role: Roles.DEALER,
    },
  });

  const pan = dealers.map((dealer) => {
    return {
      userId: dealer.id,
      fileType: 'PAN CARD',
      fileName: 'pan card',
      path: dummyDoc,
    };
  });

  const adhar = dealers.map((dealer) => {
    return {
      userId: dealer.id,
      fileType: 'ADHAR CARD',
      fileName: 'adhar card',
      path: dummyDoc,
    };
  });

  await prisma.userDocuments.createMany({ data: pan });
  await prisma.userDocuments.createMany({ data: adhar });
}
