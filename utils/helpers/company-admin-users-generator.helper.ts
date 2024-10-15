import { faker } from "@faker-js/faker";
import type { ICompanyAdminUsersListTableRow } from "../interfaces/company-admin-users-list-table";

export const generateCompanyAdminUsersData = (
  numRows: number
): ICompanyAdminUsersListTableRow[] => {
  const data: ICompanyAdminUsersListTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      user_name: faker.name.fullName(),
      user_mail: faker.internet.email(),
      process: faker.datatype.number({ min: 0, max: 50 }),
    });
  }

  return data;
};
