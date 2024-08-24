import { faker } from "@faker-js/faker";
import type { IOffersListTableRow } from "../interfaces";

const offerNames = ["auxiliary", "conductor", "vigilante", "constructor"];

export const generateOffersData = (numRows: number): IOffersListTableRow[] => {
  const data: IOffersListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      icon: faker.image.avatar(),
      number: i + 1,
      offer_name: faker.helpers.arrayElement(offerNames),
      candidates: faker.datatype.number({ min: 10, max: 100 }),
      contacted: faker.datatype.number({ min: 0, max: 100 }),
      ecg: faker.datatype.number({ min: 0, max: 100 }) + "%",
      accuracy: faker.datatype.number({ min: 0, max: 100 }) + "%",
      score: faker.datatype.number({ min: 0, max: 10 }).toFixed(1),
    });
  }

  return data;
};
