export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'video' | 'exercise' | 'tool';
  subject: string;
  level?: string;
  file_url?: string;
  thumbnail_url?: string;
  download_count: number;
  is_premium: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface ResourceTag {
  id: string;
  resource_id: string;
  tag_id: string;
  created_at: string;
}
