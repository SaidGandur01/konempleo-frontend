import { faker } from "@faker-js/faker";
import type { ICompanyOffersListTableRow } from "../interfaces";

const offerNames = ["auxiliary", "conductor", "vigilante", "constructor"];

export const generateCompanyOffersData = (numRows: number): ICompanyOffersListTableRow[] => {
  const data: ICompanyOffersListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      icon: faker.image.avatar(),
      number: i + 1,
      offer_name: faker.helpers.arrayElement(offerNames),
      candidates: faker.datatype.number({ min: 10, max: 100 }),
      contacted: faker.datatype.number({ min: 0, max: 100 }),
      ecg: faker.datatype.number({ min: 0, max: 100 }) + "%",
      accuracy: faker.datatype.number({ min: 0, max: 100 }) + "%",
      tus_datos: faker.datatype.number({ min: 0, max: 10 }),
      cv_assigned: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 100 }) : faker.lorem.word(),
      whatsapp_message: faker.lorem.word({ length: 6, strategy: 'any-length' }),
      offer_closed: faker.datatype.boolean(),
    });
  }

  return data;
};
