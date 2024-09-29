import { faker } from "@faker-js/faker";
import type { ISuperOffersListTableRow } from "../interfaces";

const offerNames = ["auxiliary", "conductor", "vigilante", "constructor"];

export const generateSuperOffersData = (numRows: number): ISuperOffersListTableRow[] => {
  const data: ISuperOffersListTableRow[] = [];

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
      tus_datos: faker.lorem.words(2),
      assigned_cvs: 50,
      whatsapp_message: faker.lorem.sentence(),
      offer_close: faker.datatype.boolean(),
    });
  }

  return data;
};
