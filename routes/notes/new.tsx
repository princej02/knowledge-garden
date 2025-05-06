// routes/notes/NewNote.tsx (or similar)
import { Button } from "../../components/Button.tsx";
import AddNote from "../../islands/AddNote.tsx"

export default function NewNote() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a href="/">
          <Button variant="outline">Back to Notes</Button>
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>

      <AddNote />
    </div>
  );
}
