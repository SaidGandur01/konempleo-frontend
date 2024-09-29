export interface ISuperCandidatesTableRow {
  id: number;
  name: string;
  dni: string | number;
  city: string;
  skills: string[];
  gender: 'male' | 'female';
  phone: string;
  mail : string;
  score: number;
  average_experience_in_years: number;
  average_time_per_job: number;
  education_level: 'secundaria' | 'bachiller' | 'universitario';
};
