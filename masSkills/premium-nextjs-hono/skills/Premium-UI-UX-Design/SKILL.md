---
name: Premium-UI-UX-Design
description: Enforces industry-leading visual standards, focusing on micro-animations, consistent design tokens, and highly polished UI components using Tailwind CSS and Framer Motion.
---

# Premium-UI-UX-Design

This Super-Skill separates "functional" apps from "breathtaking" apps. It dictates the rules for making the interface feel premium, snappy, and deeply satisfying to use.

## 1. The "Card-Pastel" / Glassmorphism Aesthetic

**Rules:**
*   Avoid stark, pure white (`bg-white`) against generic gray backgrounds. Use subtle, deeply integrated background colors.
*   Embrace large, consistent border radii (`rounded-2xl` or `rounded-3xl` for main cards, `rounded-xl` for inner elements).
*   Add soft, multi-layered shadows (`shadow-sm`, `shadow-md` tinted with the primary layout color) instead of harsh black drop-shadows.

## 2. Micro-Animations

**Rules:**
*   **EVERY** interactive element must have a hover/focus state.
*   Use Tailwind transitions (`transition-all duration-200 ease-in-out`) on buttons, links, and cards.
*   When rendering lists or modals, use `Framer Motion` (if available) or Tailwind keyframes to fade them in smoothly (`opacity-0 animate-fade-in`).

## 3. Typography and Spacing

**Rules:**
*   Never use standard system fonts if a premium font (Inter, Roboto, Outfit) is available.
*   Use strict tracking (`tracking-tight` for headings, normal for body).
*   Give components room to breathe. Lean heavily into `gap-6`, `p-8`, and avoid cramped, dense data displays unless building an intense data grid.

## Expected Output

An application that looks and feels like it was designed by a top-tier design agency, invoking trust and delight from the user.
