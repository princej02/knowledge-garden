import { Handlers } from "$fresh/server.ts";

// Incoming request structure (no ID sent)
interface NoteData {
  title: string;
  tags: string[];
  content: string;
}

// Utility to create a URL-safe file ID
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with "-"
    .replace(/^-+|-+$/g, "");    // trim leading/trailing dashes
}

export const handler: Handlers = {
  async POST(req: Request) {
    try {
      const { title, tags, content } = await req.json() as NoteData;

      if (!title || !content) {
        return new Response(JSON.stringify({ error: "Missing title or content" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const id = slugify(title);
      const filePath = `./notes/${id}.md`;

      // Check if note already exists
      try {
        await Deno.lstat(filePath);
        return new Response(JSON.stringify({ error: "Note already exists", id }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) throw err;
      }

      // Prepare frontmatter + content
      const frontmatter = [
        "---",
        `title: ${title}`,
        `tags: [${tags.join(", ")}]`,
        "---",
        "",
        content,
      ].join("\n");

      // Write the file
      await Deno.writeTextFile(filePath, frontmatter);

      return new Response(JSON.stringify({ success: true, id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Failed to create note:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
