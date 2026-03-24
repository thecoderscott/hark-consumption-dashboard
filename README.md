# Energy Consumption Dashboard

Hark engineering tech test - an energy manager dashboard for cross-referencing half-hourly energy usage with temperature data and identifying anomalies on an interactive chart.

A live production build is available at **[https://hark.coderscott.dev](https://hark.coderscott.dev)**.

---

## Some context

Typically, when I perform these tech tests, I aim for the most simple solution to prove that I can write code to the level I say I can. It's more about the process and thought that goes into it rather than whether I went OTT perfecting every single element.

For this test, it is a little different as I used to work at Hark. Due to that, I have gone a bit ✨extra ✨with this repo, really attempting to showcase exactly how I think, show what I have learnt over the last few years, and how I have levelled up as an engineer.

TL;DR: Hark knows that I can write code. This monorepo is more of a "here's what I can do now" kind of thing.

Also, just a little heads up - This straight up does not look good on mobile. Not because I forgot, but because I don't think Hark builds for mobile - unless my memory is deceiving me...

---

## A note on AI-assisted development

This project was built with Claude as a development partner, which I want to be upfront about rather than obscure.

I used Claude to scaffold both the frontend and backend, then reviewed, validated, and iterated on the output to get to the finished result. This was a combination of using Claude's "plan mode", as well as me manually writing sections.

The frontend is my stronger suit - I work in React/NextJS and TypeScript day-to-day, so the majority of the frontend work was directed by me with Claude accelerating the implementation and helping my vision come to life.

The backend is less familiar territory; C# and .NET aren't part of my day-to-day stack, but I used Claude to build it out and made sure I understood every decision made - the data loading strategy, why Hot Chocolate was chosen, how dependency injection works, why the DataStore is a singleton, and so on. I like to learn this way, it gives me context to look at, try to understand and then state what I think is happening for Claude (or any other agent) to tell me whether I am right or wrong.

I think this reflects how I actually work in the modern age. AI tooling is part of the modern development workflow, and I'd rather demonstrate that I can use it effectively and critically than pretend I didn't. The goal wasn't to have Claude write a project I can't explain - it was to ship something solid in a reasonable timeframe while genuinely understanding, or learning, what's under the hood.

It's also worth noting that I chose Claude specifically because Hark use it internally - it felt like the right tool for the job.

I spent a fair bit of time working on this, much more than I typically would for a tech test - around 4 hours total. Most of that time was asking questions about the backend implementation to ensure I understood what it was doing and why, and perfecting the frontend visuals.

---

## Tech stack and decisions

| Technology | Why                                                                                                                                                                                                    |
|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Next.js 16** | React framework with server components and server actions - clean separation between server-side data fetching and client-side interactivity                                                           |
| **C# / .NET 8** | Specified in the tech test as Hark's backend stack                                                                                                                                                     |
| **Hot Chocolate** | .NET GraphQL server library - implements the GraphQL spec so you don't have to. GraphQL was specified in the tech test as part of Hark's stack                                                         |
| **CsvHelper** | Handles CSV parsing edge cases (BOMs, quoted fields, type mapping) without rolling a custom parser                                                                                                     |
| **Highcharts** | Specified in the tech test as Hark's charting tool. Stock chart variant used for built-in range selector and navigator                                                                                 |
| **Ant Design** | Component library - chosen because as far as I remember, Hark use it internally (although that may have changed, or I may be mis-remembering). Provides the Switch, InputNumber, and layout primitives |
| **graphql-request** | Lightweight GraphQL client for the frontend - no cache or normalisation overhead, right-sized for a single query. Typically I would reach for `@apollo`, but felt that was overkill for this test.     |
| **Claude** | Used as a development partner throughout - chosen because Hark use it internally and I am well versed with it - See `AGENTS.md` for more info.                                         |

---

## Architecture decisions worth noting

**GraphQL over REST** - the spec called it out, and it's a good fit here: a single query joins energy readings, weather data, and anomaly flags in one round trip rather than three.

**In-memory data store** - the dataset is 336 rows and read-only. Loading once at startup into a singleton avoids per-request file I/O with no downside. A database would be the right call if the data were larger, mutable, or user-specific.

**Server actions over API routes** - the GraphQL fetch is internal UI logic with no reason to be a public HTTP endpoint. Server actions are called directly by Next.js over an internal transport, which keeps the backend URL server-side only and avoids an unnecessary HTTP round trip.

**Simulated loading delay** - the dataset is small enough that the loading state is nearly invisible in normal use. A toggle is included to artificially delay the fetch so the loading state and chart draw animation are demonstrable. This is purely a demo affordance and would not exist in production.

---

## Running locally

### Requirements

- Node.js 20+
- .NET 8 SDK

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend/EnergyDashboard.Api
dotnet run
```

GraphQL playground (Banana Cake Pop) at [http://localhost:5000/graphql](http://localhost:5000/graphql)

### Backend tests

```bash
cd backend
dotnet test
```

### Frontend unit tests (Jest)

```bash
cd frontend
npm test
```

### Frontend E2E tests (Cypress)

Requires both the frontend and backend dev servers to be running first.

```bash
# Interactive mode - opens the Cypress UI
npm run cypress:open

# Headless mode - runs in the terminal
npm run cypress:run
```

---

## Project structure

```
consumption-dashboard/
├── data/                        - shared CSV source files
│   ├── HalfHourlyEnergyData.csv
│   ├── HalfHourlyEnergyDataAnomalies.csv
│   └── Weather.csv
├── frontend/                    - Next.js 16 app
│   └── src/
│       ├── app/                 - pages, layout, server actions
│       ├── components/          - UI components
│       ├── context/             - React context (delay toggle state)
│       ├── constants/           - shared constants (animation timings)
│       └── lib/                 - GraphQL client and types
└── backend/
    ├── EnergyDashboard.Api/     - Hot Chocolate GraphQL API
    │   ├── Data/                - CSV loader, data store, reading model
    │   └── GraphQL/             - query resolver
    └── EnergyDashboard.Tests/   - xUnit test suite
```
