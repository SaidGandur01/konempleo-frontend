import { faker } from "@faker-js/faker";
import type { ICompanyAdminOffersListTableRow } from "../interfaces";

export const generateCompanyAdminOffersListData = (numRows: number): ICompanyAdminOffersListTableRow[] => {
  const data: ICompanyAdminOffersListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      number: i + 1,
      offer_name: faker.company.catchPhrase(),
      candidates: faker.datatype.number({ min: 10, max: 100 }),
      contacted: faker.datatype.number({ min: 0, max: 100 }),
      tus_datos: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 100 }) : faker.lorem.word(),
      cv_assigned: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 100 }) : faker.lorem.word(),
      whatsapp_message: faker.datatype.boolean() ? faker.datatype.number({ min: 1, max: 100 }) : faker.lorem.word(),
      offer_closed: faker.datatype.boolean(),
    });
  }

  return data;
};
