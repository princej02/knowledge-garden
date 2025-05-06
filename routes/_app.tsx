import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Knowledge Garden - Welcome!</title>
        <link rel="stylesheet" href="/styles.css" />
        <script>
          const storedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        </script>
      </head>
      <body class="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 antialiased">
        <Component />
      </body>
    </html>
  );
}
