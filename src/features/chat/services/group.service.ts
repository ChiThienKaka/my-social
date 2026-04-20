import { http } from "@/app/api/http";

export interface GroupItem {
  group_id: number;
  member_role: string;
  group: {
    group_id: number;
    group_name: string;
    group_type: string;
    avatar_url: string | null;
    cover_image: string | null;
    privacy: string;
  };
}

interface GetGroupsResponse {
  data: GroupItem[];
}

export const groupService = {
  getGroupsByUser: async (): Promise<GroupItem[]> => {
    const response = await http.get<GetGroupsResponse>(
      "/api/group-student/get-group-students-by-user"
    );
    return response.data?.data ?? [];
  },
};
