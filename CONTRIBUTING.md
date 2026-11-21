# Contributing to NuttFlixx

Thank you for your interest in contributing to NuttFlixx! Follow these steps to set up your local development environment and submit changes.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your TMDB API key to `.env.local`.

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Code Quality Standards

Before submitting a pull request, make sure all verification checks pass:

- **Typecheck**: `pnpm typecheck`
- **Lint**: `pnpm lint`
- **Build**: `pnpm build`
- **Unified Check**: `pnpm check`

## Submitting Pull Requests

1. Create a descriptive branch for your feature or bug fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes with clear, concise commit messages.
3. Push your branch to your fork and open a Pull Request against the `main` branch.
4. Describe your changes clearly in the PR description and link any related issues.
