import { faker } from "@faker-js/faker";
import type { ICandidatesTableRow } from "../interfaces";

const getWhatsAppStatus = ():
  | "success"
  | "pending"
  | "danger"
  | "info"
  | "default" => {
  const statuses = ["success", "pending", "danger"];
  return faker.helpers.arrayElement(statuses) as
    | "success"
    | "pending"
    | "danger"
    | "info"
    | "default";
};
const getTusDatosStatus = ():
  | "success"
  | "pending"
  | "danger"
  | "info"
  | "default" => {
  const statuses = ["success", "pending", "danger"];
  return faker.helpers.arrayElement(statuses) as
    | "success"
    | "pending"
    | "danger"
    | "info"
    | "default";
};

export const generateCandidatesData = (numRows: number): ICandidatesTableRow[] => {
  const data: ICandidatesTableRow[] = [];

  for (let i = 0; i < numRows; i++) {
    data.push({
      id: i + 1,
      icon: faker.image.avatar(),
      ranking: i + 1,
      nombre: faker.name.fullName(),
      whatsapp: getWhatsAppStatus(),
      tusDatos: getTusDatosStatus(),
      movil: faker.phone.number('##########'),
      mail: faker.internet.email(),
      score: faker.datatype.number({ min: 0, max: 10 }).toFixed(1),
      contratado: faker.datatype.boolean() ? "OK" : "N/A",
      comments: faker.lorem.sentence(),
    });
  }

  return data;
};
