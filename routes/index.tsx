import { Button } from '../components/Button.tsx'
import { Icons } from "../components/Icons.tsx";
import NoteList from "../islands/NoteList.tsx";
import SearchInput from "../islands/SearchInput.tsx";
import ThemeToggle from "../islands/ThemeToggle.tsx";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl text-foreground font-bold tracking-tighter">
            Knowledge Garden
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <a href={`/notes/new`}>
              <Button>
                <Icons.PlusIcon />
                New Note
              </Button>
            </a>
          </div>
        </div>
        <SearchInput />
      </header>
      <main>
        <NoteList />
      </main>
    </div>
  )
}
