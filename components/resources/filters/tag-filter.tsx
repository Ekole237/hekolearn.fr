"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ tags, selectedTags, onTagsChange }: TagFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId));
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:w-[200px]"
          >
            <span>Sélectionner des tags</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 md:w-[200px]">
          <Command>
            <CommandInput placeholder="Rechercher un tag..." />
            <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => toggleTag(tag.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTags.includes(tag.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            if (!tag) return null;

            return (
              <Badge
                key={tag.id}
                variant="outline"
                style={{
                  backgroundColor: `${tag.color}20`,
                  borderColor: tag.color,
                  color: tag.color,
                }}
                className="flex items-center gap-1"
              >
                {tag.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag.id)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
