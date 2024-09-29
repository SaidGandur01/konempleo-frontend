import { faker } from "@faker-js/faker";
import type { ICandidatesTableRow } from "../interfaces";

export const generateCandidatesData = (numRows: number): ICandidatesTableRow[] => {
  const data: ICandidatesTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      ranking: i + 1,
      nombre: faker.name.fullName(),
      movil: faker.phone.number('##########'),
      mail: faker.internet.email(),
      score: faker.datatype.number({ min: 0, max: 10 }).toFixed(1),
      contratado: faker.datatype.boolean()
    });
  }

  return data;
};
