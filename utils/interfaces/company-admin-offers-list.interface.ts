export interface ICompanyAdminOffersListTableRow {
  id: number;
  name: string;
  vacants: number;
  contacted: number;
  tus_datos: number | string;
  assigned_cvs: number | string;
  whatsapp_message: number | string;
  active: boolean;
  vitae_offer_count: number;
};
