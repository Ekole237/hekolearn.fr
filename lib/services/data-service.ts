import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Resource, Tag } from '@/types/resources';
import type { Teacher } from '@/types/teachers';
import type { ResourceFilters } from '@/types/filters';

// Création d'un client Supabase côté serveur avec mise en cache
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
});

export const dataService = {
  // Ressources avec filtres
  async getResources(filters?: ResourceFilters) {
    const supabase = createServerSupabaseClient();
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
    } else {
      // Tri par défaut
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Resource[];
  },

  async getResourcesBySubject(subject: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        tags:resource_tags(
          tag:tags(*)
        )
      `)
      .eq('subject', subject)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Resource[];
  },

  // Tags
  async getTags() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Tag[];
  },

  // Statistiques des ressources
  async getStats() {
    const supabase = createServerSupabaseClient();
    
    // Nombre total de ressources
    const { count: resourceCount, error: resourceError } = await supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });

    if (resourceError) throw resourceError;

    // Nombre de matières uniques
    const { data: subjects, error: subjectsError } = await supabase
      .from('resources')
      .select('subject', { count: 'exact', head: false })
      .order('subject');

    if (subjectsError) throw subjectsError;

    // On utilise un Set pour obtenir les matières uniques
    const uniqueSubjects = new Set(subjects?.map(s => s.subject));

    // Nombre de téléchargements
    const { data: downloads, error: downloadsError } = await supabase
      .from('resources')
      .select('download_count')
      .gt('download_count', 0);

    if (downloadsError) throw downloadsError;

    const totalDownloads = downloads?.reduce((acc, curr) => acc + (curr.download_count || 0), 0) || 0;

    return {
      resourceCount: resourceCount || 0,
      subjectCount: uniqueSubjects.size,
      totalDownloads,
    };
  },

  // Enseignants
  async getTeachers() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('active', true)
      .order('order_index');

    if (error) throw error;
    return data as Teacher[];
  }
};
