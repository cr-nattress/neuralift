# Story 06-005: Optimize Responsive Design

## Story

**As a** mobile user
**I want** a great experience on my phone
**So that** I can train anywhere

## Points: 5

## Priority: High

## Status: TODO

## Description

Optimize all pages for mobile, tablet, and desktop with touch-friendly controls and appropriate layouts.

## Acceptance Criteria

- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Touch targets 44x44px minimum
- [ ] Popovers become bottom sheets on mobile
- [ ] Grid scales appropriately
- [ ] Response buttons stack on mobile

## Breakpoints

```css
xs: 475px   /* Small phones */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

## Tasks

- [ ] Audit all pages on mobile simulator
- [ ] Fix grid sizing on small screens
- [ ] Stack response buttons on mobile
- [ ] Convert popovers to bottom sheets
- [ ] Increase touch targets
- [ ] Test on real devices
- [ ] Fix any overflow issues

## Dependencies

- All pages built (Epic 04)
