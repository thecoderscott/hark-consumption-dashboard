# Agent Instructions

## Project context

This is a full-stack monorepo consisting of a Next.js 15 frontend and a C# .NET 8 Hot Chocolate GraphQL backend. Both projects live under the same git root. Read the structure before making assumptions about where files live.

## Next.js

This is NOT the Next.js you know. Version 16 has breaking changes - APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. Do not assume Pages Router conventions apply - this project uses the App Router exclusively.

## General behaviour

- Never use em dashes (--) in any output, comments, or documentation. Humans do not write like that. Use a regular dash (-) or restructure the sentence.
- Do not pad responses. No "Great question!", no "Certainly!", no summarising what you just did at the end. Get to the point.
- Do not add comments that just restate what the code does. Comments should explain *why* a decision was made, not narrate the *what*.
- Do not over-engineer. Do not add abstractions, helpers, or utilities for one-off operations. The minimum complexity that solves the problem is the correct amount.
- Do not add error handling for scenarios that cannot happen. Trust framework guarantees and internal code.
- Never create files unless strictly necessary. Prefer editing existing files.

## Code style

- TypeScript everywhere on the frontend. No `any`. Derive types where possible rather than restating what the compiler already knows.
- Use `as const` for constant objects rather than explicit type annotations that restate the same information.
- Ant Design 6 is the component library. Props have changed from v5 - do not assume v5 API. `Space` uses `orientation`, `Alert` uses `title`.
- No Tailwind. Styling is done via CSS custom properties defined in `globals.css` and inline styles where needed.
- CSS custom properties follow the naming convention `--color-{scope}-{variant}` (e.g. `--color-brand-primary-400`, `--color-main-bg`).

## Backend

- The backend is C# .NET 8. Comments on non-trivial backend code should explain the *why* behind decisions - this is intentional to support code review and understanding.
- Hot Chocolate is the GraphQL server. Do not swap it out or suggest alternatives.
- Data is loaded from CSV at startup into a singleton `DataStore`. This is intentional - the dataset is read-only and 336 rows. Do not suggest a database.
- `HotChocolate` exports a type named `Path` which conflicts with `System.IO.Path`. Use a `using` alias to resolve this rather than fully-qualified references throughout the file.

## Testing

- Backend tests use xUnit and FluentAssertions.
- Tests use real in-memory CSV data written to a temp directory - do not introduce mocking libraries.
- Each test class that writes files must implement `IDisposable` and clean up its temp directory.
