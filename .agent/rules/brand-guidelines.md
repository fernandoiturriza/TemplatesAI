# Brand & Design Guidelines

**Project Name:** [Insert Project Name]
**Description:** This document serves as the absolute source of truth for the project's visual identity. The UI/UX Designer Agent MUST adhere to these guidelines for any UI component creation or modification.

## 1. Color Palette

*   **Primary Brand Color:** `#4F46E5` (Indigo 600) - Use for primary actions, active states, and dominant branding elements.
*   **Secondary/Accent Color:** `#10B981` (Emerald 500) - Use for success states, secondary highlights, or safe actions.
*   **Warning/Danger Color:** `#EF4444` (Red 500) - Use for critical alerts, destructive actions (e.g., delete buttons).
*   **Background Base:** `#FAFAFA` (Neutral 50) for Light Mode, `#171717` (Neutral 900) for Dark Mode.
*   **Surface/Card Base:** `#FFFFFF` for Light Mode, `#262626` (Neutral 800) for Dark Mode.
*   **Text Primary:** `#1F2937` (Gray 800) for Light Mode, `#F9FAFB` (Gray 50) for Dark Mode.

> **Instruction for Agent:** Always attempt to use Tailwind CSS utility equivalents of these hex codes (e.g., `text-indigo-600`, `bg-emerald-500`) unless a custom hex code is strictly required.

## 2. Typography

*   **Primary Font (Headings):** `Inter`, sans-serif. Used for all `h1` through `h6` tags. Appears bold and clean.
*   **Secondary Font (Body):** `Roboto` or `Inter`. Used for paragraphs, forms, and general text.
*   **Font Weights:** 
    *   Regular (400) for body text.
    *   Medium (500) for buttons and emphasis.
    *   Bold (700) for headers.

## 3. UI Geometry & Spacing

*   **Border Radius:** 
    *   Cards and Modals: Large radius (`rounded-xl` or `rounded-2xl`).
    *   Buttons and Inputs: Standard radius (`rounded-lg`).
    *   Do NOT use sharp corners (`rounded-none`) unless explicitly requested.
*   **Shadows / Elevation:**
    *   Cards: Use subtle, soft shadows (`shadow-sm` or `shadow-md`).
    *   Floating elements (Dropdowns, Modals): Use deeper shadows (`shadow-xl` or `shadow-2xl`).
*   **Glassmorphism (Optional but preferred):** Use `bg-white/70 backdrop-blur-md` for sticky headers or floating navbars.

## 4. Logo & Assets

*   **Main Logo Path:** `/public/assets/logo-main.svg`
*   **Favicon:** `/public/favicon.ico`
*   **Logo Usage:** Do not stretch or distort the logo. Always maintain aspect ratio via `object-contain`.

## 5. Animation Philosophy

*   Keep animations micro and subtle.
*   Hover effects: `-translate-y-1 shadow-md transition-all duration-300` on cards.
*   Buttons should have a slight `active:scale-95` effect.

---
**Agent Note:** If you are the `04-ui-ux-designer` agent reading this, acknowledge these colors and geometries in your code generation. Do not deviate from the Primary and Secondary colors unless instructed by the user.
