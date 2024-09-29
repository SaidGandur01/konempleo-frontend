export interface ISuperOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  offer_name: string;
  candidates: number;
  contacted: number;
  ecg: number | string;
  accuracy: number | string;
  tus_datos: string;
  assigned_cvs: number;
  whatsapp_message: string;
  offer_close: boolean;
};
