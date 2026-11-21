# NuttFlixx

NuttFlixx is a web application for exploring movies and television series, powered by Next.js, React, Tailwind CSS, and The Movie Database (TMDB) API.

---

## Highlights

- **Extensive Catalog**: Discover trending movies, top-rated shows, upcoming releases, and genres.
- **Dynamic Previews**: Edge-rendered social share banners generated on the fly.
- **Viewing History**: Resume watching movies and episodes directly from your local browser session.
- **Fast Experience**: Server components and Turbopack for rapid loading and smooth interactions.

---

## Getting Started

### Prerequisites

- Node.js (version 20 or later recommended)
- pnpm package manager (`npm install -g pnpm`)
- A free TMDB API key from [The Movie Database](https://www.themoviedb.org/settings/api)

### Installation

1. Clone your repository:
   ```bash
   git clone https://github.com/your-username/nuttflixx.git
   cd nuttflixx
   ```

2. Install packages:
   ```bash
   pnpm install
   ```

3. Configure your local environment:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and paste your TMDB key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_key_here
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Available Scripts

- `pnpm dev`: Starts the local dev server with Turbopack.
- `pnpm build`: Compiles production assets.
- `pnpm start`: Runs the compiled production build locally.
- `pnpm typecheck`: Validates TypeScript types across the codebase.
- `pnpm lint`: Runs ESLint to check for code quality and formatting issues.
- `pnpm check`: Runs both type checking and linting in a single pass.

---

## Project Structure

```text
├── app/                  # Next.js App Router pages and edge OG image routes
├── components/           # Reusable UI elements, carousels, and layout wrappers
├── hooks/                # Custom React client hooks (e.g., continue watching)
├── lib/                  # TMDB client, utility functions, and shared types
├── public/               # Static assets
└── .github/              # Actions workflow and contribution templates
```

---

## License & Attribution

- Released under the [MIT License](LICENSE).
- Movie and TV data supplied by [The Movie Database](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
