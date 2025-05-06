import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Button } from "../components/Button.tsx";
import { Icons } from "../components/Icons.tsx";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load initial theme only on the client
  useEffect(() => {
    if (!IS_BROWSER) return;

    const stored = globalThis.localStorage.getItem("theme");
    const systemPrefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;

    const useDark = stored === "dark" || (!stored && systemPrefersDark);

    globalThis.document.documentElement.classList.toggle("dark", useDark);
    setIsDark(useDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!IS_BROWSER) return;

    const newIsDark = !isDark;
    setIsDark(newIsDark);
    globalThis.document.documentElement.classList.toggle("dark", newIsDark);
    globalThis.localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  if (!mounted) {
    // Render empty button during SSR
    return (
      <Button variant="ghost" class="p-2 rounded-full border border-transparent" aria-hidden="true"></Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className=""
    >
      {isDark ? <Icons.MoonIcon class="w-5 h-5" /> : <Icons.SunIcon class="w-5 h-5" />}
    </Button>
  );
}
