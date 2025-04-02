import { Roles, UserStatus } from '@prisma/client';
import { appEnv } from '../../src/config/app-env';

const users = [];
for (let i = 0; i < 5; i++) {
  users.push({
    firstName: `Customer${i + 1}`,
    lastName: 'Doe',
    userStatus: UserStatus.ONBOARDED,
    email: `customer${i + 1}@gmail.com`,
    role: Roles.USER,
    isEmailConfirmed: true,
    phoneNumber: `+91827372828${i + 1}`,
    isPhoneNumberConfirmed: true,
  });
}

const dealers = [];
for (let i = 0; i < 8; i++) {
  dealers.push({
    firstName: `Dealer${i + 1}`,
    lastName: 'Doe',
    email: `dealer${i + 1}@gmail.com`,
    isEmailConfirmed: true,
    role: Roles.DEALER,
    phoneNumber: `+91817372828${i + 1}`,
    isPhoneNumberConfirmed: true,
    companyName: `company${i + 1}`,
    location: 'Kolkata',
    userStatus: 'ONBOARDED',
  });
}

dealers.push({
  firstName: 'Joyrudra',
  lastName: 'Biswas',
  email: 'joyrudra@itobuz.com',
  isEmailConfirmed: true,
  role: Roles.DEALER,
  phoneNumber: `+919064690593`,
  isPhoneNumberConfirmed: true,
  companyName: `Itobuz`,
  location: 'Kolkata',
  userStatus: 'ONBOARDED',
});

const admins = [
  {
    firstName: 'Admin',
    lastName: 'Singh',
    adminStatus: UserStatus.ONBOARDED,
    email: appEnv.ADMIN_EMAIL,
    role: Roles.ADMIN,
  },
  {
    firstName: 'Kabir',
    lastName: 'Sa',
    adminStatus: UserStatus.ONBOARDED,
    email: 'kabir@itobuz.com',
    role: Roles.ADMIN,
  },
];

export { users, dealers, admins };
