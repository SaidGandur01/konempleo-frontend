export interface ISuperOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  name: string;
  vacants: number;
  contacted: number;
  background_check_count: number;
  interested: number;
  assigned_cvs: number;
  vitae_offer_count: number;
  whatsapp_message: string;
  active: boolean;
  city: string;
  salary: string;
  contract_type: number;
  cvCount?: number;
}
