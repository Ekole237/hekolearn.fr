import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Tag, Resource } from '@/types/resources';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();

  // Charger tous les tags
  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un tag à une ressource
  const addTagToResource = async (resourceId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('resource_tags')
        .insert({ resource_id: resourceId, tag_id: tagId });

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  // Retirer un tag d'une ressource
  const removeTagFromResource = async (resourceId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('resource_tags')
        .delete()
        .match({ resource_id: resourceId, tag_id: tagId });

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    }
  };

  // Charger les tags d'une ressource
  const loadResourceTags = async (resourceId: string): Promise<Tag[]> => {
    try {
      const { data, error } = await supabase
        .from('resource_tags')
        .select('tags:tag_id(*)')
        .eq('resource_id', resourceId);

      if (error) throw error;
      return data.map(item => item.tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    }
  };

  // Filtrer les ressources par tags
  const filterResourcesByTags = async (tagIds: string[]): Promise<Resource[]> => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*, resource_tags!inner(*), tags!inner(*)')
        .in('resource_tags.tag_id', tagIds);

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    }
  };

  // Créer un nouveau tag (admin seulement)
  const createTag = async (tag: Partial<Tag>) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      setTags(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  return {
    tags,
    loading,
    error,
    addTagToResource,
    removeTagFromResource,
    loadResourceTags,
    filterResourcesByTags,
    createTag,
    refresh: loadTags
  };
}
