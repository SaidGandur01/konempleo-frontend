export interface ICompanyOffersListTableRow {
  id: number;
  icon: string;
  name: string;
  vacants: number;
  contacted: number;
  ecg: number | string;
  accuracy: number | string;
  tus_datos: number | string;
  assigned_cvs: number | string;
  whatsapp_message: string;
  active: boolean;
  vitae_offer_count: number
};
