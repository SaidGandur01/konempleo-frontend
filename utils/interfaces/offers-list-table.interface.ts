export interface IOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  name: string;
  vacants: number;
  smartdataId_count: number;
  interested_count: number;
  background_check_count: number;
  assigned_cvs: number | string;
  active: boolean;
  vitae_offer_count: number;
};
