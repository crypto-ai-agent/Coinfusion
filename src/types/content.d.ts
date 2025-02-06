
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
  workflow_status?: ContentWorkflow['workflow_status'];
  scheduled_publish_at?: string;
  review_feedback?: string[];
  revision_history?: ContentWorkflow['revision_history'];
  reviewers?: string[];
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
  is_expert_quiz?: boolean;
}

export interface QuizQuestionListProps {
  quizId: string;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  parent_path?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentWorkflow {
  workflow_status: 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'scheduled' | 'published' | 'archived';
  scheduled_publish_at?: string;
  review_feedback?: string[];
  revision_history?: Array<{
    version: number;
    changes: Record<string, any>;
    timestamp: string;
    editor_id: string;
  }>;
  reviewers?: string[];
}

