export interface Teacher {
  id: string;
  full_name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
