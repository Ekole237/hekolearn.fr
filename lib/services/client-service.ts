import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Tag, Resource } from '@/types/resources';
import type { ResourceFilters } from '@/types/filters';

const supabase = createClientComponentClient();

export const clientService = {
  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Tag[];
  },

  async getResources(filters?: ResourceFilters & { page?: number; pageSize?: number }) {
    let query = supabase
      .from('resources')
      .select(`
        *,
        tags:resource_tags(
          tag:tags(*)
        )
      `);

    // Appliquer les filtres
    if (filters) {
      // Recherche textuelle
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Filtres exacts
      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      // Filtre par tags
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Tri
      switch (filters.sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'downloads':
          query = query.order('download_count', { ascending: false });
          break;
        case 'relevance':
          if (filters.search) {
            // Pour la pertinence, on trie d'abord par correspondance exacte du titre
            query = query.order('title', { ascending: filters.search.toLowerCase() });
          } else {
            query = query.order('created_at', { ascending: false });
          }
          break;
      }

      // Pagination
      if (filters.page && filters.pageSize) {
        const start = (filters.page - 1) * filters.pageSize;
        const end = start + filters.pageSize - 1;
        query = query.range(start, end);
      }
    } else {
      // Tri par défaut
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Resource[];
  }
};
