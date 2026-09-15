# Strategic Medical Brokers — Client Portal (UI prototype)

Front-end only. Every screen runs on centralised mock data — there is no backend,
no authentication, no Zoho CRM or Catalyst integration, and no BizBuySell
connection of any kind. This build exists to obtain UI/UX approval.

## Run it

```bash
npm install     # first time only
npm run dev     # http://localhost:5173
```

Sign in with **any** email and password, then **any** 6-digit code.

```bash
npm run build     # static bundle -> dist/
npm run preview   # serve the built bundle on :4173
```

## Branding

Colour and type come from the live public website, not from invention:

| Token | Value | Source |
| --- | --- | --- |
| `--brand-accent` | `#0FAEEB` | `--ast-global-color-0` — site CTA / link blue |
| `--brand-primary` | `#1870B8` | deeper blue sampled from the official logo artwork |
| `--brand-secondary` | `#363772` | `--ast-global-color-1/2` — headings and body text |
| `--text-muted` | `#61668F` | `--ast-global-color-3` |
| `--brand-background` | `#F3F6F6` | `--ast-global-color-4` |
| `--brand-dark` | `#01023B` | `--ast-global-color-6` |
| `--brand-light` | `#EFFAFD` | `--ast-global-color-7` |
| `--brand-border` | `#DDDDDD` | `--ast-border-color` |

Headings use **DM Serif Display** (the site's heading face, loaded from Google
Fonts); body copy uses the same native system stack the site serves.

The logo in `src/assets/` is a crop of the official header asset — see
`brand-source/README.md`. It is never recoloured, and because the published
brand has no reverse variant, every surface it sits on is light.

## Stack

| Concern    | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | React 18 + Vite 5                                          |
| Routing    | react-router-dom (HashRouter — no server rewrites needed)  |
| Styling    | Hand-built CSS design system driven by custom properties   |
| Charts     | Custom inline SVG (`src/components/charts/`) — no library  |
| Icons      | Custom inline SVG set (`src/components/ui/Icon.jsx`)       |

Three runtime dependencies in total: `react`, `react-dom`, `react-router-dom`.

## Where things live

```
src/
  data/           mock data — the single seam to replace with Catalyst APIs
  lib/            hooks, formatting, demo session, shared portal state
  styles/         tokens -> base -> brand -> ui -> charts -> layout -> auth -> pages
  components/
    ui/           buttons, fields, cards, badges, modal, toast, icons, logo
    charts/       BarChart, LineChart, Sparkline, axis scale helpers
    layout/       AppShell (sidebar/topbar/drawer), AuthLayout, MfaSteps, nav config
    dashboard/    EngagementPanel, DashboardSkeleton
  pages/          Login, VerifyMobile, VerifyCode, Overview, Marketing,
                  Documents, Requests, Activity, Messages, Team, NotFound
```

## Replacing the mock data

Every screen imports data from `src/data/` (re-exported by `src/data/index.js`).
Anything the prototype mutates locally — documents, requests, conversations —
flows through `src/lib/portalState.jsx`, which is seeded from those same mocks.

To go live: swap the mock imports in `portalState.jsx` for Catalyst function
calls and keep the exported shapes. No component markup needs to change.

## Deploying to Catalyst client hosting

`npm run build` emits a fully static `dist/` (including `client-package.json`).
`catalyst.json` points the client target at `dist`.
