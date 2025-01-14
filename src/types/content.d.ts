export interface Content {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  slug: string;
  published: boolean;
  content_type: 'guide' | 'educational';
  quiz_id?: string | null;
  has_quiz?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  content_id: string | null;
  quiz_type: string;
  points: number;
  difficulty_level: string;
  estimated_duration?: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  quiz_categories?: {
    name: string;
  };
}