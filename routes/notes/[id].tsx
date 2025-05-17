// deno-lint-ignore-file
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { render, CSS } from "@deno/gfm";
import { linkify } from "../../lib/utils.ts";

interface Note {
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface PageData {
  current: Note;
  allTitles: string[];
}

export const handler: Handlers<PageData | null> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    try {
      
      const noteRes = await fetch(`http://localhost:8000/api/notes/${id}`);
      if (!noteRes.ok) return ctx.renderNotFound();
      const current: Note = await noteRes.json();

      
      const titlesRes = await fetch(`http://localhost:8000/api/notes`);
      const allNotes = await titlesRes.json();
      const allTitles = allNotes.map((n: { title: string }) => n.title);

      return ctx.render({ current, allTitles });
    } catch (err) {
      console.error("Failed to fetch note:", err);
      return ctx.render(null);
    }
  },
};


export default function NotePage({ data }: PageProps<PageData | null>) {
  if (!data) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-background">
        <div class="text-center max-w-md p-6">
          <h1 class="text-3xl font-bold text-destructive mb-4">Note Not Found</h1>
          <p class="text-muted-foreground mb-6">
            The requested note could not be loaded.
          </p>
          <a
            href="/"
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const { current, allTitles } = data;
  const safeContent = current.content || "";
  const html = linkify(safeContent, allTitles);
  const description = safeContent.substring(0, 160).replace(/\n/g, ' ').trim();

  return (
    <>
      <Head>
        <title>{current.title} | Notes</title>
        <meta name="description" content={description} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <main class="max-w-3xl mx-auto py-8 px-4 sm:px-6 bg-background">
        <article class="bg-card text-card-foreground rounded-lg border shadow-sm">
          <div class="p-6 sm:p-8">
            <header class="mb-6">
              <h1 class="text-3xl font-bold mb-3">{current.title}</h1>
              
              {current.tags?.length ? (
                <div class="flex flex-wrap gap-2 mb-4">
                  {current.tags.map((tag) => (
                    <span 
                      key={tag}
                      class="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              
              {(current.createdAt || current.updatedAt) && (
                <div class="text-sm text-muted-foreground space-y-1">
                  {current.createdAt && (
                    <p>Created: {new Date(current.createdAt).toLocaleDateString()}</p>
                  )}
                  {current.updatedAt && (
                    <p>Updated: {new Date(current.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </header>

            <div
              class="markdown-body p-2 rounded-md prose prose-sm sm:prose-base max-w-none 
              prose-headings:text-foreground
              prose-p:text-foreground
              prose-a:text-primary hover:prose-a:text-primary/80
              prose-strong:text-foreground
              prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-muted prose-pre:border prose-pre:overflow-x-auto
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: render(html) }}
            />
          </div>
        </article>
      </main>
    </>
  );
}