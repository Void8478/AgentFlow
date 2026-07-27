# AgentFlow Design System & Semantic Token Specification

> **Design Philosophy**: Fusion of **Apple** (translucent glassmorphism, spring motion, refined detail), **Linear** (high-density dark mode, crisp 1px borders, keybinding focus), **Raycast** (vibrant command palette glows, rapid feedback, crisp badges), **Vercel** (monochrome technical precision, typography grid), and **Mission Control** (spatial telemetry, visual flow canvas depth, pulse indicators).

---

## 1. Visual Theme & Atmosphere

AgentFlow is an ultra-modern, production-grade AI orchestration control center. The environment feels high-tech, deeply responsive, and engineered for high computational clarity.

- **Mood**: Obsidian depth, crisp metallic borders, vibrant neon status indicators, translucent frosted glass layers (`backdrop-filter: blur(16px)`).
- **Density**: High information density without visual noise. Micro-typography paired with precise grid alignments.
- **Lighting**: Subtle ambient radial glows originating from active agent nodes and running flow edges against an obsidian `#07080a` canvas.

---

## 2. Color Palette & Functional Roles

### **Base Canvas & Surface System (Obsidian & Glass)**
- `canvas-base` (`#07080a`): Primary background canvas; deep pitch obsidian.
- `surface-panel` (`rgba(15, 17, 23, 0.75)`): Translucent glass surface for cards, sidebars, and modals.
- `surface-panel-hover` (`rgba(24, 27, 36, 0.85)`): Interactive hover state for panels and node cards.
- `surface-overlay` (`rgba(6, 7, 9, 0.90)`): Modal backdrop and command palette background.

### **Borders & Micro-Dividers**
- `border-subtle` (`rgba(255, 255, 255, 0.08)`): Standard 1px panel and divider border.
- `border-interactive` (`rgba(255, 255, 255, 0.18)`): Border state on element focus/hover.
- `border-active` (`#6366f1`): Active node, selected item, or execution focus border.

### **Text & Foreground Hierarchy**
- `text-primary` (`#f8fafc`): Primary headers, node titles, high-priority labels.
- `text-secondary` (`#94a3b8`): Secondary body text, descriptions, node subtitles.
- `text-muted` (`#64748b`): Metadata, timestamps, inactive icons, shortcut hints.
- `text-inverse` (`#07080a`): Text on bright action buttons.

### **Status & Telemetry Accents**
- `accent-brand` (`#6366f1`): Primary brand color (Indigo Glow).
- `status-idle` (`#64748b`): Ready/Unstarted node status (Cool Slate).
- `status-running` (`#f59e0b`): Executing node status (Amber Glow & Pulse).
- `status-success` (`#10b981`): Completed step status (Emerald Cyan).
- `status-error` (`#f43f5e`): Failed node/exception status (Rose Red).
- `status-router` (`#ec4899`): Branch router status (Hot Pink).
- `status-input` (`#8b5cf6`): Workflow entry trigger status (Electric Violet).

---

## 3. Typography Rules

Font Stack: **Geist / Inter** for UI elements, paired with **Geist Mono / Fira Code** for prompts, code, logs, and telemetry.

| Scale | Size / Line Height | Weight | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Display Header** | `24px` / `32px` | Semibold (`600`) | `-0.02em` | Studio Workspace Header & Modal Titles |
| **Section Title** | `16px` / `24px` | Semibold (`600`) | `-0.01em` | Panel titles, Node headers |
| **Body Standard** | `14px` / `20px` | Regular (`400`) | `0em` | Inspector labels, description text |
| **Body Small** | `12px` / `16px` | Medium (`500`) | `0em` | Badge text, input field labels |
| **Micro Caption** | `11px` / `14px` | Medium (`500`) | `0.01em` | Status indicators, timestamps |
| **Code / Telemetry** | `11px` / `16px` | Regular (`400`) | font-mono | System prompts, logs, model names, IDs |

---

## 4. Depth, Elevation & Glows

- **Level 0 (Canvas)**: Flat `#07080a` with SVG grid pattern (`gap: 24px`, dot size `1.5px`).
- **Level 1 (Panels & Sidebar)**: Translucent glass (`rgba(15, 17, 23, 0.75)` + `backdrop-filter: blur(16px)` + border `1px solid rgba(255, 255, 255, 0.08)`).
- **Level 2 (Nodes & Floating Toolbars)**: Elevated cards with subtle drop shadow (`0 8px 32px 0 rgba(0, 0, 0, 0.37)`).
- **Level 3 (Modals & Command Palette)**: Deep drop shadow (`0 20px 50px rgba(0, 0, 0, 0.75)` + indigo ambient glow).

---

## 5. Geometry & Radii Tokens

- **Radius XS (`4px`)**: Badges, keybinding shortcut boxes (`kbd`), inline code chips.
- **Radius SM (`8px`)**: Input fields, buttons, dropdown item triggers.
- **Radius MD (`12px`)**: Node cards, sidebar items, alert boxes.
- **Radius LG (`16px`)**: Floating studio inspector panels, log console drawers.
- **Radius Full (`9999px`)**: Status dots, avatar badges, pill toggles.

---

## 6. Motion & Spring Guidelines

Follow Apple & Raycast spring physics for smooth, non-disruptive feedback.

- **Hover Transition**: `150ms cubic-bezier(0.16, 1, 0.3, 1)`
- **Node Selection Spring**: `250ms cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Modal / Command Palette Entry**: `200ms cubic-bezier(0.16, 1, 0.3, 1)` scale `0.98 -> 1.0`
- **Execution Pulse**: Keyframe animation looping `2000ms infinite ease-in-out` opacity `0.4 -> 1.0`.

---

## 7. Layout Grid & Spacing System

Based on a **4px Base Unit Grid**:

- **Space 1 (`4px`)**: Micro inline gaps (icon-to-label).
- **Space 2 (`8px`)**: Compact item padding, badge margins.
- **Space 3 (`12px`)**: Standard input padding, list item gaps.
- **Space 4 (`16px`)**: Card interior padding, panel header spacing.
- **Space 6 (`24px`)**: Section margins, workspace gutter spacing.
- **Space 8 (`32px`)**: Major container breaks.

---

## 8. Iconography Rules

- **Library**: `lucide-react`.
- **Stroke Width**: `1.75px` default (never bolded past 2px to maintain technical accuracy).
- **Sizing**:
  - `14px` (`w-3.5 h-3.5`): Micro badges, inline triggers, button icons.
  - `16px` (`w-4 h-4`): Panel headers, sidebar navigation, form field leading icons.
  - `20px` (`w-5 h-5`): Empty state illustrations, modal header icons.

---

## 9. Component Guidelines

### **Buttons**
- **Primary**: Solid Indigo (`bg-indigo-600`), white text, subtle hover glow, active scale `0.97`.
- **Secondary / Glass**: Translucent background (`bg-white/5`), border `1px solid rgba(255, 255, 255, 0.1)`, hover `bg-white/10`.
- **Danger**: Translucent rose (`bg-rose-500/10`), rose border (`border-rose-500/30`), text `text-rose-400`.

### **Cards / Canvas Nodes**
- Min-width: `240px`.
- Translucent backdrop with top handle connection indicators.
- Status border highlight reflecting execution runtime state.

### **Form Inputs**
- Dark background (`bg-black/40`), 1px subtle border (`border-white/10`).
- On Focus: Border turns `border-indigo-500` with ring glow `0 0 0 2px rgba(99, 102, 241, 0.25)`.
