import { faker } from '@faker-js/faker';
import {
  CarStatus,
  DocumentType,
  FuelType,
  PrismaClient,
  Roles,
  UserStatus,
  TransmissionType,
} from '@prisma/client';

const prisma = new PrismaClient();

const carImages = {
  alto: ['seed/x-cars/alto/download.jpeg', 'seed/x-cars/alto/images.jpeg'],
  i10: ['seed/x-cars/i10/download.jpeg'],
  magnite: ['seed/x-cars/magnite/download.jpeg'],
  tesla: ['seed/x-cars/tesla/download.jpeg'],
  thar: ['seed/x-cars/thar/download.jpeg'],
};

const carVideo = 'https://player.vimeo.com/video/1022061215?h=163b274989';

function getRandomCarImages(numImages: number): string[] {
  const allImages: string[] = [];

  // Gather all images from each car model
  for (const images of Object.values(carImages)) {
    allImages.push(...images);
  }

  // Shuffle the array
  for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
  }

  // Get the specified number of random images
  return allImages.slice(0, numImages);
}

function generateRandomVehicleRegistration(): string {
  // Define the characters to use for the registration number
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  // Generate a random combination
  const randomLetters = Array.from({ length: 2 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length)),
  ).join('');
  const random2Digits = Array.from({ length: 2 }, () =>
    digits.charAt(Math.floor(Math.random() * digits.length)),
  ).join('');
  const random4Digits = Array.from({ length: 4 }, () =>
    digits.charAt(Math.floor(Math.random() * digits.length)),
  ).join('');

  // Combine them in the format "LLL-DDDD"
  return `WB${random2Digits}${randomLetters}${random4Digits}`;
}

const makeCars = (count: number) => {
  const cars = [];
  for (let i = 0; i < count; i++) {
    cars.push({
      launchYear: faker.date
        .between({ from: '2000-01-01', to: '2024-01-01' })
        .getFullYear(),
      totalRun: faker.number.int({ min: 1000, max: 200000 }),
      noOfOwners: faker.number.int({ min: 1, max: 5 }),
      companyName: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      variant: faker.vehicle.vrm(),
      registrationNumber: generateRandomVehicleRegistration(),
      fuelType: faker.helpers.arrayElement([
        FuelType.Diesel,
        FuelType.Electric,
        FuelType.Hybrid,
        FuelType.Petrol,
      ]),
      transmission: faker.helpers.arrayElement([
        TransmissionType.AT,
        TransmissionType.MT,
      ]),
      carStatus: CarStatus.APPROVED,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return cars;
};

export async function carSeed() {
  const dealers = await prisma.user.findMany({
    where: {
      role: Roles.DEALER,
      userStatus: UserStatus.ONBOARDED,
    },
  });

  for await (const eachDealer of dealers) {
    const cars = makeCars(10);
    for await (const eachCar of cars) {
      const car = await prisma.car.create({
        data: {
          userId: eachDealer.id,
          ...eachCar,
        },
      });

      const images = getRandomCarImages(5);

      // for await (const image of images) {
      await prisma.carGallery.create({
        data: {
          carGalleryDocuments: {
            create: {
              fileName: 'demo-image',
              documentType: DocumentType.IMAGE,
              path: images[0],
            },
          },
          fileType: 'THUMBNAIL',
          carId: car.id,
          thumbnail: true,
        },
      });
      // }

      // Create a single CarGallery entry
      const carGallery = await prisma.carGallery.create({
        data: {
          fileType: 'IMAGES',
          carId: car.id,
          thumbnail: false,
        },
      });

      // Loop through images to create multiple CarGalleryDocuments for the same CarGallery
      for await (const image of images) {
        await prisma.carGalleryDocuments.create({
          data: {
            fileName: 'demo-image',
            documentType: DocumentType.IMAGE,
            path: image,
            carGalleryId: carGallery.id, // Use the same CarGallery ID
          },
        });
      }

      const inspectionReports = getRandomCarImages(1);

      for await (const inspectionReport of inspectionReports) {
        await prisma.carProduct.create({
          data: {
            fileType: 'INSPECTION REPORT',
            amount: 100,
            discountedAmount: 99,
            carId: car.id,
            carProductDocuments: {
              create: {
                fileName: 'demo inspection report',
                documentType: DocumentType.DOCUMENT,
                path: inspectionReport,
              },
            },
          },
        });
      }

      const serviceHistorys = getRandomCarImages(1);

      for await (const serviceHistory of serviceHistorys) {
        await prisma.carProduct.create({
          data: {
            discountedAmount: 99,
            carProductDocuments: {
              create: {
                documentType: DocumentType.DOCUMENT,
                fileName: 'demo service history',
                path: serviceHistory,
              },
            },
            fileType: 'SERVICE HISTORY',
            amount: 200,
            carId: car.id,
          },
        });
      }

      await prisma.carGallery.create({
        data: {
          carGalleryDocuments: {
            create: {
              fileName: 'demo-car-video',
              documentType: DocumentType.VIDEO,
              path: carVideo,
            },
          },
          fileType: 'VIDEO',
          carId: car.id,
          thumbnail: false,
        },
      });

      await prisma.carProduct.create({
        data: {
          discountedAmount: 99,
          carProductDocuments: {
            create: {
              documentType: DocumentType.VIDEO,
              fileName: 'car video',
              path: carVideo,
            },
          },
          fileType: 'VIDEO',
          amount: 300,
          carId: car.id,
        },
      });
    }
  }
}
