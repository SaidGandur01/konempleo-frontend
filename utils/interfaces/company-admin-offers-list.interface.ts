export interface ICompanyAdminOffersListTableRow {
  number: number;
  offer_name: string;
  candidates: number;
  contacted: number;
  tus_datos: number | string;
  cv_assigned: number | string;
  whatsapp_message: number | string;
  offer_closed: boolean;
};
