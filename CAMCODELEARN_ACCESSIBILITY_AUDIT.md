# CamcodeLearn — Accessibility Audit (WCAG 2.1 AA)

**Project:** `edustream-public-web` (CamcodeLearn Public Web)  
**Scope:** Keyboard Navigation, Focus Management, Semantic HTML, Color Contrast, Reduced Motion, Multilingual Typography (`en` / `km`)

---

## 1. Keyboard Navigation & Focus Management

| Component | Audit Finding & Implementation | Status |
| :--- | :--- | :--- |
| **`Modal.tsx`** | Implements `role="dialog"`, `aria-modal="true"`, `Escape` key dismissal, `Tab`/`Shift+Tab` focus trap, and focus restoration to the previously active element on close. | Verified |
| **`SearchPanel.tsx`** | Implements `role="dialog"`, `aria-modal="true"`, `Escape` handling, `Tab`/`Shift+Tab` focus trap, and focus restoration when closed. | Verified |
| **`PublicHeader.tsx` Mobile Drawer** | Implements `Tab`/`Shift+Tab` focus trap within the open drawer, `Escape` dismissal, and focus restoration to the menu trigger button. | Verified |
| **`Dropdown.tsx`** | Implements `role="listbox"` / `role="option"`, `aria-selected`, `aria-disabled`, `ArrowUp`/`ArrowDown`/`Home`/`End`/`Enter`/`Escape` keyboard navigation, and Geist focus-visible rings (`#0070F3` / `#3291FF`). | Verified |

---

## 2. Visual Contrast & Geist Surface Tokens

- **Light Mode:** Primary text `#171717` on `#FFFFFF` / `#FAFAFA` exceeds 15:1 contrast; secondary text `#666666` on `#FFFFFF` exceeds 5.7:1 contrast (AA compliant).
- **Dark Mode:** Primary text `#EDEDED` on `#000000` / `#0A0A0A` exceeds 16:1 contrast; secondary text `#888888` on `#0A0A0A` exceeds 5.5:1 contrast (AA compliant).
- **Focus Indicators:** Interactive inputs, selects, buttons, and dropdown triggers use `focus-visible:ring-2` with `#0070F3` (light) / `#3291FF` (dark).
- **Borders:** `1px` hairlines (`#EAEAEA` light / `#262626` dark) clearly separate surfaces without heavy drop shadows.

---

## 3. Multilingual & Motion Considerations

- **Khmer (`lang="km"`) Support:** `html[lang="km"]` in `src/index.css` preserves `'Khmer OS Siemreap'` font family and readable line height while `html[lang="en"]` uses `'Geist'` and `'Geist Mono'`.
- **Numeric Readability:** Prices, lesson counts, durations, and filter badges use `font-mono-custom tabular-nums` to prevent layout shift and improve scanability.
- **Reduced Motion:** `DitherField` and hover transitions remain subtle; no auto-playing jarring animations block content readability.
