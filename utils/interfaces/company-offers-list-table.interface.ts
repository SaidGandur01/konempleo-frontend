export interface ICompanyOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  offer_name: string;
  candidates: number;
  contacted: number;
  ecg: number | string;
  accuracy: number | string;
  tus_datos: number | string;
  cv_assigned: number | string;
  whatsapp_message: string;
  offer_closed: boolean;
};
