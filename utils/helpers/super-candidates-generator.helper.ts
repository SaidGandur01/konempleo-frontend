import { faker } from "@faker-js/faker";
import type { ISuperCandidatesTableRow } from "../interfaces";

export const generateSuperCandidatesData = (numRows: number): ISuperCandidatesTableRow[] => {
  const data: ISuperCandidatesTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      name: faker.name.fullName(),
      dni: faker.datatype.number({ min: 10000000, max: 99999999 }).toString(),  // Random 8-digit DNI
      city: faker.address.city(),
      skills: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () =>
        faker.lorem.word()
      ),
      gender: faker.helpers.arrayElement(['male', 'female']),
      phone: faker.phone.number('##########'),
      mail: faker.internet.email(),
      score: faker.datatype.number({ min: 0, max: 10 }),
      average_experience_in_years: faker.datatype.number({ min: 1, max: 20 }),
      average_time_per_job: faker.datatype.number({ min: 1, max: 5 }),
      education_level: faker.helpers.arrayElement(['secundaria', 'bachiller', 'universitario']),
    });
  }

  return data;
};
