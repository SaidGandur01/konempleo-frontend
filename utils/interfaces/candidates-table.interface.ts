export interface ICandidatesTableRow {
  id: number;
  icon: string;
  ranking: number;
  nombre: string;
  whatsapp: "success" | "pending" | "danger" | "info" | "default";
  tusDatos: "success" | "pending" | "danger" | "info" | "default";
  movil: string;
  mail: string;
  score: number | string;
  contratado: string;
};
