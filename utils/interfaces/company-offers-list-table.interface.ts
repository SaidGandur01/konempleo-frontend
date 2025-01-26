export interface ICompanyOffersListTableRow {
  id: number;
  icon: string;
  name: string;
  vacants: number;
  smartdataId_count: number;
  interested_count: number;
  background_check_count: number | string;
  assigned_cvs: number | string;
  whatsapp_message: string;
  active: boolean;
  vitae_offer_count: number;
  contract_type: number;
  city: string;
  salary: string;
}
