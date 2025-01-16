'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BoldIcon, 
  ItalicIcon, 
  CodeIcon, 
  ListIcon, 
  ListOrderedIcon, 
  QuoteIcon, 
  Heading2Icon,
  FunctionSquareIcon,
  SigmaSquareIcon 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownPreview } from './markdown-preview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: (textarea: HTMLTextAreaElement) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu ici...",
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const insertText = (
    textarea: HTMLTextAreaElement,
    before: string,
    after: string = ""
  ) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText =
      textarea.value.substring(0, start) +
      before +
      selectedText +
      after +
      textarea.value.substring(end);

    onChange(newText);
  };

  const toolbarButtons = [
    {
      icon: BoldIcon,
      label: "Gras",
      action: (textarea) => insertText(textarea, "**", "**"),
    },
    {
      icon: ItalicIcon,
      label: "Italique",
      action: (textarea) => insertText(textarea, "_", "_"),
    },
    {
      icon: CodeIcon,
      label: "Code",
      action: (textarea) => insertText(textarea, "\n```js\n", "\n```\n"),
    },
    {
      icon: ListIcon,
      label: "Liste à puces",
      action: (textarea) => insertText(textarea, "- "),
    },
    {
      icon: ListOrderedIcon,
      label: "Liste numérotée",
      action: (textarea) => insertText(textarea, "1. "),
    },
    {
      icon: QuoteIcon,
      label: "Citation",
      action: (textarea) => insertText(textarea, "> "),
    },
    {
      icon: Heading2Icon,
      label: "Titre",
      action: (textarea) => insertText(textarea, "## "),
    },
    {
      icon: FunctionSquareIcon,
      label: "Formule mathématique",
      action: (textarea) => insertText(textarea, "$", "$"),
    },
    {
      icon: SigmaSquareIcon,
      label: "Bloc mathématique",
      action: (textarea) => insertText(textarea, "\n$$\n", "\n$$\n"),
    },
  ];

  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="flex items-center gap-1 border-b bg-muted/50 p-1">
        <TooltipProvider>
          {toolbarButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    if (textareaRef.current) {
                      button.action(textareaRef.current);
                    }
                  }}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <div className="ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setPreviewMode(!previewMode);
              }}
            >
              {previewMode ? "Éditer" : "Aperçu"}
            </Button>
          </div>
        </TooltipProvider>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-[200px] w-full resize-none border-0 bg-transparent p-4 placeholder:text-muted-foreground focus-visible:outline-none",
            previewMode && "hidden"
          )}
        />
        {previewMode && (
          <div className="prose prose-slate max-w-none p-4">
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}
