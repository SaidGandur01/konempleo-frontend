export interface ISuperCompaniesListTableRow {
  id: number;
  logo: string;
  name: string;
  cv_count: number;
  totaloffers: number;
  activeoffers: number;
  availableoffers: number;
  total_contacted: number;
  total_interested: number;
  used_offers: number;
  recruiter_name: string;
  picture: string;
  recruiter_email: string;
  admin_name: string;
  admin_email: string;
  active: boolean;
  sector: string;
  document: string;
  document_type: string;
  city: string;
  employees: number;
}
