import { http } from "@/app/api/http";
import type { Job, JobDetail, JobCompanyDetail, JobSkill } from "../types/job";

// Raw types từ API (phản ánh đúng JSON backend trả về)
interface JobApi {
  job_id: number;
  job_title: string;
  job_description?: string;
  requirements?: string;
  benefits?: string;
  salary_min?: string;
  salary_max?: string;
  job_type: string;
  experience_level?: string;
  work_mode?: string;
  location_province: string;
  location_district?: string;
  location_address?: string;
  application_deadline?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_person?: string;
  published_at?: string | null;
  created_at: string;
  company_name: string;
  company_url?: string;
}

// Response dạng pagination từ API getJobs
interface JobsListResponse {
  data: JobApi[];
  current_page: number;
  total_pages: number;
  total: number;
}

export const jobService = {
  /**
   * Get list of job posts
   * Endpoint: GET /api/job-post/list
   */
  getJobs: async (params?: {
    search?: string;
    type?: string;
    category?: string;
    page?: number;
  }): Promise<{
    jobs: Job[];
    current_page: number;
    total: number;
    total_pages: number;
  }> => {
    const response = await http.get<JobsListResponse>("/api/job-post/list", {
      params,
    });

    const items = response.data?.data ?? [];

    const jobs: Job[] = items.map<Job>((item) => {
      const salaryMin = item.salary_min ? Number(item.salary_min) : undefined;
      const salaryMax = item.salary_max ? Number(item.salary_max) : undefined;

      const locationParts = [
        item.location_address,
        item.location_district,
        item.location_province,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        id: item.job_id,
        title: item.job_title,
        description: item.job_description,
        company: {
          name: item.company_name,
          logo_url: item.company_url,
        },
        job_type: item.job_type,
        experience_level: item.experience_level,
        work_mode: item.work_mode,
        location: locationParts,
        location_province: item.location_province,
        application_deadline: item.application_deadline,
        created_at: item.created_at,
        salary_min: salaryMin,
        salary_max: salaryMax,
        contact_email: item.contact_email,
        contact_phone: item.contact_phone,
        contact_person: item.contact_person,
        is_bookmarked: false,
      };
    });

    return {
      jobs,
      current_page: response.data?.current_page ?? 1,
      total: response.data?.total ?? 0,
      total_pages: response.data?.total_pages ?? 1,
    };
  },

  /**
   * Get job detail by ID
   * Endpoint: GET /api/job-post/list-detail?job_id={id}
   */
  getJobDetail: async (jobId: number | string): Promise<JobDetail> => {
    const response = await http.get<{
      jobpost: {
        job_id: number;
        job_title: string;
        job_description?: string;
        requirements?: string;
        benefits?: string;
        salary_min?: string;
        salary_max?: string;
        job_type: string;
        experience_level?: string;
        work_mode?: string;
        location_province: string;
        location_district?: string;
        location_address?: string;
        application_deadline?: string;
        contact_email?: string;
        contact_phone?: string;
        contact_person?: string;
        published_at?: string | null;
        created_at: string;
        company: {
          company_id: number;
          company_name: string;
          company_tax_code?: string;
          company_address?: string;
          company_phone?: string;
          company_email?: string;
          company_website?: string | null;
          company_logo?: string | null;
          company_url?: string;
          company_size?: string;
          company_industry?: string;
          company_description?: string | null;
          verification_documents?: string | null;
        };
      };
      jobskill: Array<{
        skill_id: number;
        skill_name: string;
        skill_category: string;
        proficiency_level: string;
        is_required: boolean;
      }>;
    }>("/api/job-post/list-detail", {
      params: { job_id: jobId },
    });

    const { jobpost, jobskill } = response.data;

    const salaryMin = jobpost.salary_min ? Number(jobpost.salary_min) : undefined;
    const salaryMax = jobpost.salary_max ? Number(jobpost.salary_max) : undefined;

    const locationParts = [
      jobpost.location_address,
      jobpost.location_district,
      jobpost.location_province,
    ]
      .filter(Boolean)
      .join(", ");

    const skills: JobSkill[] = jobskill.map((skill) => ({
      id: skill.skill_id,
      name: skill.skill_name,
      category: skill.skill_category,
      proficiency_level: skill.proficiency_level,
      is_required: skill.is_required,
    }));

    return {
      id: jobpost.job_id,
      title: jobpost.job_title,
      description: jobpost.job_description,
      requirements: jobpost.requirements,
      benefits: jobpost.benefits,
      company: {
        id: jobpost.company.company_id,
        name: jobpost.company.company_name,
        tax_code: jobpost.company.company_tax_code,
        address: jobpost.company.company_address,
        phone: jobpost.company.company_phone,
        email: jobpost.company.company_email,
        website: jobpost.company.company_website,
        logo_url: jobpost.company.company_url || jobpost.company.company_logo,
        size: jobpost.company.company_size,
        industry: jobpost.company.company_industry,
        description: jobpost.company.company_description,
      },
      job_type: jobpost.job_type,
      experience_level: jobpost.experience_level,
      work_mode: jobpost.work_mode,
      location: locationParts,
      location_province: jobpost.location_province,
      location_district: jobpost.location_district,
      location_address: jobpost.location_address,
      application_deadline: jobpost.application_deadline,
      created_at: jobpost.created_at,
      salary_min: salaryMin,
      salary_max: salaryMax,
      contact_email: jobpost.contact_email,
      contact_phone: jobpost.contact_phone,
      contact_person: jobpost.contact_person,
      skills,
      is_bookmarked: false,
    };
  },
};
