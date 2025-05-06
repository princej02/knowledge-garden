import { useEffect, useState } from "preact/hooks";
import { slugify } from "../lib/utils.ts";
import { Icons } from "../components/Icons.tsx";

interface Note {
  title: string;
  tags: string[];
  content: string;
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleFetch() {
      try {
        const res = await fetch("/api/notes");
        const data = (await res.json()) as Note[];
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    handleFetch();
  }, []);

  return (
    <div className="w-full">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-accent-foreground tracking-tight">
        <Icons.NotebookIcon className="w-5 h-5 text-primary" />
        My Notes
      </h2>

      {loading ? (
        <p className="text-muted-foreground text-sm animate-pulse">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted-foreground text-sm">You haven’t written any notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note, i) => (
            <li key={i} className="relative group">
              <a
                href={`/notes/${slugify(note.title)}`}
                className="block p-3 border border-border rounded-md hover:border-primary transition-colors"
              >
                <h3 className="text-base font-medium text-foreground group-hover:underline">
                  {note.title}
                </h3>
                {note.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>

              {/* Hover Preview */}
              {note.content && (
                <div className="absolute left-full top-0 ml-4 w-64 p-3 rounded-md bg-popover text-popover-foreground shadow-md border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                  <p className="text-sm line-clamp-6 whitespace-pre-wrap">
                    {note.content.length > 300
                      ? note.content.slice(0, 300) + "..."
                      : note.content}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
