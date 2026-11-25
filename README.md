# CamcodeLearn — Public Website (Port 3000)

Bilingual (**English + Khmer**) public website for the **CamcodeLearn** Learning & Video Streaming Platform, built with **Vite + React + TypeScript + Tailwind CSS**.

This application implements the **Public Website (Port 3000)** discovery, catalog, pricing, authentication, and checkout flows (`PUB-01` through `PUB-09`), backed by local mock services ready to connect to the Backend API on **Port 4000**.

---

## Features

- **Bilingual Localization (`EN` / `ខ្មែរ`)**: Persistent language switcher (`src/i18n/I18nContext.tsx`) with `Inter`, `JetBrains Mono`, and `Noto Sans Khmer` typography and automatic English fallback.
- **Light & Dark Mode**: Persistent theme toggle (`src/context/ThemeContext.tsx`) switching the layered radial ambient environment, 3D perspective grid floor (`.grid-floor`), and frosted glass cards (`.glass-card`, `.glass-panel`).
- **Course Marketplace (`PUB-02`)**: Horizontal category chip navigation, sorting (`Recommended`, `Price: Low to High`, `Most Popular`, `Newest`, `Highest Rated`), collapsible multi-filter panel (search, difficulty, free/paid, rating, duration, language, instructor), URL query-parameter sync, and pagination.
- **Course & Video Discovery (`PUB-01`, `PUB-03`, `PUB-04`, `PUB-05`)**: Featured courses, video library discovery rows, preview modals, expandable curriculum sections, paginated reviews, watchlist saving, and role/entitlement-aware CTAs.
- **Dynamic Pricing & Verified Checkout (`PUB-06`, `PUB-08`)**: Monthly/yearly billing toggle, feature comparison table, coupon validation (`SAVE20`, `KHMER10`, `WELCOME5`), tax calculation, duplicate-submission prevention, and simulated two-step backend webhook verification (`pending` → `verified` / `failed`).
- **Authentication & Static Pages (`PUB-07`, `PUB-09`)**: Split-screen Login, Register, Forgot Password, and Reset Password flows with redirect preservation, plus `/about`, `/contact`, `/terms`, `/privacy`, and `/faq`.

---

## Tech Stack

- **Framework**: React 19 + TypeScript 5 + Vite 6
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation & Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server is configured to run on **http://localhost:3000**.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server on port `3000` |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run build` | Type-check (`tsc -b`) and build production assets to `dist/` |
| `npm run preview` | Preview the production build locally on port `3000` |

---

## Environment Configuration

Configure `.env` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_MOCK_API=true
VITE_USER_APP_URL=http://localhost:3001
VITE_ADMIN_APP_URL=http://localhost:3002
```

- Set `VITE_USE_MOCK_API=false` when connecting directly to the live Backend API on port `4000`.

---

## Routes Implemented

| Screen | Route | Description |
| --- | --- | --- |
| `PUB-01` | `/` | Homepage (Hero, Featured Courses, Popular Videos, Categories, Benefits, Plans, Testimonials) |
| `PUB-02` | `/courses` | Course Marketplace with category chips, sorting, filters, and pagination |
| `PUB-03` | `/courses/:slug` | Course Detail with preview modal, curriculum accordion, reviews, and purchase/enroll CTAs |
| `PUB-04` | `/videos` | Video Library with featured banner, category pills, and discovery rows |
| `PUB-05` | `/videos/:slug` | Video Detail with access gating, watchlist toggle, and related videos |
| — | `/categories` | Category hub linking to courses and videos |
| `PUB-06` | `/pricing` | Monthly/Yearly subscription plans, feature comparison table, and FAQ |
| `PUB-07` | `/login`, `/register`, `/forgot-password`, `/reset-password` | Authentication flows with validation and redirect preservation |
| `PUB-08` | `/checkout` | Course & subscription checkout with coupons and webhook verification state machine |
| `PUB-09` | `/about`, `/contact`, `/terms`, `/privacy`, `/faq` | Localized informational and legal pages |

---

## Project Structure

```text
src/
├── components/
│   ├── cards/          # CourseCard, VideoCard
│   ├── layout/         # MainLayout, PublicHeader, PublicFooter, SearchPanel
│   └── ui/             # Alert, Badge, Button, Dropdown, Input, Modal, Pagination, Skeleton
├── context/            # AuthContext, ThemeContext
├── data/               # Mock catalog & pricing configuration
├── i18n/               # EN / KM translations and I18nContext
├── pages/              # PUB-01 through PUB-09 route views
└── services/           # apiClient, catalogService, pricingService, authService, checkoutService
```

---

## Testing Helpers

- **Demo Access Switcher**: Use the person-icon menu in the header to switch between `Visitor`, `Free Plan`, `Basic Plan`, `Premium Plan`, and `Purchased Course` states for testing gated course/video CTAs.
- **Checkout Coupons**: Try `SAVE20`, `KHMER10`, or `WELCOME5` on `/checkout`.
- **Webhook Failure Simulation**: Toggle *"Simulate backend webhook failure"* on `/checkout` to test failed payment verification without granting access.

