export type SortOption = 'recent' | 'downloads' | 'relevance';

export interface ResourceFilters {
  search: string;
  subject?: string;
  level?: string;
  type?: string;
  tags?: string[];
  sortBy: SortOption;
}

export const RESOURCE_TYPES = [
  { value: 'document', label: 'Document' },
  { value: 'exercise', label: 'Exercice' },
  { value: 'video', label: 'Vidéo' },
  { value: 'quiz', label: 'Quiz' }
] as const;

export const SUBJECTS = [
  { value: 'Mathématiques', label: 'Mathématiques' },
  { value: 'Français', label: 'Français' },
  { value: 'Histoire-Géographie', label: 'Histoire-Géographie' },
  { value: 'Physique-Chimie', label: 'Physique-Chimie' },
  { value: 'SVT', label: 'SVT' },
  { value: 'Anglais', label: 'Anglais' }
] as const;

export const LEVELS = [
  { value: '6ème', label: '6ème' },
  { value: '5ème', label: '5ème' },
  { value: '4ème', label: '4ème' },
  { value: '3ème', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ère', label: '1ère' },
  { value: 'Terminale', label: 'Terminale' }
] as const;

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'downloads', label: 'Plus téléchargé' },
  { value: 'relevance', label: 'Pertinence' }
] as const;
