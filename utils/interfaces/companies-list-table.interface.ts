export interface ICompaniesListTableRow {
  id: number;
  logo: string;
  name: string;
  picture: string;
  cv_count: number;
  totaloffers: number;
  availableoffers: number;
  activeoffers: number;
  used_offers: number;
  total_contacted: number;
  total_interested: number;
  recruiter_email: string;
  active: boolean;
};
