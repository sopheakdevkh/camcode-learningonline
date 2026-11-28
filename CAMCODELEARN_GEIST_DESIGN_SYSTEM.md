# CAMCODELEARN GEIST DESIGN SYSTEM

**Reference:** [Vercel Geist Design System](https://vercel.com/geist)  
**Scope:** Unified design tokens, typography, materials, and layout rules for `edustream-public-web`.

---

## 1. Color Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--ds-background-1` | `#FFFFFF` | `#0A0A0A` | Primary card, modal, and elevated component surfaces |
| `--ds-background-2` | `#FAFAFA` | `#000000` | Global page canvas background |
| `--ds-gray-100` | `#F5F5F5` | `#111111` | Subtle hover surfaces, secondary chips, table headers |
| `--ds-gray-200` | `#EBEBEB` | `#1A1A1A` | Active/pressed surfaces |
| `--ds-gray-400` | `#EAEAEA` | `#262626` | Default `1px` hairline borders and dividers |
| `--ds-gray-500` | `#A3A3A3` | `#525252` | Hover borders |
| `--ds-gray-700` | `#666666` | `#888888` | Muted metadata, captions, secondary labels |
| `--ds-gray-900` | `#444444` | `#A1A1AA` | Secondary body copy |
| `--ds-gray-1000` | `#171717` | `#EDEDED` | Primary headings, primary text, high-contrast pills |
| `--ds-blue-600` | `#0070F3` | `#3291FF` | Restrained CamcodeLearn interactive blue accent |
| `--color-success` | `#16A34A` | `#16A34A` | Free badges, verified states, positive confirmations |
| `--color-warning` | `#D97706` | `#D97706` | Premium badges, pending verification |
| `--color-error` | `#DC2626` | `#DC2626` | Validation errors, destructive actions |

---

## 2. Typography

- **Primary Interface Font**: `Geist` (`400`, `500`, `600`, `700`) — headings, navigation, body copy, buttons, forms.
- **Technical & Numeric Font**: `Geist Mono` (`400`, `500`, `600`) with `tabular-nums` — course/video metrics, prices, durations, order IDs.
- **Khmer Localization Font**: `Khmer OS Siemreap` (`public/fonts/KhmerOSSiemreap.ttf`) + `Siemreap` fallback — automatically applied under `html[lang="km"]`.

### Type Scale
- **Display**: `34px` → `48px` (`font-weight: 700`, `letter-spacing: -0.02em`)
- **H1 (Page)**: `28px` → `36px` (`font-weight: 700`, `letter-spacing: -0.015em`)
- **H2 (Section)**: `24px` → `28px` (`font-weight: 600`, `letter-spacing: -0.01em`)
- **H3 (Subsection)**: `20px` → `22px` (`font-weight: 600`)
- **Body**: `15px` → `16px` (`line-height: 1.6`)
- **Small / Metadata**: `13px`–`14px` / `12px`

---

## 3. Materials & Elevation

- **Base Surface**: `--ds-background-2` (`#FAFAFA` / `#000000`) with subtle top atmospheric glow (`rgba(0,112,243,0.04)`).
- **Card Surface (`.geist-card`, `.saas-card`, `.glass-card`)**: `--ds-background-1` (`#FFFFFF` / `#0A0A0A`), `1px solid var(--ds-gray-400)`, `rounded-[12px]`, `--card-shadow`.
- **Panel / Modal Surface (`.glass-panel`)**: `--ds-background-1`, `1px solid var(--ds-gray-400)`, `rounded-[16px]`, `--panel-shadow`.
- **Interactive Hover**: Hairline border transitions from `--ds-gray-400` to `--ds-gray-500` with `-2px` translate and `--card-shadow-hover`.

---

## 4. Spacing & Layout

- **Page Container (`.container-page`)**: Max-width `1280px`, centered, responsive gutters (`16px` mobile, `24px` tablet, `32px` desktop).
- **Control Radii**: `8px` (`Button`, `Input`, `Dropdown`, action pills), `12px` (`CourseCard`, `VideoCard`, `Modal`, `Alert`), `16px` (section panels).
