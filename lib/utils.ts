import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(title: string) {
  return title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function linkify(content: string | undefined, knownTitles: string[] = []): string {
  if (!content) return "";

  // Handle both [[WikiLinks]] and [markdown links](url)
  return content.replace(
    /(\[\[([^\]]+)\]\]|\[([^\]]+)\]\([^)]+\))/g, 
    (match: string, _wikiLink: string, wikiTitle: string, _mdTitle: string) => {
      // Handle wiki-style links [[PageName]]
      if (wikiTitle) {
        const trimmed = wikiTitle.trim();
        const slug = slugify(trimmed);
        const exists = knownTitles.includes(trimmed);
        
        return exists
          ? `<a href="/notes/${slug}" class="text-primary hover:underline">${trimmed}</a>`
          : `<span class="text-muted-foreground">${trimmed}</span>`;
      }
      // Leave markdown links [text](url) unchanged
      return match;
    }
  );
}