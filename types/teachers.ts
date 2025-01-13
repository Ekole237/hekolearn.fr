export interface Teacher {
  id: string;
  profile_id: string;
  full_name: string;
  role_title: string;
  subjects: string[];
  bio: string;
  education: string;
  avatar_url: string | null;
  is_founder: boolean;
  order_index: number;
  active: boolean;
  created_at: string;
}
