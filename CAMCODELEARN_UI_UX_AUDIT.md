# CAMCODELEARN UI/UX AUDIT & GEIST DESIGN SYSTEM ROADMAP

**Repository:** `edustream-public-web` (CamcodeLearn — Learning & Video Streaming Platform)  
**Primary Design Reference:** [Vercel Geist Design System](https://vercel.com/geist)  
**Audit Date:** 2026-11-26  
**Phase:** Phase 1 – Complete Project Audit (Read-Only; No Source Code Modified)

---

## 1. Technical Architecture Summary

| Area | Actual Implementation |
|---|---|
| **Framework & Build** | Vite `6.1.0` + React `19.0.0` + TypeScript `5.7.3` (SPA — **not** Next.js App Router) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite` `4.0.6`) with `@theme` and `@custom-variant dark` |
| **Routing** | `react-router-dom` `7.1.5` with `React.lazy()` + `Suspense` route code splitting |
| **Icons & Media** | `lucide-react` `0.475.0` + custom SVGs (`video-player.svg`, `FlagIcon.tsx`, `robot-mascot.webp`) |
| **Typography** | `geist` (`1.9.2`), Google Fonts (`Inter` / `JetBrains Mono` / `Siemreap`), local `public/fonts/KhmerOSSiemreap.ttf` |
| **Validation & Feedback** | `zod` `4.6.7`, `sonner` `2.0.8` |
| **State & Contexts** | `AuthContext`, `ThemeContext` (Light/Dark), `I18nContext` (`en` / `km` bilingual) |
| **Backend & External Apps** | REST API configured via `VITE_API_BASE_URL` (`http://localhost:4000/api`), `VITE_USE_MOCK_API=true`, external User App (`:3001`) and Admin App (`:3002`) — **no** Supabase, database schema, or Admin/Student Dashboard routes in this repo |
| **Testing** | `vitest` `4.1.12` (`pricingMath.test.ts`, `security.test.ts`), `npm run typecheck`, `npm run build` |

---

## 2. Complete Route Inventory

| Route | Page Component | Category |
|---|---|---|
| `/` | `HomePage` | Public Storefront |
| `/courses` | `CoursesPage` | Public Course Catalog |
| `/courses/:slug` | `CourseDetailPage` | Public Course Detail & Preview |
| `/videos` | `VideosPage` | Public Video Library |
| `/videos/:slug` | `VideoDetailPage` | Public Video Player & Access Gate |
| `/categories` | `CategoriesPage` | Public Category Directory |
| `/pricing` | `PricingPage` | Public Subscription Plans & Comparison |
| `/checkout` | `CheckoutPage` | Course & Subscription Checkout |
| `/login` | `LoginPage` (`AuthPages.tsx`) | Authentication |
| `/register` | `RegisterPage` (`AuthPages.tsx`) | Authentication |
| `/forgot-password` | `ForgotPasswordPage` (`AuthPages.tsx`) | Authentication |
| `/reset-password` | `ResetPasswordPage` (`AuthPages.tsx`) | Authentication |
| `/about`, `/contact`, `/terms`, `/privacy`, `/faq` | `StaticPages.tsx` | Informational Pages |
| `*` | `<Navigate to="/" replace />` | Fallback |

*(Note: Student Dashboard, Profile/Settings, and Admin Dashboard live in external apps on ports `3001` and `3002` and are not present in this codebase.)*

---

## 3. Page-by-Page & Component Audit (UI/UX Holes)

### A. Global Design System, Surfaces & Backgrounds
1. **Mixed Card & Surface Systems**
   - **Problem**: Four competing card/panel classes coexist: `.glass-panel`, `.glass-card`, `.saas-card`, and `.geist-card`, with mixed border radii (`rounded-[12px]`, `rounded-[14px]`, `rounded-[16px]`, `rounded-2xl`, `rounded-3xl`).
   - **Severity**: High
   - **UX Impact**: Cards on `HomePage` (`Benefits`, `Pricing`, `Testimonials`, `Categories`), `CategoriesPage`, `PricingPage`, `CheckoutPage`, and `StaticPages` look visually different from the Geist-styled `CourseCard` and `VideoCard`.
   - **Recommended Solution**: Consolidate onto unified Geist surface tokens (`Background 1`, `Background 2`, `Component`, `1px` hairline `#EAEAEA` / `#262626`) and standardize radii (`8px` controls, `12px` cards, `16px` panels).
   - **Files Affected**: `src/index.css`, `src/pages/HomePage.tsx`, `src/pages/CategoriesPage.tsx`, `src/pages/PricingPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/StaticPages.tsx`.

2. **Overloaded Decorative Backgrounds & Effects**
   - **Problem**: Multiple overlapping decorative systems exist simultaneously: `.academy-bg`, `.academy-grid`, `AuroraBackground.tsx` (`.academy-aurora-layer`), `DotPattern.tsx`, `GridPattern.tsx`, `DitherField.tsx` (353-line WebGL shader), and `ShimmerButton.tsx`.
   - **Severity**: Medium–High
   - **UX Impact**: Conflicts with Geist's calm, minimal, content-first surface discipline; WebGL `DitherField` and continuous CSS animations add unnecessary GPU/battery overhead on mobile.
   - **Recommended Solution**: Simplify global and section backgrounds to clean Geist neutral surfaces with restrained, subtle `DotPattern`/`GridPattern` only where it aids hierarchy, and remove unused/excessive decorative animations.
   - **Files Affected**: `src/index.css`, `src/components/layout/MainLayout.tsx`, `src/pages/HomePage.tsx`, `src/pages/VideosPage.tsx`, `src/pages/AuthPages.tsx`, `src/components/ui/AuroraBackground.tsx`, `src/components/ui/DitherField.tsx`, `src/components/ui/ShimmerButton.tsx`.

3. **Typography Inconsistency (`Inter` vs `Roboto` vs `Geist Sans`)**
   - **Problem**: `index.html` loads `Inter`, `JetBrains Mono`, and `Siemreap`; `src/index.css` sets `Inter` on `html` even though `geist` (`1.9.2`) was installed; headings/metadata mix arbitrary pixel sizes (`11.5px`, `13.5px`, `15px`, `17px`, `18px`, `19px`) without a strict Geist type scale.
   - **Severity**: High
   - **UX Impact**: Inconsistent typographic rhythm across pages and components.
   - **Recommended Solution**: Establish a clean Geist Sans + Geist Mono type scale (preserving `Khmer OS Siemreap` for `html[lang="km"]`) and eliminate duplicate Google Font requests where local/bundled fonts are used.
   - **Files Affected**: `index.html`, `src/index.css`, `src/main.tsx`.

### B. Shared UI Primitives & Controls
4. **Hardcoded Hex Colors & Brittle Dark-Mode Overrides**
   - **Problem**: `src/index.css` relies on ~150 lines of `@layer utilities` overrides (`html.dark .text-\[\#0F172A\]`, `html.dark .bg-white`, `html.dark .border-\[\#E2E8F0\]`) while individual components (`Input.tsx`, `Dropdown.tsx`, `Alert.tsx`, `Badge.tsx`, `Pagination.tsx`, `SearchPanel.tsx`, `StaticPages.tsx`) still mix hardcoded `#172033`, `#475569`, `#CBD5E1`, `#EFF6FF`, `#0B1220`.
   - **Severity**: High
   - **UX Impact**: Risk of contrast regressions in dark/light mode when new classes are added.
   - **Recommended Solution**: Migrate components to semantic CSS custom properties (`--ds-background-1`, `--ds-background-2`, `--ds-gray-100..1000`, `--ds-blue-*`) so light and dark themes work natively without override hacks.
   - **Files Affected**: `src/index.css`, `src/components/ui/*.tsx`, `src/components/layout/*.tsx`, `src/pages/*.tsx`.

5. **Duplicate Action Button Implementations**
   - **Problem**: `ShimmerButton.tsx` duplicates `Button.tsx` for primary CTAs, while several pages style `<Link>`/`<button>` inline instead of using `Button`.
   - **Severity**: Medium
   - **UX Impact**: Inconsistent button heights, focus rings, and hover states across `HomePage`, `CoursesPage`, `CourseDetailPage`, and `PricingPage`.
   - **Recommended Solution**: Standardize all primary/secondary/outline/ghost actions on `Button.tsx` using Geist tokens.
   - **Files Affected**: `src/components/ui/Button.tsx`, `src/components/ui/ShimmerButton.tsx`, `src/pages/*.tsx`.

6. **Input, Select, and Textarea Inconsistency**
   - **Problem**: Native `<select>` elements in `CoursesPage.tsx` and `PublicHeader.tsx`, and `<textarea>` in `StaticPages.tsx`, do not share the same height, border, focus ring, or dark-mode tokens as `Input.tsx` and `Dropdown.tsx`.
   - **Severity**: Medium
   - **UX Impact**: Form controls look mismatched in `CoursesPage` filter panel and `ContactPage`.
   - **Recommended Solution**: Standardize `Input`, `Dropdown`, native `select`, and `textarea` with unified Geist `1px` border and focus-ring styles.
   - **Files Affected**: `src/components/ui/Input.tsx`, `src/components/ui/Dropdown.tsx`, `src/pages/CoursesPage.tsx`, `src/pages/StaticPages.tsx`.

### C. Page-by-Page Findings
7. **Header & Mobile Drawer (`PublicHeader.tsx`, `SearchPanel.tsx`)**
   - **Problem**: Mobile drawer (`w-75`) lacks focus trapping and focus restoration (unlike `Modal.tsx`); `SearchPanel.tsx` uses hardcoded `#0F172A` / `bg-white` colors; desktop inline search `<select>` (`bg-white/80`) has inconsistent contrast in dark mode.
   - **Severity**: Medium–High
   - **Files Affected**: `src/components/layout/PublicHeader.tsx`, `src/components/layout/SearchPanel.tsx`.

8. **Footer (`PublicFooter.tsx`)**
   - **Problem**: Always renders a dark `#171717` / `#0A0A0A` block even in light mode, and the newsletter card uses a pastel/gradient background (`from-[#FDE2E4] via-[#FAF0CA] to-[#D8F3DC]`) that clashes with Geist's neutral aesthetic.
   - **Severity**: Medium
   - **Files Affected**: `src/components/layout/PublicFooter.tsx`.

9. **Homepage (`HomePage.tsx`)**
   - **Problem**: Combines `DitherField` WebGL canvas, `AuroraBackground`, `ShimmerButton`, and legacy `.glass-card` / `.glass-panel` blocks; `Categories` and `Benefits` cards use mixed border radii and icons.
   - **Severity**: Medium–High
   - **Files Affected**: `src/pages/HomePage.tsx`.

10. **Course Catalog (`CoursesPage.tsx`) & Course Detail (`CourseDetailPage.tsx`)**
    - **Problem**: Filter panel in `CoursesPage.tsx` uses raw `<select>` elements with light-only `bg-white` classes (`difficulty`, `priceType`, `rating`, `duration`, `language`, `instructor`); `CourseDetailPage.tsx` uses `rounded-[12px]`/`rounded-[14px]` mixed with `.glass-card` and lacks a dedicated empty/error state polish for missing reviews.
    - **Severity**: High (broken dark-mode contrast on filter `<select>`s in `CoursesPage.tsx`).
    - **Files Affected**: `src/pages/CoursesPage.tsx`, `src/pages/CourseDetailPage.tsx`.

11. **Video Library (`VideosPage.tsx`) & Video Detail (`VideoDetailPage.tsx`)**
    - **Problem**: `VideosPage.tsx` featured banner mixes `GridPattern`, `BlurFade`, and `.glass-panel`; `VideoDetailPage.tsx` uses `.glass-panel` and hardcoded `#0B1220` / `#25344B` colors.
    - **Severity**: Medium
    - **Files Affected**: `src/pages/VideosPage.tsx`, `src/pages/VideoDetailPage.tsx`.

12. **Pricing (`PricingPage.tsx`), Checkout (`CheckoutPage.tsx`), Auth (`AuthPages.tsx`), & Static (`StaticPages.tsx`)**
    - **Problem**: All four still use `.glass-card` / `.glass-panel` with mixed radii (`rounded-[14px]`, `rounded-[16px]`, `rounded-3xl`), hardcoded `#E2E8F0` / `#475569` / `#25344B` borders/text, and `AuthPages.tsx` uses `DotPattern` + `.glass-panel` instead of clean Geist elevated surfaces.
    - **Severity**: Medium
    - **Files Affected**: `src/pages/PricingPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/AuthPages.tsx`, `src/pages/StaticPages.tsx`.

### D. Accessibility & Responsive Findings
13. **Focus Management & Touch Targets**
    - `PublicHeader.tsx` mobile drawer and `SearchPanel.tsx` lack full `Tab` focus trapping and focus restoration on close.
    - Interactive icon buttons (`36px` in `PublicHeader`, `VideoCard`, `CoursesPage`) are slightly below `44px` on touch devices.
    - `CoursesPage.tsx` filter `<select>` elements have `bg-white text-secondary` without `dark:bg-[#0A0A0A]`, causing poor readability in dark mode.
    - `PricingPage.tsx` comparison table (`min-w-150`) relies on horizontal scroll without a visual scroll cue on `320px–430px`.

---

## 4. Prioritized Implementation Roadmap (Awaiting Approval)

| Stage | Scope | Target Files |
|---|---|---|
| **Stage 2** | **Geist Design System Tokens, Typography & Materials**: Define semantic Geist tokens (`Background 1/2`, `Component`, `1px` borders, `Geist Sans` + `Geist Mono` + `Khmer OS Siemreap`, Geist type scale, unified surface classes) and document in `CAMCODELEARN_GEIST_DESIGN_SYSTEM.md`. | `index.html`, `src/index.css`, `src/main.tsx` |
| **Stage 3** | **Global Layout & Shared Components**: Unify `Button`, `Input`, `Dropdown`, `Badge`, `Alert`, `Modal`, `Pagination`, `Skeleton`, `PageLoader`, `PublicHeader` (focus-trapped drawer), `SearchPanel`, `PublicFooter`, `CourseCard`, and `VideoCard` under Geist. | `src/components/ui/*`, `src/components/layout/*`, `src/components/cards/*` |
| **Stage 4** | **Public Storefront Pages**: Upgrade `HomePage`, `CoursesPage` (fix dark-mode filter `<select>`s), `CategoriesPage`, `PricingPage`, and `StaticPages` to Geist surfaces, spacing, and calm backgrounds. | `src/pages/HomePage.tsx`, `CoursesPage.tsx`, `CategoriesPage.tsx`, `PricingPage.tsx`, `StaticPages.tsx` |
| **Stage 5** | **Learning & Conversion Interfaces**: Upgrade `CourseDetailPage`, `VideosPage`, `VideoDetailPage`, `CheckoutPage`, and `AuthPages` while strictly preserving all data and business logic. | `src/pages/CourseDetailPage.tsx`, `VideosPage.tsx`, `VideoDetailPage.tsx`, `CheckoutPage.tsx`, `AuthPages.tsx` |
| **Stage 6** | **Admin / External Apps Note**: Confirm no admin/student dashboard routes exist in this repo (`:3001` / `:3002` are external). | N/A |
| **Stage 7** | **Responsive & Accessibility Audit**: Verify `320px–1920px`, focus traps, ARIA attributes, touch targets, and contrast; write `CAMCODELEARN_RESPONSIVE_AUDIT.md` & `CAMCODELEARN_ACCESSIBILITY_AUDIT.md`. | All pages & components |
| **Stage 8** | **Final QA & Regression Validation**: Run `tsc --noEmit`, `vitest run`, `vite build`, verify all data/pricing/routes are untouched, and deliver `CAMCODELEARN_UI_UX_IMPLEMENTATION_REPORT.md` & `CAMCODELEARN_FINAL_QA_REPORT.md`. | Test suite & build |
