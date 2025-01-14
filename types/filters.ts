export type SortOption = 'recent' | 'downloads' | 'relevance';

export interface ResourceFilters {
  search: string;
  subject?: string;
  level?: string;
  type?: string;
  tags?: string[];
  sortBy: 'recent' | 'downloads' | 'relevance';
}

export const RESOURCE_TYPES = [
  { value: 'document', label: 'Document' },
  { value: 'video', label: 'Vidéo' },
  { value: 'exercise', label: 'Exercice' },
  { value: 'tool', label: 'Outil' },
] as const;

export const SUBJECTS = [
  { value: 'mathematics', label: 'Mathématiques' },
  { value: 'physics', label: 'Physique' },
  { value: 'chemistry', label: 'Chimie' },
  { value: 'biology', label: 'Biologie' },
  { value: 'french', label: 'Français' },
  { value: 'english', label: 'Anglais' },
  { value: 'history', label: 'Histoire' },
  { value: 'geography', label: 'Géographie' },
] as const;

export const LEVELS = [
  { value: 'primary', label: 'Primaire' },
  { value: 'middle-school', label: 'Collège' },
  { value: 'high-school', label: 'Lycée' },
  { value: 'higher-education', label: 'Supérieur' },
] as const;

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'downloads', label: 'Plus téléchargé' },
  { value: 'relevance', label: 'Pertinence' },
] as const;
