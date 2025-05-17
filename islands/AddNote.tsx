// islands/AddForm.tsx
import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import NoteEditor from "./NoteEditor.tsx";


export default function AddNote() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

    const payload = {
      title,
      tags: tagList,
      content
    };

    const res = await fetch("/api/notes/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("Note saved successfully.");
      setTitle("");
      setTags("");
      setContent("");
    } else {
      const err = await res.json();
      setStatus(`Error: ${err.error || "Unknown issue"}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
          placeholder="Note title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags (comma separated)
        </label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags((e.target as HTMLInputElement).value)}
          placeholder="research, ideas, books"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content (Markdown supported)
        </label>
        <NoteEditor content={content} onChange={setContent} />
      </div>

      {status && <p className="text-sm text-gray-600">{status}</p>}

      <div className="flex justify-end gap-2">
        <a href="/">
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </a>
        <Button type="submit">Save Note</Button>
      </div>
    </form>
  );
}
