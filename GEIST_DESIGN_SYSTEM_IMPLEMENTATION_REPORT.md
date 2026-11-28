# CamcodeLearn — Geist Design System Implementation Report

**Repository:** `edustream-public-web` (CamcodeLearn Public Web)  
**Primary Design Reference:** [Vercel Geist Design System](https://vercel.com/geist) (`colors`, `typography`, `materials`, `font`)  
**Date:** 2026-11-26

---

## 1. Initial Audit Summary

A complete source-level audit of `src/`, `index.html`, `package.json`, `.env.example`, and `public/` was performed and documented in [`GEIST_DESIGN_SYSTEM_AUDIT.md`](./GEIST_DESIGN_SYSTEM_AUDIT.md). While an initial Geist migration had introduced `:root` and `html.dark` tokens in `src/index.css`, key architectural, visual, accessibility, and functional gaps remained across routing, error handling, typography loading, color consistency, nested interactive HTML, video player disclosure, and automated testing.

---

## 2. Issues Confirmed

- **Critical (`R-01`, `R-02`)**: Unknown routes silently redirected to `/` (`<Route path="*" element={<Navigate to="/" replace />} />`), and no React Error Boundary wrapped the router or lazy-loaded routes.
- **High (`C-01`–`C-04`)**: Legacy navy/slate/blue hexes (`#172033`, `#0F172A`, `#0B1220`, `#111B2E`, `#17243A`, `#25344B`, `#E2E8F0`, `#F8FAFC`, `#E8EEF8`, `#475569`, `#64748B`, `#2563EB`, `slate-*`) remained in `PublicHeader`, `PublicFooter`, `SearchPanel`, `Badge`, `Input`, `Dropdown`, `Modal`, `Pagination`, `Skeleton`, `PageLoader`, `ShimmerButton`, and all 9 page modules, patched by ~157 lines of `@layer utilities` dark overrides in `src/index.css`.
- **High (`T-01`, `T-02`, `T-03`)**: Bundled `geist` (`1.9.2`) `.woff2` fonts were unused while `index.html` loaded `Geist` externally from Google Fonts; `html[lang="km"]` referenced `'Inter'` (unloaded) without `'Noto Sans Khmer'`; heading skips existed in `PublicFooter` (`<h4>`), `CoursesPage` empty state (`<h3>`), and `Modal` (`<h3>`).
- **High (`M-01`, `V-01`, `A-01`, `A-02`, `Q-01`)**: Competing `.glass-card`/`.glass-panel`/`.saas-card`/`.geist-card` styles and duplicate `ShimmerButton` existed alongside dead `AuroraBackground` and unused CSS; `VideoDetailPage` presented a static mock placeholder as an active player; nested `<Link><Button>` and `<button>` inside `<Link>` (`VideoCard`) broke HTML5 interactive nesting rules; accordions/toggles lacked `aria-expanded`/`aria-controls`/`aria-pressed`; automated tests only covered 2 utility files (7 tests).
- **Medium (`E-01`, `A-03`, `P-01`, `Q-02`)**: External `userAppUrl` links lacked URL protocol sanitization and explicit `rel="noopener noreferrer"`; `MainLayout` lacked a skip-to-content link; several icon/close buttons were below 40px; `package.json` lacked a `lint` script.

---

## 3. Issues Fixed

- Replaced silent `*` redirect with a dedicated Geist [`NotFoundPage`](src/pages/NotFoundPage.tsx).
- Added [`RouteErrorBoundary`](src/components/ui/ErrorBoundary.tsx) around both the root router and `<Suspense><Outlet /></Suspense>` with chunk-load error recovery, route-change reset, and safe error logging.
- Consolidated light/dark color tokens in `src/index.css` and migrated every shared UI primitive, layout component, and page off legacy slate/navy/glass classes.
- Bundled local `Geist` and `Geist Mono` variable `.woff2` fonts via `@font-face` in `src/index.css` and updated Khmer localization fallbacks (`Khmer OS Siemreap`, `Noto Sans Khmer`, `Siemreap`, `Geist`).
- Removed dead `AuroraBackground.tsx`, `ShimmerButton.tsx`, `.saas-card`, `.glass-*`, `.academy-aurora-layer`, and `.magic-border-beam-spinner` rules.
- Fixed real UI & icon bugs: added crisp `public/favicon.svg`, symmetric Angkor Wat flag silhouette in `FlagIcon.tsx`, swapped legacy `/images/video-player.svg` in `VideoCard.tsx` for Lucide `<Play />`, aligned desktop & mobile language switchers and active demo account checkmarks in `PublicHeader.tsx`, fixed `hidden min-[375px]:inline-flex` specificity conflict on 320px viewports, replaced duplicate `/contact` footer icon link with `/videos`, and unified `Input` height (`h-11`).
- Fixed application logic holes across auth, checkout, catalog, and static forms: wired `ForgotPasswordPage` / `ResetPasswordPage` to `authService`, preserved checkout buyer details (`fullName`, `email`, `phone`) instead of hardcoded mock names, reset stale checkout state on URL param changes and skipped invalid card checks on `$0.00` orders, guarded `NaN` URL filter params, tracked selected preview lesson title in `CourseDetailPage`, added error/Retry states across catalog & detail pages, and localized client-side validation in `ContactPage` and newsletter footer forms.
- Fixed all nested `<Link><Button>` and `VideoCard` `<button>`-inside-`<Link>` violations using `buttonClasses()` and sibling action positioning.
- Added `sanitizeExternalUrl()` in `src/lib/security.ts`, applied it in `src/services/apiClient.ts`, and added `rel="noopener noreferrer"` on external portal links.
- Updated `VideoDetailPage.tsx` to render an accessible `<video controls>` when a `streamUrl` is supplied by the backend and an explicit **"Demo Preview Mode"** disclosure when no stream URL exists in mock mode.
- Added skip-to-content link (`#main-content`), fixed heading levels (`<h2>` in footer/empty states/modals), added `aria-expanded`/`aria-controls`/`aria-pressed` across accordions and toggles, and expanded test coverage to 4 suites / 26 passing tests.

---

## 4. Files Modified, Added, and Removed

### Modified
- `index.html` — Added `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`, updated font preconnect/Khmer fallback (`Noto Sans Khmer`, `Siemreap`) and meta description, and removed redundant external `Geist` font request.
- `src/index.css` — Local `Geist` & `Geist Mono` `@font-face`, semantic Geist light/dark CSS variables, unified `.geist-card`/`.geist-panel`, Khmer font stack, reduced-motion guards, removed dead `.glass-*`/`.saas-card`/`.academy-aurora-layer`/`.magic-border-beam-spinner`.
- `src/App.tsx` — Added lazy `NotFoundPage` on `*`, exported `AppRoutes`, wrapped router in `RouteErrorBoundary`.
- `src/types/index.ts` — Added optional `streamUrl?: string` and `posterUrl?: string` on `VideoItem`.
- `src/lib/security.ts` — Added `sanitizeExternalUrl()`.
- `src/services/apiClient.ts`, `src/services/authService.ts`, `src/context/AuthContext.tsx` — Sanitized external URLs (`baseUrl`, `userAppUrl`, `adminAppUrl`), matched login `identifier` cleanly in mock auth, added `createCheckoutSessionUser(...)` to preserve actual buyer details during checkout grants, and honored `!API_CONFIG.useMock`.
- `src/i18n/translations.ts` — Added EN/KM translations for `skipToContent`, `notFound`, `errorBoundary`, and `videos` demo/stream playback states.
- `src/components/layout/MainLayout.tsx` — Added skip link, `#main-content`, and `RouteErrorBoundary` around `<Suspense><Outlet /></Suspense>`.
- `src/components/layout/PublicHeader.tsx` — Fixed `hidden min-[375px]:inline-flex` specificity conflict below `375px`, aligned desktop & mobile language buttons to show active locale flag + label, added active `<Check />` / `aria-checked` on demo account presets, Geist tokens, `buttonClasses` links (no nested `<button>`), `rel="noopener noreferrer"`, larger mobile touch targets (`h-10 w-10`).
- `src/components/layout/PublicFooter.tsx` — Geist neutral dark tokens, `<h2>` column headings, `aria-expanded`/`aria-controls` on mobile accordions, replaced duplicate `/contact` icon link with `/videos`, added `noValidate` + inline newsletter email error feedback.
- `src/components/layout/SearchPanel.tsx` — Geist tokens, `aria-label` on search input, `h-10 w-10` close button.
- `src/components/cards/CourseCard.tsx` — Geist semantic tokens, `font-mono-custom tabular-nums`, `>=12px` text scale.
- `src/components/cards/VideoCard.tsx` — Swapped legacy `/images/video-player.svg` for Lucide `<Play />`, sibling watchlist button (no nested button inside `<a>`), `h-10 w-10` hit target, `aria-pressed`.
- `src/components/ui/FlagIcon.tsx` — Symmetric Angkor Wat silhouette geometry in `km` flag and crisp `en` flag rendering.
- `src/components/ui/Button.tsx`, `Badge.tsx`, `Input.tsx`, `Dropdown.tsx`, `Modal.tsx`, `Pagination.tsx`, `Skeleton.tsx`, `PageLoader.tsx`, `DotPattern.tsx`, `GridPattern.tsx`, `DitherField.tsx` — Aligned all primitives to Geist tokens, unified `Input` height (`h-11`), exported `buttonClasses()`, fixed `Modal` heading (`<h2>`), increased `Pagination` touch size (`h-10 min-w-10`).
- `src/pages/HomePage.tsx`, `CoursesPage.tsx`, `CourseDetailPage.tsx`, `VideosPage.tsx`, `VideoDetailPage.tsx`, `CategoriesPage.tsx`, `PricingPage.tsx`, `CheckoutPage.tsx`, `AuthPages.tsx`, `StaticPages.tsx` — Unified surfaces (`geist-card`/`geist-panel`), guarded `NaN` URL params, added `.catch()` + Retry `<Alert>` states, tracked `previewLessonTitle` per preview click, validated `$0.00` vs card checkout submissions, reset stale checkout state on URL param changes, wired forgot/reset password tokens to `authService`, added EN/KM `ContactPage` validation, fixed nested buttons/headings/ARIA attributes, and implemented honest video player state.
- `src/lib/__tests__/pricingMath.test.ts`, `src/lib/__tests__/security.test.ts` — Expanded edge-case coverage.

### Added
- `public/favicon.svg`
- `GEIST_DESIGN_SYSTEM_AUDIT.md`
- `GEIST_DESIGN_SYSTEM_IMPLEMENTATION_REPORT.md`
- `src/components/ui/ErrorBoundary.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/services/__tests__/services.test.ts`
- `src/components/__tests__/uiAndRoutes.test.tsx`

### Removed
- `src/components/ui/AuroraBackground.tsx` (unused dead code)
- `src/components/ui/ShimmerButton.tsx` (replaced by unified `Button`)

---

## 5. Design-System Changes

- Standardized card surfaces on `.geist-card` (`12px` radius, `1px solid var(--color-border)`, `--card-shadow`) and featured summary panels on `.geist-panel` (`16px` radius, `--panel-shadow`).
- Removed competing `.glass`, `.glass-panel`, `.glass-card`, and `.saas-card` classes so every page shares identical hairline borders, radii, and elevation behavior.
- Consolidated all CTAs onto `Button` / `buttonClasses()` (`primary`, `secondary`, `outline`, `ghost`, `danger`, `success`).

---

## 6. Color and Typography Changes

- **Semantic Color Tokens (`src/index.css`)**:
  - Light: `--ds-background-1` (`#FFFFFF`), `--ds-background-2` (`#FAFAFA`), `--ds-gray-100` (`#F5F5F5`), `--ds-gray-200` (`#EBEBEB`), `--ds-gray-400` (`#EAEAEA`), `--ds-gray-500` (`#A3A3A3`), `--ds-gray-700` (`#666666`), `--ds-gray-900` (`#444444`), `--ds-gray-1000` (`#171717`), `--ds-blue-600` (`#0070F3`), `--ds-blue-700` (`#0060DF`).
  - Dark: `--ds-background-1` (`#0A0A0A`), `--ds-background-2` (`#000000`), `--ds-gray-100` (`#111111`), `--ds-gray-200` (`#1A1A1A`), `--ds-gray-400` (`#262626`), `--ds-gray-500` (`#525252`), `--ds-gray-700` (`#888888`), `--ds-gray-900` (`#A1A1AA`), `--ds-gray-1000` (`#EDEDED`), `--ds-blue-600` (`#3291FF`), `--ds-blue-700` (`#0070F3`).
  - Updated `--color-secondary`, `--color-muted`, `--color-success`, `--color-warning`, `--color-error`, `--color-info`, `--color-focus-ring`, `--text-main`, `--text-secondary`, and `--text-muted` consistently across both themes.
  - Preserved intentional semantic badges, payment states, category icons, and course/video `thumbnailTheme` covers.
- **Typography**:
  - Bundled `Geist-Variable.woff2` (69.49 kB) and `GeistMono-Variable.woff2` (71.21 kB) directly from `geist@1.9.2`.
  - Updated `html[lang="km"]` stack to `'Khmer OS Siemreap', 'Noto Sans Khmer', 'Siemreap', 'Geist', system-ui, sans-serif` with Khmer-tuned line-heights (`1.72`–`1.75`).
  - Applied `font-mono-custom tabular-nums` to prices, counts, durations, ratings, and order IDs.

---

## 7. Routing and Error-Handling Improvements

- Unknown routes (`*`) now render [`NotFoundPage`](src/pages/NotFoundPage.tsx) with a `404` status badge, localized explanation, **Return Home** (`/`), **Courses** (`/courses`), and **Videos** (`/videos`).
- [`RouteErrorBoundary`](src/components/ui/ErrorBoundary.tsx) wraps both `AppRoutes` and `MainLayout`'s `<Suspense><Outlet /></Suspense>`, catching runtime and lazy-chunk loading errors (`ChunkLoadError` / dynamic import failures), logging safely without exposing stack traces in the UI, and resetting automatically on navigation.

---

## 8. Functional Improvements

- **`VideoDetailPage.tsx`**:
  - Supports real HTML5 `<video controls playsInline preload="metadata">` playback with loading indicator and error recovery whenever `VideoItem.streamUrl` is provided by a live backend API.
  - In current mock mode (no `streamUrl` in `mockCatalog.ts`), displays an explicit **"Demo Preview Mode"** state explaining that no stream URL is configured, with a direct link to the Student App (`:3001`) and a Close button.
- **External Portal Links (`PublicHeader.tsx`, `CourseDetailPage.tsx`, `apiClient.ts`)**:
  - Validated `VITE_USER_APP_URL` and `VITE_ADMIN_APP_URL` via `sanitizeExternalUrl()` (only `http:` / `https:` allowed).
  - Enforced `target="_blank" rel="noopener noreferrer"` on all external links to the Student App (`:3001`).

---

## 9. Responsive and Accessibility Improvements

- Added a keyboard-accessible **Skip to main content** link (`#main-content`) in `MainLayout.tsx`.
- Eliminated invalid nested interactive controls (`<Link><Button>` across 7 files, and `<button>` inside `<Link>` in `VideoCard.tsx`).
- Fixed skipped heading levels in `PublicFooter` (`<h2>`), `CoursesPage` empty state (`<h2>`), and `Modal` (`<h2>`).
- Added `aria-expanded` / `aria-controls` on curriculum, FAQ, footer mobile, and checkout mobile summary accordions, and `aria-pressed` on billing toggles, category pills, watchlist buttons, password toggles, and payment method selectors.
- Increased interactive icon button hit targets to `h-10 w-10` (40px) in mobile header, drawer close, search close, pagination, and watchlist controls.

---

## 10. Tests Executed and Actual Results

Executed after the final edit:

| Check | Command | Outcome | Actual Observed Output |
|---|---|---|---|
| **TypeScript Typecheck** | `npm run typecheck` (`tsc --noEmit`) | **PASS** | 0 errors |
| **Test Suite** | `npm test` (`vitest run`) | **PASS** | 4 test files passed, **26 tests passed** (`pricingMath.test.ts`: 5, `security.test.ts`: 6, `services.test.ts`: 5, `uiAndRoutes.test.tsx`: 10) |
| **Production Build** | `npm run build` (`tsc -b && vite build`) | **PASS** | 1,744 modules transformed in 23.87s; `dist/index.html` `1.63 kB`, CSS bundle `93.82 kB`; local `Geist-Variable.woff2` (`69.49 kB`) & `GeistMono-Variable.woff2` (`71.21 kB`) emitted to `dist/assets/` |
| **Linting** | N/A | **Not Configured** | No `lint` script exists in `package.json`; strict `tsc --noEmit` (`noUnusedLocals`, `noUnusedParameters`) passed |
| **Playwright / Browser E2E** | N/A | **Not Executed** | No Chromium/Playwright browser binary is installed in this Linux sandbox environment; SSR/static component & route rendering was executed via Vitest (`uiAndRoutes.test.tsx`), while live browser viewport/interactive E2E checks require a local browser environment |

*(Environment note: Because `node_modules` was originally installed on Windows, Linux native optional packages from `package-lock.json` — `@rollup/rollup-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`, `lightningcss-linux-x64-gnu`, and `@esbuild/linux-x64` — were unpacked into `node_modules` alongside the existing Windows binaries so `vitest` and `vite build` could execute without altering `package.json` or `package-lock.json`.)*

---

## 11. Remaining Known Issues

1. **No Live Browser E2E / Visual Viewport Run in Sandbox**
   - **Why unresolved**: Headless Chromium / Playwright is not installed in this Linux container.
   - **Required to resolve**: Run `npx playwright test` or inspect `npm run dev` across `320px–1920px` viewports in a browser-enabled environment.
   - **Blocks production?**: No for code correctness (`typecheck`, 26 Vitest tests, and `vite build` pass), but recommended as a final pre-release QA sign-off step.
2. **Unreferenced Legacy Image Assets in `public/images/`**
   - **Why unresolved**: `academy-mark.svg` (665 kB), `academy-spark.svg` (457 kB), `play-badge.png` (8 kB), and `robot-mascot.webp` (4 kB) are not referenced in `src/` or `index.html`, and were left untouched to avoid deleting project assets without explicit confirmation.
   - **Required to resolve**: Confirm whether they are needed externally or remove unused files from `public/images/`.
   - **Blocks production?**: No (static files in `public/` are not imported into JS bundles unless requested).
3. **No ESLint Configuration**
   - **Why unresolved**: `package.json` has no `lint` script or ESLint dependency.
   - **Required to resolve**: Optionally add ESLint + `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y`.
   - **Blocks production?**: No.

---

## 12. Backend or External Dependencies

- **Backend API (`VITE_API_BASE_URL`, default `http://localhost:4000/api`)**: Currently running with `VITE_USE_MOCK_API=true`. Live catalog, auth cookies, coupon validation, checkout order creation, and payment webhook verification require the backend service on port `4000`.
- **Video Streaming Media Source**: `VideoItem` now supports optional `streamUrl` and `posterUrl`. Live video playback requires the backend `/videos` and `/videos/:slug` endpoints to return signed/authorized `streamUrl` (MP4 or HLS with appropriate player support) after verifying user entitlement.
- **External Student & Admin Portals**:
  - Student/Learner App (`VITE_USER_APP_URL`, default `http://localhost:3001`): Handles active course curriculum playback, watch history sync, and billing management (linked from `PublicHeader`, `CourseDetailPage`, and `VideoDetailPage` demo fallback).
  - Admin/Operations Console (`VITE_ADMIN_APP_URL`, default `http://localhost:3002`): Separate application not part of `edustream-public-web`.

---

## 13. Recommended Next Priorities

1. Run live browser visual & interactive E2E tests (Playwright) across `320px`–`1920px` in light/dark modes and `EN`/`ខ្មែរ` locales (covering theme toggle, drawer focus trap, checkout flow, and browser Back/Forward).
2. Connect `VITE_USE_MOCK_API=false` against the `:4000` backend and supply `streamUrl` / `posterUrl` on `VideoItem` responses (adding HLS.js if adaptive `.m3u8` streams are used).
3. Clean up unreferenced images in `public/images/` (`academy-mark.svg`, `academy-spark.svg`, `play-badge.png`, `robot-mascot.webp`) once confirmed unused.
