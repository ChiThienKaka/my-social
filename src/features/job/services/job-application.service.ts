import { http } from "@/app/api/http";

export interface SubmitCVParams {
  job_id: string | number;
  email: string;
  phone: string;
  media_cv: {
    uri: string;
    name: string;
    type?: string;
  };
}

/**
 * Submit CV application.
 * Endpoint: POST /api/job-application/submit-cv
 * Content-Type: multipart/form-data
 */
export const jobApplicationService = {
  submitCV: async (params: SubmitCVParams): Promise<void> => {
    const formData = new FormData();
    formData.append("job_id", String(params.job_id));
    formData.append("email", params.email);
    formData.append("phone", params.phone);
    formData.append("media_cv", {
      uri: params.media_cv.uri,
      name: params.media_cv.name,
      type: params.media_cv.type ?? "application/pdf",
    } as any);

    await http.post("/api/job-application/submit-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
