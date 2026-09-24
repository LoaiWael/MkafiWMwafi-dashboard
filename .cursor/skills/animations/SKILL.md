---
name: animations
description: Comprehensive guide and patterns for UI animations, viewport scroll reveals, stagger effects, continuous floating/wiggle effects, and Motion wrappers with RTL compatibility in this Vite + React SPA.
---

# UI Animations & Motion Skill

This skill provides step-by-step instructions, architectural patterns, and recipes for implementing performant, accessible animations and micro-interactions using `motion/react` and shared animation primitives.

Related skills (load when relevant):
- `create-ui-section-or-page` — page layout, `page-shell`, tooltips, and i18n copy
- `create-loading-skeletons` — pixel-perfect skeletons during loading states

---

## Core Architectural Principles

1. **Keep animation at the edges**:
   - Route pages stay thin. Do **not** wrap an entire page in `motion` just to reveal one heading.
   - Import pre-built wrappers from `@/components/animations` (e.g. `<FadeIn>`, `<StaggerContainer>`, `<StaggerItem>`, `<ScaleIn>`) and wrap only the inner animated elements.

2. **RTL & Directional Awareness**:
   - For horizontal motion (`direction="left"` or `direction="right"` in `FadeIn`), keep RTL layout in mind.
   - Respect visual flow: items entering from the start of reading flow should match Arabic RTL expectations.

3. **Performance & Viewport Triggers**:
   - Viewport animations default to `once: true` and `margin: "-40px"` to prevent repeatedly re-triggering while scrolling.
   - Use GPU-accelerated CSS properties (`transform`, `opacity`, `scale`). Avoid animating `height`, `width`, `margin`, or `top` unless strictly necessary.

4. **Subtle & Premium Aesthetics**:
   - Use customized spring/cubic-bezier easing (e.g. `ease: [0.21, 0.47, 0.32, 0.98]` or `[0.16, 1, 0.3, 1]`).
   - Durations: `0.3s`–`0.6s` for UI reveals, `1.2s`–`3.5s` for gentle ambient float.
   - Avoid excessive bouncing or aggressive delays.

There is no RSC boundary in this app. Do not add `'use client'` to animation files.

---

## Available Animation Primitives (`@/components/animations`)

```tsx
import {
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  StaggerListItem,
  AnimatedProgressBar,
  Float,
  ScaleBackground,
  Wiggle,
} from "@/components/animations"
```

### 1. `FadeIn` (Viewport Reveal)
Animate elements when they scroll into view with directional translation and opacity.

**Props**:
- `direction`: `"up"` | `"down"` | `"left"` | `"right"` | `"none"` (default: `"up"`)
- `delay`: seconds to wait before animating (default: `0`)
- `duration`: duration in seconds (default: `0.5`)
- `distance`: translation distance in pixels (default: `24`)
- `once`: trigger only once on viewport entry (default: `true`)
- `className`: additional Tailwind classes

**Usage**:
```tsx
<FadeIn direction="up" delay={0.1}>
  <h2 className="text-3xl font-bold text-foreground">{title}</h2>
  <p className="mt-2 text-muted-foreground">{description}</p>
</FadeIn>
```

### 2. `ScaleIn` (Badge & Card Reveal)
Smooth scale-up entrance for focal elements, stats, badges, and modals.

**Props**:
- `initialScale`: starting scale factor (default: `0.88`)
- `delay`: delay in seconds (default: `0`)
- `duration`: duration in seconds (default: `0.5`)
- `once`: trigger once (default: `true`)

**Usage**:
```tsx
<ScaleIn delay={0.2} initialScale={0.9}>
  <div className="rounded-2xl border bg-card p-6 shadow-sm">
    <Badge variant="secondary">مميز</Badge>
  </div>
</ScaleIn>
```

### 3. `StaggerContainer`, `StaggerItem` & `StaggerListItem`
Orchestrate sequential entrance animations for grids, lists, feature cards, and button groups.

**Props (`StaggerContainer`)**:
- `staggerDelay`: interval between each child animation (default: `0.1`s)
- `delayChildren`: initial delay before starting the sequence (default: `0`s)
- `once`: trigger once on scroll (default: `true`)

**Usage**:
```tsx
<StaggerContainer
  staggerDelay={0.12}
  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
>
  {cards.map((card) => (
    <StaggerItem key={card.id}>
      <CardComponent data={card} />
    </StaggerItem>
  ))}
</StaggerContainer>
```

For lists:
```tsx
<StaggerContainer as="ul" className="space-y-3">
  {features.map((feature, idx) => (
    <StaggerListItem key={idx} className="flex items-center gap-2">
      <CheckCircle className="size-5 text-primary" />
      <span>{feature}</span>
    </StaggerListItem>
  ))}
</StaggerContainer>
```

### 4. `Float` (Ambient / Continuous Float)
Gentle infinite levitation for floating icons or decorative cards.

**Props**:
- `distance`: vertical travel distance (default: `8`px)
- `duration`: full cycle duration (default: `3.5`s)
- `delay`: start delay (default: `0`)

**Usage**:
```tsx
<Float distance={10} duration={4}>
  <div className="size-16 rounded-2xl bg-primary/10 p-4 text-primary">
    <ShieldCheck className="size-full" />
  </div>
</Float>
```

### 5. `ScaleBackground` (Hero / Banner Reveal)
Smooth scale-down and opacity reveal for full-bleed media backgrounds.

**Props**:
- `initialScale`: starting scale (default: `1.15`)
- `targetScale`: final scale (default: `1`)
- `duration`: duration in seconds (default: `1.6`)

**Usage**:
```tsx
<div className="relative h-96 w-full overflow-hidden">
  <ScaleBackground>
    <img src="/hero-bg.jpg" alt="" className="size-full object-cover" />
  </ScaleBackground>
  <div className="relative z-10 page-shell">
    {/* Foreground content */}
  </div>
</div>
```

### 6. `AnimatedProgressBar` (Scroll/In-View Progress)
Animates a progress bar from 0 to the target percentage when scrolled into view.

**Props**:
- `progress`: target percentage (0 to 100)
- `duration`: duration (default: `1.2`s)
- `delay`: delay (default: `0.2`s)
- `barClassName`: styling for the inner fill bar

**Usage**:
```tsx
<AnimatedProgressBar
  progress={85}
  className="h-2 w-full"
  barClassName="bg-primary"
/>
```

### 7. `Wiggle` (Playful Micro-Interactions)
Rotating wiggle for attention-grabbing icons or badges.

**Props**:
- `delay`: delay before starting (default: `0.5`s)
- `duration`: duration of the wiggle (default: `1.4`s)

**Usage**:
```tsx
<span className="flex items-center gap-2 text-base font-medium">
  <span>مرحباً بكم</span>
  <Wiggle>👋</Wiggle>
</span>
```

---

## Interactive Micro-Interactions

For interactive buttons, cards, and list items, use inline `motion` props:

### Hover & Tap Feedback
```tsx
import { motion } from "motion/react"

export default function InteractiveCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {children}
    </motion.div>
  )
}
```

---

## Animation Checklist

- [ ] Only inner wrappers or widgets are animated — not the whole route page.
- [ ] Viewport animations have `once: true` unless dynamic re-animation is required.
- [ ] Stagger delays stay in `0.08s`–`0.15s`.
- [ ] Directional slide-ins adhere to RTL layout expectations.
- [ ] Hardware-accelerated properties (`opacity`, `transform`) are used instead of layout-triggering properties.
- [ ] No `'use client'` directives.
