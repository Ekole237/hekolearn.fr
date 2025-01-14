"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceFilters, LEVELS, SUBJECTS, RESOURCE_TYPES, SORT_OPTIONS } from "@/types/filters";
import { TagFilter } from "./tag-filter";
import { useEffect, useState, useCallback, memo } from "react";
import { clientService } from "@/lib/services/client-service";

interface FilterBarProps {
  filters: ResourceFilters;
  onFilterChange: (key: keyof ResourceFilters, value: any) => void;
  disabled?: boolean;
}

const FilterBar = memo(function FilterBar({ filters, onFilterChange, disabled }: FilterBarProps) {
  const [tags, setTags] = useState([]);

  // Charger les tags au montage du composant
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await clientService.getTags();
        setTags(tags);
      } catch (error) {
        console.error("Erreur lors du chargement des tags:", error);
      }
    };
    loadTags();
  }, []);

  // Callbacks mémorisés pour les changements de valeur
  const handleSubjectChange = useCallback(
    (value: string) => onFilterChange("subject", value === "all" ? null : value),
    [onFilterChange]
  );

  const handleLevelChange = useCallback(
    (value: string) => onFilterChange("level", value === "all" ? null : value),
    [onFilterChange]
  );

  const handleTypeChange = useCallback(
    (value: string) => onFilterChange("type", value === "all" ? null : value),
    [onFilterChange]
  );

  const handleSortChange = useCallback(
    (value: string) => onFilterChange("sortBy", value),
    [onFilterChange]
  );

  const handleTagsChange = useCallback(
    (tags: string[]) => onFilterChange("tags", tags),
    [onFilterChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.subject ?? "all"}
          onValueChange={handleSubjectChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject.value} value={subject.value}>
                {subject.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.level ?? "all"}
          onValueChange={handleLevelChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={handleTypeChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {RESOURCE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={handleSortChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TagFilter
        tags={tags}
        selectedTags={filters.tags || []}
        onTagsChange={handleTagsChange}
      />
    </div>
  );
});

FilterBar.displayName = "FilterBar";

export { FilterBar };
