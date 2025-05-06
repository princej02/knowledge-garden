import { Handlers } from "$fresh/server.ts";
import matter from "gray-matter";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    const filePath = `./notes/${id}.md`;

    try {
      const fileContent = await Deno.readTextFile(filePath);

      const parsed = matter(fileContent);

      return new Response(JSON.stringify({
        id,
        title: parsed.data.title,
        tags: parsed.data.tags || [],
        content: parsed.content.trim(),
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Note not found:", err);
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
