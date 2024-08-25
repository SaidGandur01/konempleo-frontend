import { faker } from "@faker-js/faker";
import type { ISuperCompaniesListTableRow } from "../interfaces";

export const generateSuperCompaniesData = (
  numRows: number
): ISuperCompaniesListTableRow[] => {
  const data: ISuperCompaniesListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      logo: faker.image.avatar(),
      company_name: `company ${i + 1}`,
      active_process: faker.datatype.number({ min: 10, max: 50 }),
      cv_loaded: faker.datatype.number({ min: 0, max: 50 }),
      granted_offers: faker.datatype.number({ min: 0, max: 50 }),
      associated_user: faker.name.fullName(),
      mail: faker.internet.email(),
      koe_user: faker.internet.email()
    });
  }

  return data;
};
