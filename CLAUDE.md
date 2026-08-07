## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project Architecture & Tech Stack

**Nismara Group Website** is built using a modern, decoupled architecture (Headless CMS + Static Site Generator).
The Nismara Group is a virtual company group dedicated to simulation gaming. It oversees various virtual divisions including:
- **Nismara Transport**: Logistics and passenger division (https://transport.nismara.web.id)
- **Nismara Airlines**: Aviation division
- **Nismara Racing**: Racing division (https://racing.nismara.web.id)
- **Nismara World**: Gaming subdivisions including Rice Kencur (Minecraft), BLCK (GTA V / Action), and Nismara Farm (Farming Simulator).
*Context*: This project aims to build the overarching corporate website for these virtual entities, moving away from generic media/digital agency themes.

### Core Technologies
1. **Frontend**: [Astro](https://astro.build/) (Static Site Generation / SSR)
2. **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom design system (`src/styles/global.css`).
3. **Headless CMS**: [Sanity Studio](https://www.sanity.io/) (Standalone setup in `studio/` folder).
4. **Cloud Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) via `@aws-sdk/client-s3` (Configured, ready for large file/document storage).

## Work Accomplished

### 1. Initialization
- Scaffolded Astro project and integrated Tailwind CSS.
- Scaffolded Standalone Sanity Studio in `studio/`.
- Configured Cloudflare R2 credentials in `.env` and created a client wrapper (`src/lib/r2.ts`).

### 2. CMS Backend Setup
- Switched from embedded Studio to Standalone Studio to avoid Vite/React compiler conflicts.
- Configured Media & Publishing Schemas (`article`, `author`, `category`).
- Deployed schemas to Sanity Content Lake (`production` dataset).

### 3. Frontend Implementation
- **Data Fetching**: Created `src/utils/sanity.ts` utilizing `sanity:client`, `groq`, and `@sanity/image-url`.
- **Global UI**: Developed reusable `Navbar.astro` (Glassmorphism design) and `Footer.astro` components, integrated via `Layout.astro`.
- **Pages**:
  - `index.astro`: Redesigned with a premium Hero section, Services overview, and a dynamic "Latest Publications" grid fetching data from Sanity.
  - `articles/[slug].astro`: Set up dynamic routing and integrated `astro-portabletext` to render rich text article bodies from Sanity.
