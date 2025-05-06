import { useState } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

import { Button } from "../components/Button.tsx";
import { Textarea } from "../components/Textarea.tsx";

interface NoteEditorProps {
  content: string;
  onChange: (value: string) => void;
}

// Setup DOMPurify with JSDOM only once
const purifier = DOMPurify;

export default function NoteEditor({ content, onChange }: NoteEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  function renderPreview(md: string): string {
    const linked = md.replace(/\[\[(.+?)\]\]/g, (_, title) => {
      const id = title.trim().toLowerCase().replace(/\s+/g, "-");
      return `[${title}](/notes/${id})`;
    });

    const rawHtml = marked(linked);
    return purifier.sanitize(rawHtml.toString());
  }

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="grid gap-x-4 grid-cols-2 mb-2">
        <Button
          type="button"
          className={`py-2 text-sm font-medium border-b-2 ${
            activeTab === "write" ? "border-primary text-primary" : "border-transparent"
          }`}
          onClick={() => setActiveTab("write")}
        >
          Write
        </Button>
        <Button
          type="button"
          className={`py-2 text-sm font-medium border-b-2 ${
            activeTab === "preview" ? "border-primary text-primary" : "border-transparent"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>

      {/* Write Tab */}
      {activeTab === "write" && (
        <div className="mt-2">
          <Textarea
            value={content}
            onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
            placeholder="Write your note in Markdown. Use [[Note Title]] to link to other notes."
            className="w-full min-h-[300px] font-mono"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Use # for headings, * for lists, &gt; for quotes, and [[Note Title]] to link to other notes.
          </p>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div
          className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
        />
      )}
    </div>
  );
}
