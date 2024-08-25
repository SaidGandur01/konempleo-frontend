export interface ISuperOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  offer_name: string;
  candidates: number;
  contacted: number;
  ecg: number | string;
  accuracy: number | string;
  score: number | string;
  assigned_cvs: number;
};