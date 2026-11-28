# CamcodeLearn — Geist Design System & Production Readiness Audit

**Repository:** `edustream-public-web` (CamcodeLearn Public Web)  
**Design Reference:** [Vercel Geist Design System](https://vercel.com/geist) (`colors`, `typography`, `materials`, `font`, `design/guidelines`)  
**Audit Date:** 2026-11-26  
**Audit Phase:** Phase 1 — Complete Source Verification (All findings verified directly against `src/`, `index.html`, `package.json`, `.env.example`)

---

## 1. Executive Summary & Architecture Overview

`edustream-public-web` is a React 19 + TypeScript 5.7 + Vite 6 + Tailwind CSS v4 Single Page Application (`react-router-dom` v7.1.5) implementing the public storefront, course catalog, video library, pricing, checkout, authentication, and static pages (`PUB-01`–`PUB-09`).

- **Installed Dependencies (`package.json`)**: `react` 19.0.0, `react-dom` 19.0.0, `react-router-dom` 7.1.5, `lucide-react` 0.475.0, `sonner` 2.0.8, `zod` 4.6.7, `geist` 1.9.2, `@tailwindcss/vite` 4.0.6, `vitest` 4.1.12.
- **External Portals (`.env.example`, `src/services/apiClient.ts:6-11`)**:
  - `VITE_API_BASE_URL` (`http://localhost:4000/api`) — Backend REST API (`VITE_USE_MOCK_API=true` by default).
  - `VITE_USER_APP_URL` (`http://localhost:3001`) — Separate Student/Learner Portal (`PublicHeader`, `CourseDetailPage`).
  - `VITE_ADMIN_APP_URL` (`http://localhost:3002`) — Separate Admin/Operations Portal (configured in `API_CONFIG`, no routes in this repo).
- **Initial Migration Status**: While `:root` and `html.dark` Geist variables (`--ds-background-1/2`, `--ds-gray-100..1000`, `--ds-blue-600/700`) were added to `src/index.css`, substantial gaps remain across routing/error handling, color token consistency, local Geist font loading, card/material unification, invalid nested interactive HTML, accessibility attributes, video player disclosure, and test coverage.

---

## 2. Confirmed Findings (Verified Against Current Source Code)

### A. Routing & Error Handling

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **R-01** | **Critical** | **Silent redirect instead of 404 page**: Unknown routes immediately redirect to `/` via `<Route path="*" element={<Navigate to="/" replace />} />`. Users hitting broken links get zero feedback. | `src/App.tsx:104-105` | Create `NotFoundPage` (`src/pages/NotFoundPage.tsx`) with Geist styling, clear 404 message, Return Home CTA, and links to `/courses` and `/videos`. Replace `<Navigate to="/" replace />`. | Ensure all 17 valid routes remain untouched. | Fixed |
| **R-02** | **Critical** | **Missing React Error Boundary**: Neither `App.tsx` nor `MainLayout.tsx` wraps routes or `<Suspense><Outlet /></Suspense>` in an `ErrorBoundary`. Any runtime crash or failed lazy-chunk load renders a blank screen. | `src/App.tsx:62-113`, `src/components/layout/MainLayout.tsx:24-28` | Implement `RouteErrorBoundary` (`src/components/ui/ErrorBoundary.tsx`) with user-friendly Geist fallback UI, Retry/Reload recovery, safe error logging (no sensitive data), and reset on route change. | Keep normal API error `<Alert>` states separate from Error Boundary. | Fixed |

---

### B. Geist Color System & Token Alignment

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **C-01** | **High** | **Incomplete semantic CSS tokens & dark-mode overrides**: `src/index.css` relies on ~157 lines of `@layer utilities` `html.dark .text-\[\#0F172A\]` / `.bg-white` override hacks. Meanwhile `--color-secondary` and `--color-muted` are not updated in `html.dark`, and `.geist-card` hardcodes `#ffffff`/`#eaeaea`/`#0a0a0a`/`#262626` instead of CSS vars. | `src/index.css:25-98, 422-445, 484-640` | Centralize semantic tokens (`--ds-background-1/2`, `--ds-gray-*`, `--ds-blue-*`, `--color-surface-elevated`, `--text-main`, `--text-secondary`, `--text-muted`, `--color-border`, semantic `--color-success/warning/error/info` light & dark) and migrate components off legacy slate/navy hexes. | Keep dark-mode utility fallbacks only as minimal safety net if needed, or remove once all components use semantic tokens. | Fixed |
| **C-02** | **High** | **Legacy navy/slate & `#2563EB` colors in `PublicHeader` & `PublicFooter`**: Theme toggle, language toggle, demo menu, login/signup buttons, mobile drawer nav/dividers, and mobile footer accordions use `#E2E8F0`, `#25344B`, `#111B2E`, `#172033`, `#2563EB`, `#F5F7FB`, `#E8EEF8`, `slate-*`. | `src/components/layout/PublicHeader.tsx:234-294, 309-390, 413-525`; `src/components/layout/PublicFooter.tsx:57, 125, 136, 151, 162` | Replace all legacy slate/navy classes with Geist neutral tokens (`--ds-background-1/2`, `--ds-gray-100..1000`, `--ds-blue-600/700`). Keep footer clean and consistent across light & dark modes. | Verify active nav pill, mobile drawer contrast, and footer contrast in both themes. | Fixed |
| **C-03** | **High** | **Legacy colors in shared UI primitives**: `SearchPanel`, `Badge`, `Input`, `Dropdown`, `Modal`, `Pagination`, `Skeleton`, `PageLoader`, and `ShimmerButton` still contain `#172033`, `#111B2E`, `#17243A`, `#25344B`, `#E2E8F0`, `#CBD5E1`, `#475569`, `#64748B`, `#2563EB`, and `slate-*`. | `src/components/layout/SearchPanel.tsx:97-190`; `src/components/ui/Badge.tsx:11-19`; `src/components/ui/Input.tsx:39-60`; `src/components/ui/Dropdown.tsx:144, 252`; `src/components/ui/Modal.tsx:90`; `src/components/ui/Pagination.tsx:39-40`; `src/components/ui/PageLoader.tsx:36-54`; `src/components/ui/Skeleton.tsx:5-16`; `src/components/ui/ShimmerButton.tsx:25` | Standardize all UI primitives on Geist tokens (`bg-[var(--ds-background-1)]`, `border-[var(--color-border)]`, `text-[var(--text-main)]`, etc.) and replace `ShimmerButton` usages with unified `Button`. | Preserve semantic tones on `Alert` and `Badge` (`success`, `warning`, `error`, `info`). | Fixed |
| **C-04** | **High** | **Legacy colors across pages**: `HomePage`, `CoursesPage`, `CourseDetailPage`, `VideosPage`, `VideoDetailPage`, `PricingPage`, `CheckoutPage`, `AuthPages`, and `StaticPages` still use `#172033`, `#0F192C`, `#0B1220`, `#111B2E`, `#17243A`, `#25344B`, `#E2E8F0`, `#F8FAFC`, `#E8EEF8`, `#475569`, `#64748B`, `#2563EB`, `slate-*`. | `src/pages/HomePage.tsx:197-205, 336-353, 404-409`; `src/pages/CoursesPage.tsx:168-292, 369-478, 508-516`; `src/pages/CourseDetailPage.tsx:183, 235, 264, 305, 360, 409, 424, 488, 507, 534, 561, 586`; `src/pages/VideosPage.tsx:161-165, 201`; `src/pages/VideoDetailPage.tsx:226`; `src/pages/PricingPage.tsx:65-76, 120, 157-164, 233-235`; `src/pages/CheckoutPage.tsx:269, 332-342, 361, 550, 623`; `src/pages/AuthPages.tsx:68, 183, 340-351, 367`; `src/pages/StaticPages.tsx:37, 49, 171, 204` | Migrate all page surfaces, borders, headers, accordions, sticky bars, and body copy to unified Geist semantic tokens. Preserve `thumbnailTheme` gradients on course/video covers. | Verify contrast in both light and dark modes, especially `#475569` body paragraphs in `CourseDetailPage`, `VideoDetailPage`, `CheckoutPage`, `StaticPages`. | Fixed |

---

### C. Typography & Font System

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **T-01** | **High** | **Installed `geist` npm package (`1.9.2`) unused; relying on Google Fonts CDN**: `node_modules/geist` contains local `.woff2` variable fonts (`Geist-Variable.woff2`, `GeistMono-Variable.woff2`), but `index.html` fetches `Geist` and `Geist Mono` from `fonts.googleapis.com`, causing network dependency and FOUT. | `index.html:26-31`, `package.json:14`, `src/index.css:101, 132-134` | Register `@font-face` in `src/index.css` pointing to `geist/dist/fonts/geist-sans/Geist-Variable.woff2` and `geist/dist/fonts/geist-mono/GeistMono-Variable.woff2` (bundled locally by Vite), and load `Noto Sans Khmer` + `Siemreap` gracefully for Khmer. | Verify Vite builds `.woff2` font assets cleanly into `dist/assets/`. | Fixed |
| **T-02** | **Medium** | **Khmer font stack & mixed-script fallback**: `html[lang="km"]` references `'Inter'` (not loaded) and omits `'Noto Sans Khmer'` fallback and `'Geist'` for Latin/numeric strings. | `src/index.css:667-682`, `index.html:28-31` | Update Khmer stack to `'Khmer OS Siemreap', 'Noto Sans Khmer', 'Siemreap', 'Geist', system-ui, sans-serif` with `Noto Sans Khmer` fallback in `index.html` and clean line-heights. | Do not break existing `I18nContext` or `html[lang="km"]` switching. | Fixed |
| **T-03** | **Medium** | **Heading hierarchy skips & inconsistent text classes**: `PublicFooter` uses `<h4>` directly in `<footer>` without `<h2>`/`<h3>`; `CoursesPage` empty state uses `<h3>` under `<h1>`; `Modal` uses `<h3>` regardless of context; `CourseCard`/`VideoCard` use ad-hoc `text-[11.5px]`. | `src/components/layout/PublicFooter.tsx:99, 117, 178`; `src/pages/CoursesPage.tsx:512`; `src/components/ui/Modal.tsx:83`; `src/components/cards/CourseCard.tsx:80-146` | Fix semantic heading order (`<h2>` for footer column titles, modal header, and empty-state heading), standardize text scale utilities (`.text-display`, `.text-h1`..`.text-caption`) and avoid sub-12px body/label text. | Keep visual font sizes identical or cleaner while fixing semantic levels. | Fixed |

---

### D. Materials, Surfaces & Component Consistency

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **M-01** | **High** | **Competing card/surface classes**: `.glass`, `.glass-panel`, `.glass-card`, `.saas-card`, `.geist-card` coexist with mixed radii (`rounded-[12px]`, `rounded-[14px]`, `rounded-[16px]`). | `src/index.css:356-445`; `src/pages/HomePage.tsx:164, 351, 375, 456`; `src/pages/PricingPage.tsx:116`; `src/pages/CheckoutPage.tsx:609`; `src/pages/StaticPages.tsx:33, 45, 93, 120` | Consolidate all cards/panels onto `.geist-card` (`12px` radius, `1px` border `var(--color-border)`) and `.geist-panel` (`16px` radius for featured containers/summary panels), removing redundant `.saas-card` and `.glass-*` definitions (or aliasing only if needed). | Verify card hover borders, subtle shadows, and reduced-motion rules. | Fixed |
| **M-02** | **Medium** | **Duplicate CTA button (`ShimmerButton`) & continuous shimmer/aurora effects**: `ShimmerButton` duplicates `Button` with a 3.2s infinite sweep and hardcoded `#2563EB`. `AuroraBackground.tsx` and `.magic-border-beam-spinner` are unused dead code. | `src/components/ui/ShimmerButton.tsx`, `src/components/ui/AuroraBackground.tsx`, `src/index.css:142-248` | Consolidate primary CTAs onto `Button` (`variant="primary"` / `variant="secondary"`) and remove dead `AuroraBackground` and `.magic-border-beam-spinner` / `.academy-aurora-layer` CSS. | Check all pages importing `ShimmerButton` (`HomePage`, `CourseDetailPage`, `PricingPage`, `CheckoutPage`). | Fixed |
| **M-03** | **Medium** | **Missing subtle Geist polish on `DitherField` & decorative patterns**: `HomePage` `DitherField` runs continuous WebGL RAF loop even if user prefers reduced motion toggled dynamically. | `src/components/ui/DitherField.tsx:157-276` | Keep `DitherField` subtle on Hero, listen for `prefers-reduced-motion` media query changes, and ensure crisp Geist blue/neutral integration. | Ensure no layout shift or GPU spike on mobile. | Fixed (Aligned Geist colors) |

---

### E. Video Player Functionality (`VideoDetailPage.tsx`)

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **V-01** | **High** | **Placeholder disguised as active player**: Clicking "Watch Now" sets `isPlaying=true` and shows a static `<div>` with `<PlayCircle />` and `t.videos.playerNotice`, with no `<video>` element and no `streamUrl` field in `VideoItem` (`src/types/index.ts:88-106`, `src/data/mockCatalog.ts`). | `src/pages/VideoDetailPage.tsx:132-170`, `src/types/index.ts:88-106` | Add optional `streamUrl?: string` and `posterUrl?: string` to `VideoItem` type. When `streamUrl` is provided by backend API, render a responsive, accessible `<video controls playsInline preload="metadata">` with loading & error handling. When absent (mock mode), render a clearly labeled **"Demo Preview — Streaming Unavailable in Mock Mode"** state without fabricating fake video URLs, and document required backend streaming integration. | Must preserve all existing `hasVideoAccess`, watchlist, and `isPlaying` toggle behavior. | Fixed (Backend stream integration documented) |

---

### F. External Portals & Security

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **E-01** | **Medium** | **External portal links (`userAppUrl`) lack URL protocol validation & explicit `noopener`**: `PublicHeader.tsx` and `CourseDetailPage.tsx` link to `API_CONFIG.userAppUrl` with `target="_blank" rel="noreferrer"`. | `src/components/layout/PublicHeader.tsx:305-314, 518-526`; `src/pages/CourseDetailPage.tsx:623-631`; `src/services/apiClient.ts:6-11`; `src/lib/security.ts` | Add `sanitizeExternalUrl()` in `src/lib/security.ts` (allowing only `http:` / `https:`), use `rel="noopener noreferrer"` on external portal links, and add a helper/fallback notice if misconfigured. Document `:3001` (User App) & `:3002` (Admin App) boundaries clearly. | Add unit tests for `sanitizeExternalUrl` in `security.test.ts`. | Fixed |

---

### G. Accessibility & Responsiveness (WCAG 2.2 AA & 320px–1920px)

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **A-01** | **High** | **Invalid nested interactive elements (`<a><Button>` and `<Link><button>`)**: `PublicHeader`, `HomePage`, `CourseDetailPage`, `VideosPage`, `VideoDetailPage`, `PricingPage`, `CheckoutPage` wrap `<Button>` inside `<Link>`/`<a>`, and `VideoCard` nests `<button>` (watchlist) inside `<Link>` (card). | `src/components/cards/VideoCard.tsx:49-71`; `src/components/layout/PublicHeader.tsx:327-348, 540-559`; `src/pages/HomePage.tsx:135-150, 418-428`; `src/pages/CourseDetailPage.tsx:96-98, 623-631`; `src/pages/VideosPage.tsx:176-187`; `src/pages/VideoDetailPage.tsx:66-68`; `src/pages/PricingPage.tsx:178-182`; `src/pages/CheckoutPage.tsx:255-260, 412-422` | Export `buttonClasses()` helper from `Button.tsx` so `<Link>`/`<a>` render directly as styled links without nested `<button>`. Refactor `VideoCard` to use a card container with a primary `<Link>` on the title/overlay and a sibling watchlist `<button>`. | Verify keyboard Tab order and focus rings on all cards & CTAs. | Fixed |
| **A-02** | **High** | **Missing ARIA states on accordions, toggles & payment selectors**: Curriculum accordions (`CourseDetailPage`), FAQ accordions (`PricingPage`, `StaticPages`), footer mobile accordions (`PublicFooter`), mobile summary toggle (`CheckoutPage`), billing toggle (`PricingPage`), and payment method tiles (`CheckoutPage`) omit `aria-expanded`/`aria-controls`/`aria-pressed`. | `src/pages/CourseDetailPage.tsx:440`; `src/pages/PricingPage.tsx:59-77, 280`; `src/pages/StaticPages.tsx:277`; `src/components/layout/PublicFooter.tsx:144`; `src/pages/CheckoutPage.tsx:380, 494` | Add `aria-expanded`, `aria-controls`, `aria-pressed`, and semantic `<section>`/`region` wiring to all expandable controls and toggle buttons. | Purely additive ARIA attributes; zero visual regressions. | Fixed |
| **A-03** | **Medium** | **Missing Skip-to-Content link & small touch targets**: No skip link in `MainLayout`; several icon/close buttons (`SearchPanel` close, `PublicHeader` mobile close, `CoursesPage` search clear, `AuthPages` password toggle) have small hit targets (< 40–44px) or miss clear `aria-label` on `VideosPage` search input. | `src/components/layout/MainLayout.tsx:24`; `src/components/layout/SearchPanel.tsx:112`; `src/components/layout/PublicHeader.tsx:418`; `src/pages/CoursesPage.tsx:284`; `src/pages/AuthPages.tsx:175, 321`; `src/pages/VideosPage.tsx:93-103` | Add accessible skip link (`sr-only focus:not-sr-only`) to `#main-content` in `MainLayout`, increase touch hit areas (`min-h-10 min-w-10` / `h-11 w-11` on mobile where appropriate), and ensure `VideosPage` search input has `aria-label`. | Check header alignment at `320px`, `375px`, `1024px`. | Fixed |

---

### H. Performance, Code Quality & Testing Gaps

| ID | Severity | Finding | File & Line Numbers | Recommended Solution | Dependencies / Regressions | Status |
|---|---|---|---|---|---|---|
| **P-01** | **Medium** | **Dead code & unused assets**: `AuroraBackground.tsx` is unused; `.magic-border-beam-spinner`, `.academy-aurora-layer`, `.saas-card` CSS rules are unused; `public/images/academy-mark.svg` (665KB), `academy-spark.svg` (457KB), `play-badge.png`, `robot-mascot.webp` are unreferenced. | `src/components/ui/AuroraBackground.tsx`, `src/index.css:142-228, 399-419`, `public/images/` | Remove unused `AuroraBackground.tsx`, `ShimmerButton.tsx` (after migrating to `Button`), and unused CSS rules. Document unreferenced `public/images/` assets. | Confirm via repo-wide grep before deleting any file. | Fixed (Dead code/CSS removed; unused `public/images/` preserved & documented) |
| **Q-01** | **High** | **Minimal test coverage (utilities only)**: `vitest` currently only has 2 unit test files (7 tests total) covering `pricingMath` and `security`. Zero tests exist for components, forms, theme/i18n, routing, 404, or Error Boundary. | `src/lib/__tests__/pricingMath.test.ts`, `src/lib/__tests__/security.test.ts` | Expand unit tests (`pricingMath`, `security`, `catalogService`), add component & route tests (Header, CourseCard, VideoCard, SearchPanel, AuthPages, CheckoutPage, NotFoundPage, ErrorBoundary, Theme/I18n), and run E2E/browser verification if available. | Requires Linux native binaries (`@esbuild/linux-x64`) in WSL environment to run `vitest`/`vite`. | Fixed (Unit/service/component/route tests added; Playwright E2E unavailable without browser binary) |
| **Q-02** | **Medium** | **Missing `lint` script in `package.json`**: No ESLint script is configured in `package.json`. | `package.json:6-12` | Keep `tsconfig.app.json` strict (`noUnusedLocals`, `noUnusedParameters`) verified via `npm run typecheck` and document absence of ESLint rather than installing unnecessary dependencies. | Do not install heavy unneeded dependencies. | Documented (Not blocking) |

---

## 3. Prioritized Execution Plan

1. **Group 1 — Design Tokens, Fonts & Material CSS (`index.html`, `src/index.css`, `src/main.tsx`)**: Local `geist` `.woff2` fonts + Khmer fallback, centralized Geist semantic light/dark variables, consolidated `.geist-card` / `.geist-panel`, removal of unused CSS & `AuroraBackground.tsx`.
2. **Group 2 — Routing, Error Boundary, 404 & Security (`src/App.tsx`, `src/components/ui/ErrorBoundary.tsx`, `src/pages/NotFoundPage.tsx`, `src/lib/security.ts`, `src/services/apiClient.ts`)**: Add `ErrorBoundary`, `NotFoundPage`, `sanitizeExternalUrl`.
3. **Group 3 — Shared UI & Layout Components (`Button`, `Input`, `Dropdown`, `Badge`, `Alert`, `Modal`, `Pagination`, `Skeleton`, `PageLoader`, `MainLayout`, `PublicHeader`, `PublicFooter`, `SearchPanel`, `CourseCard`, `VideoCard`)**: Remove `ShimmerButton`, fix nested interactive elements, fix headings & ARIA, align all colors to Geist tokens.
4. **Group 4 — Pages & Video Player Refinement (`HomePage`, `CoursesPage`, `CourseDetailPage`, `VideosPage`, `VideoDetailPage`, `CategoriesPage`, `PricingPage`, `CheckoutPage`, `AuthPages`, `StaticPages`)**: Align all pages to Geist tokens/surfaces, fix VideoDetailPage honest demo/stream player, fix headings/ARIA/focus/touch targets.
5. **Group 5 — Tests & Verification**: Expand unit, component, and route tests, verify `typecheck`, `test`, `build`, and inspect UI at desktop & mobile viewports.
