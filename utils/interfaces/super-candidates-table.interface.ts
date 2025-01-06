export interface ISuperCandidatesTableRow {
  vitae_offer_id: number;
  candidate_name: string;
  dni: string | number;
  city: string;
  skills: string[];
  gender: 'male' | 'female';
  candidate_phone: string;
  candidate_mail : string;
  response_score: number;
  average_experience_in_years: number;
  average_time_per_job: number;
  education_level: 'secundaria' | 'bachiller' | 'universitario';
};
