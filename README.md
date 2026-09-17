# Strategic Medical Brokers — Client Portal & Admin Portal (UI prototype)

Front-end only. Every screen runs on centralised mock data — there is no backend,
no authentication, no Zoho CRM or Catalyst integration, no document storage, no
email delivery and no BizBuySell connection of any kind. This build exists to
obtain UI/UX approval.

Two separate experiences share one bundle:

| Experience | Entry point | Audience |
| --- | --- | --- |
| **Client Portal** | `http://localhost:5173/#/login` | The selling practice |
| **Admin Portal** | `http://localhost:5173/#/admin` | Internal SMB staff |

## Run it

```bash
npm install     # first time only
npm run dev     # http://localhost:5173
```

**Client portal** — sign in with **any** email and password, then **any** 6-digit code.

**Admin portal** — open `#/admin`. The staff sign-in is pre-filled; click
**Sign in to the console**. Nothing is verified.

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
  data/           client-portal mock data — the seam to replace with Catalyst APIs
  lib/            hooks, formatting, demo session, shared portal state
  styles/         tokens -> base -> brand -> ui -> charts -> layout -> auth
                  -> pages -> admin
  components/
    ui/           buttons, fields, cards, badges, modal, toast, icons, logo
    charts/       BarChart, LineChart, Sparkline, axis scale helpers
    layout/       AppShell (sidebar/topbar/drawer), AuthLayout, MfaSteps, nav config
    dashboard/    EngagementPanel, DashboardSkeleton
  pages/          Login, VerifyMobile, VerifyCode, Overview, Marketing,
                  Documents, Requests, Activity, NotFound

  admin/          the internal console — entirely self-contained
    AdminApp.jsx  routes, staff gate, providers
    data/         admin mock data barrel (clients, users, documents, requests,
                  marketing, activity, notifications, roles, settings, staff,
                  dashboard selectors)
    lib/          adminState (local mutations), adminSession, adminFormat
    layout/       AdminShell (rail/topbar/sheet), adminNav
    components/   DataTable, Drawer, AdminIcon, controls (toolbar, toggle,
                  stat tile, action menu, detail list, section)
    dialogs/      AddClient, InviteUser, CreateRequest, UploadDocument
    pages/        Dashboard, Clients, Client360, ClientPreview, PortalUsers,
                  Documents (+Inbox), Requests, Marketing, Activity,
                  Notifications, Roles, Settings, Login, NotFound
```

The admin portal shares the brand tokens and UI primitives with the client
portal and nothing else. Its CSS is namespaced `.ad-*`, its state and session
live under `src/admin/lib/`, and the only client-portal file it touches is
`src/App.jsx` (one `/admin/*` route) and `src/main.jsx` (one CSS import).

## Replacing the mock data

The client portal imports data from `src/data/` (barrel: `src/data/index.js`);
the admin portal imports from `src/admin/data/` (barrel: `src/admin/data/index.js`).
No component contains a hardcoded record.

Anything either prototype mutates locally flows through a provider seeded from
those mocks — `src/lib/portalState.jsx` for the client portal, and
`src/admin/lib/adminState.jsx` for the admin portal.

To go live: swap the mock imports in those two providers for Catalyst function
calls and keep the exported shapes. No component markup needs to change.

## What the admin portal deliberately does not do

The console is UI only. These controls are present and legible, but inert:

- **Zoho CRM** — no sync. Clients, engagements and stages are mock records.
- **Authentication** — the staff sign-in accepts anything; the client-side
  invitation flow (invite → client activates → client sets password → MFA) is
  described in the UI but never executed. Staff never see or set a client password.
- **Document storage** — no file is read, stored, scanned or downloaded.
- **Watermarking** — the settings and per-document toggles define the intended
  behaviour (viewer email + download timestamp). Nothing is rendered.
- **BizBuySell** — no integration, feed or scraping. All listing figures are
  fabricated; "Refresh" only moves a timestamp.
- **Email** — no message is sent. "Preview" renders a template in a dialog.
- **Permissions** — the matrix is a design artefact for sign-off; enforcement
  belongs server-side.

## Deploying to Catalyst client hosting

`npm run build` emits a fully static `dist/` (including `client-package.json`).
`catalyst.json` points the client target at `dist`.
