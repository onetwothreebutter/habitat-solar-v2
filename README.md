# Habitat Solar

A donation calculator that helps people offset the CO₂ emissions from flights (or other carbon-intensive activities) by funding local solar installations for [Iowa Valley Habitat for Humanity](https://www.iowavalleyhabitat.org/) homes.

Habitat homes in Johnson County, Iowa are built "solar-ready," but most homeowners can't afford the upfront cost of a solar array. This site converts a flight's CO₂ footprint into a suggested donation amount, using the assumption that **$0.22 invested in local solar offsets 1 kg of CO₂ over 25 years**, and lowers energy bills for low-income families in the process.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/eric-johnsons-projects-b57dd592/v0-habitat-solar)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/PyGcj9Br0Vh)

## Features

- **Flight lookup** — pick an origin and destination airport and fetch typical per-passenger emissions from the [Google Travel Impact Model API](https://cloud.google.com/travel-impact-model).
- **Manual entry** — already know your emissions (e.g. from the [ICAO carbon calculator](https://icec.icao.int/calculator))? Enter the kg CO₂ directly.
- **Donation calculator** — converts kg CO₂ into a suggested donation at $0.22/kg, with an optional round-up to the nearest dollar.
- **Donate now** — links straight to the Iowa Valley Habitat for Humanity Solar Fund checkout.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS 4 with [shadcn/ui](https://ui.shadcn.com/) components (Radix primitives)
- A Next.js API route (`app/api/flight-emissions`) that proxies requests to the Google Travel Impact Model API

## Getting started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (the repo includes a `pnpm-lock.yaml`)
- A Google Cloud API key with the [Travel Impact Model API](https://cloud.google.com/travel-impact-model) enabled

### Setup

```bash
pnpm install
```

Create a `.env.local` file in the project root:

```bash
GOOGLE_TRAVEL_IMPACT_API_KEY=your_api_key_here
```

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # lint
```

## Project structure

```
app/
  api/flight-emissions/route.ts   # proxies to the Google Travel Impact Model API
  page.tsx / clientpage.tsx       # landing page (hero, how-it-works, calculator)
components/
  donation-calculator.tsx         # flight lookup / manual entry / $ calculation
  airport-combobox.tsx            # searchable airport picker
  ui/                             # shadcn/ui primitives
lib/
  airports.ts                     # static airport dataset used by the combobox
```

## Deployment

This project is deployed on [Vercel](https://vercel.com/) and stays in sync with its [v0.app](https://v0.app) project — changes made in v0 are pushed to this repository, and Vercel deploys the latest commit automatically. Set `GOOGLE_TRAVEL_IMPACT_API_KEY` as an environment variable in the Vercel project settings for the flight lookup feature to work in production.

## Disclaimer

The $0.22/kg conversion is an approximation based on local solar production and a 25-year panel lifetime, not a certified carbon offset.
