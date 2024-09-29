import { faker } from "@faker-js/faker";
import type { ISuperUsersListTableRow } from "../interfaces";

export const generateSuperUsersData = (
  numRows: number
): ISuperUsersListTableRow[] => {
  const data: ISuperUsersListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      user_name: faker.name.fullName(),
      user_mail: faker.internet.email(),
      user_type: faker.helpers.arrayElement(["Super Admin", "Admin", "Company", "Company Admin"]),
      companies: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () =>
        faker.company.name()
      ),
    });
  }

  return data;
};
