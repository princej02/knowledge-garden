import { Handlers } from "$fresh/server.ts";
import matter from "gray-matter";

export const handler: Handlers = {
  async GET() {
    const notes: Array<{ id: string; title: string; tags: string[] }> = [];

    try {
      for await (const entry of Deno.readDir("./notes")) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          const id = entry.name.replace(".md", "");
          const content = await Deno.readTextFile(`./notes/${entry.name}`);
          const parsed = matter(content);

          notes.push({
            id,
            title: parsed.data.title || "(untitled)",
            tags: parsed.data.tags || [],
          });
        }
      }

      return new Response(JSON.stringify(notes), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Failed to list notes:", err);
      return new Response(JSON.stringify({ error: "Failed to list notes" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
