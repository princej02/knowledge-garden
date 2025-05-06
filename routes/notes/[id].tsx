// deno-lint-ignore-file

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { render, CSS } from "@deno/gfm";

interface Note {
  title: string;
  content: string;
}

export const handler: Handlers<Note | null> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    try {
      const res = await fetch(`http://localhost:8000/api/notes/${id}`);
      if (!res.ok) return ctx.render(null);

      const data = await res.json() as Note;
      return ctx.render(data);
    } catch (_err) {
      return ctx.render(null);
    }
  },
};

export default function NotePage({ data }: PageProps<Note | null>) {
  if (!data) {
    return (
      <main class="p-6">
        <h1 class="text-2xl font-bold text-destructive">Note not found.</h1>
        <p class="text-muted-foreground mt-2">We couldn't find this note.</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <title>{data.title} | Notes</title>
      </Head>
      <main className="prose dark:prose-invert max-w-none p-6">
        <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: render(data.content) }}
        />
      </main>
    </>
  );
}
