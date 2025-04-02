import faker from 'faker';
import _ from 'lodash';

export type Contact = {
  accessLevel: string;
  avatarURL: string;
  company: string;
  companyCount: number;
  attentionCount: number;
  reportCounts: number;
  department: string;
  email: string;
  id: number;
  name: string;
  telephone: string;
  username: string;
};

export type UserContact = {
  accessLevel: string;
  avatarURL: string;
  company: string;
  department: string;
  email: string;
  id: number;
  name: string;
  telephone: string;
  username: string;
  manager: string;
  salaryBand: number;
  region : string;
};

export type UserDepartment = {
  label: string;
  value: string;
  type?: string;
  checked?: boolean;
};

export type SettingsSubCategoryItem = {
  id: number;
  name: string;
};

export type SettingsSubCategory = {
  id: number;
  name: string;
  items: SettingsSubCategoryItem[];
};

export type SettingsCategory = {
  id: number;
  name: string;
  subCategories: SettingsSubCategory[];
};

export type EmailTemplateList = {
  id: number;
  title: string;
  description: string;
};

export function makeContact(): Contact {
  return {
    accessLevel: 'data',
    avatarURL: faker.image.avatar(),
    company: faker.company.companyName(),
    companyCount: faker.datatype.number(),
    attentionCount: faker.datatype.number(),
    reportCounts: faker.datatype.number(),
    department: faker.commerce.department(),
    email: faker.internet.email(),
    id: faker.datatype.number(),
    name: faker.name.findName(),
    telephone: '123-456-7890',
    username: faker.internet.userName(),
  };
}

export function makeUserContact(): UserContact {
  return {
    accessLevel: 'data',
    avatarURL: faker.image.avatar(),
    company: faker.company.companyName(),
    department: faker.commerce.department(),
    email: faker.internet.email(),
    id: faker.datatype.number(),
    name: faker.name.findName(),
    telephone: '123-456-7890',
    username: faker.internet.userName(),
    manager: faker.internet.userName(),
    salaryBand: faker.datatype.number(),
    region: faker.commerce.department(),
  };
}

export function getDepartMents() {
  return _.range(0, 5).map(() => {
    const d = faker.lorem.words(2); 
    return {
      label: d,
      value: d
    };
  });
}

export function makeTickets() {
  return {
    title: faker.random.words(6),
    open: faker.datatype.boolean()
  };
}

export function makeLaunchRow() {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(4),
    date: faker.datatype.datetime()
  };
}

export function makeLaunchDetail() {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(4),
    date: faker.datatype.datetime(),
    mail: faker.lorem.paragraph()
  };
}

export function makeEmailTemplateList(): EmailTemplateList {
  return {
    id: faker.datatype.number(),
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(4)
  };
}

export function makeLaunchEmail() {
  return {
    title: faker.lorem.words(2),
    description: faker.lorem.sentences(4),
    date: faker.datatype.datetime()
  };
}

export function makeGroupModifyList() {
  return {
    id: faker.datatype.uuid(),
    title: faker.internet.userName(),
    email: faker.internet.email(),
    department: faker.commerce.department(),
    manager: faker.company.companyName(),
    salaryBand: faker.finance.amount(),
    region: faker.address.country()
  };
}

export function makeGroupItem() {
  return {
    id: faker.datatype.uuid(),
    groupName: faker.lorem.words(2),
  };
}

export function selectGroupItem() {
  return {
    id: faker.datatype.uuid(),
    groupName: faker.company.companyName(),
    companyCount: faker.datatype.number(),
  };
}

export function createData() {
 return {
  id: faker.datatype.uuid(),
  name: faker.lorem.words(3),
 };
}

export function makeCompanyList() {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.words(2),
    contact: faker.datatype.number(),
    sic: faker.datatype.number(),
    employees: faker.datatype.number(),
    city: faker.address.city(),
    state: faker.address.state(),
    region: faker.address.state(),
  };
}

export function useCaseItems() {
  return {
    id: faker.datatype.uuid(),
    caseTitle: faker.lorem.words(1),
    accessKey: faker.lorem.words(2),
    caseLists: faker.name.title()
  };
}
