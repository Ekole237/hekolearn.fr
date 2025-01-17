'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BoldIcon, 
  ItalicIcon, 
  CodeIcon, 
  ListIcon, 
  ListOrderedIcon, 
  QuoteIcon, 
  Heading2Icon,
  FunctionSquareIcon,
  SigmaSquareIcon,
  YoutubeIcon,
  GitGraphIcon,
  BookOpenIcon,
  HelpCircleIcon,
  FileTextIcon,
  TypeIcon,
  ArrowUpDownIcon,
  PlusIcon,
  LineChartIcon
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const templates = {
  exercice: {
    label: "Exercice",
    icon: BookOpenIcon,
    template: `# Exercice

**Énoncé :**

...

**Solution :**

...`
  },
  quiz: {
    label: "Quiz",
    icon: HelpCircleIcon,
    template: `# Quiz

1. Question 1
   - [ ] Réponse A
   - [ ] Réponse B
   - [ ] Réponse C`
  },
  variationTable: {
    label: "Tableau de variation",
    icon: ArrowUpDownIcon,
    template: `| x | -∞ | 0 | +∞ |
|---|-----|---|-----|
| f(x) | ↗ | ↘ | ↗ |`
  },
  signTable: {
    label: "Tableau de signe",
    icon: PlusIcon,
    template: `# Étude du signe de f(x) = (x+2)(x-1)

## Tableau de signe

| x           | -∞         | -2    | 1           | +∞         |
|-------------|------------|-------|-------------|------------|
| x + 2       | -         | 0     | +           | +          |
| x - 1       | -         | -     | 0           | +          |
| f(x)        | +         | 0     | 0           | +          |
|             | ←━━━━━━━━ | ━━━━━ | ━━━━━━━━━→ |            |

## Explication

1. On cherche les racines des facteurs :
   - Pour (x+2) : x = -2
   - Pour (x-1) : x = 1

2. On place ces valeurs dans le tableau en les ordonnant.

3. Pour chaque facteur :
   - On détermine le signe avant la première racine
   - Le signe change à chaque racine

4. Pour le produit f(x) :
   - On multiplie les signes
   - Le produit est nul si au moins un facteur est nul
   - (+)×(+) = +
   - (+)×(-) = -
   - (-)×(-) = +

## Conclusion

f(x) est positive sur ]-∞,-2[ ∪ ]+∞,+∞[
f(x) est négative sur ]-2,1[
f(x) s'annule en x = -2 et x = 1`
  },
  functionGraph: {
    label: "Graphique de fonction",
    icon: LineChartIcon,
    template: `\`\`\`graph
y = x^2
xMin: -5
xMax: 5
yMin: -5
yMax: 25
\`\`\``
  }
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu ici...",
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [fontSize, setFontSize] = useState("base");

  const fontSizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

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
    {
      icon: YoutubeIcon,
      label: "Vidéo YouTube",
      action: (textarea) => {
        const videoId = prompt("Entrez l'ID de la vidéo YouTube :");
        if (videoId) {
          insertText(textarea, templates.video.template.replace("VIDEO_ID", videoId));
        }
      },
    },
    {
      icon: GitGraphIcon,
      label: "Diagramme",
      action: (textarea) => insertText(textarea, templates.diagram.template),
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
              >
                <FileTextIcon className="h-4 w-4 mr-1" />
                Templates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(templates).map(([key, template]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={(e) => {
                    e.preventDefault();
                    if (textareaRef.current) {
                      insertText(textareaRef.current, template.template);
                    }
                  }}
                >
                  <template.icon className="h-4 w-4 mr-2" />
                  {template.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center ml-2 border-l pl-2">
            <TypeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <Select
              value={fontSize}
              onValueChange={setFontSize}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Très petit</SelectItem>
                <SelectItem value="sm">Petit</SelectItem>
                <SelectItem value="base">Normal</SelectItem>
                <SelectItem value="lg">Grand</SelectItem>
                <SelectItem value="xl">Très grand</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            fontSizes[fontSize as keyof typeof fontSizes],
            previewMode && "hidden"
          )}
        />
        {previewMode && (
          <div className={cn(
            "prose prose-slate max-w-none p-4",
            fontSizes[fontSize as keyof typeof fontSizes]
          )}>
            <MarkdownPreview content={value} />
          </div>
        )}
      </div>
    </div>
  );
}
