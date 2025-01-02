export interface ISuperOffersListTableRow {
  id: number;
  icon: string;
  number: number;
  name: string;
  vacants: number;
  contacted: number;
  ecg: number | string;
  accuracy: number | string;
  tus_datos: string;
  assigned_cvs: number;
  whatsapp_message: string;
  active: boolean;
  showCVInput?:boolean;
}
