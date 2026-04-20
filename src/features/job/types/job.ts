// Frontend-normalized types (FE model)
// Luôn dùng các tên field consistent trên FE, không phụ thuộc backend.

export interface JobCompany {
  name: string;
  logo_url?: string | null;
}

export interface JobCompanyDetail {
  id: number;
  name: string;
  tax_code?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string | null;
  logo_url?: string | null;
  size?: string;
  industry?: string;
  description?: string | null;
}

export interface JobSkill {
  id: number;
  name: string;
  category: string; // soft_skill | general_skill | language | ...
  proficiency_level: string; // beginner | intermediate | expert
  is_required: boolean;
}

export type JobType = "fulltime" | "parttime" | "internship" | string;

export interface Job {
  id: number | string;
  title: string;
  description?: string;
  company: JobCompany;
  job_type: JobType | string;
  experience_level?: string;
  work_mode?: string; // onsite | remote | hybrid | ...
  location: string; // gộp tỉnh/thành + quận/huyện
  location_province?: string; // tỉnh/thành phố
  application_deadline?: string; // ISO string
  created_at: string; // ISO string
  salary_min?: number;
  salary_max?: number;
  contact_email?: string;
  contact_phone?: string;
  contact_person?: string;
  is_bookmarked?: boolean;
}

export interface JobDetail extends Job {
  requirements?: string;
  benefits?: string;
  location_district?: string;
  location_address?: string;
  company: JobCompanyDetail;
  skills?: JobSkill[];
}
