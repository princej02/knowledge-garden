import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Input } from "../components/Input.tsx";
import { Button } from "../components/Button.tsx";
import { Icons } from "../components/Icons.tsx";

export default function SearchInput() {
  const query = useSignal("");

  useEffect(() => {
    // Initialize from URL params on mount
    const params = new URLSearchParams(globalThis.location.search);
    query.value = params.get("q") || "";
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.value) params.set("q", query.value);
    
    // Update URL without full page reload
    globalThis.history.pushState({}, "", `?${params}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icons.SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input
            type="text"
            value={query.value}
            onInput={(e) => query.value = (e.target as HTMLInputElement).value}
            placeholder="Search notes..."
            className="pl-8 w-full"
          />
        </div>
        <Button onClick={handleSubmit}>Search</Button>
      </div>
    </div>
  );
}

