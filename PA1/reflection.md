# Reflection — Practical Assignment 1: Amazon Home Page Recreation

## Introduction

For this assignment I chose to recreate **Amazon's home page**. The choice was deliberate — Amazon's homepage is one of the most information-dense, component-rich pages on the web. It has a complex multi-part navbar, a hero carousel, a category grid, a product deals section, and a detailed footer. Each of these is a clearly distinct, independently reusable UI unit, which made it an ideal candidate for demonstrating React's component-based architecture.

The final application runs at `http://10.2.42.80:3000` and visually recreates the page including Amazon's exact colour scheme, typography weight, and layout proportions.

---

## Planning Phase — Breaking the Page Apart

Before writing any code, I opened Amazon's actual homepage and used browser DevTools to study its structure. I inspected the DOM, noted which sections repeated (the deal cards, the category cards), and identified the natural component boundaries.

My component list after planning:

- `Navbar` — the full top bar with logo, location, search, account, cart
- `NavStrip` — the secondary dark navigation bar
- `Carousel` — the hero banner with slide state
- `CategoryGrid` + `CategoryCard` — the "Shop by Category" section
- `TodaysDeals` + `DealCard` — the deals product row
- `BackToTop` — the simple scroll bar
- `Footer` — the 4-column link section and copyright bar

Having this list before writing any JSX meant I never had a blank-page moment. I knew exactly what to build next at every stage.

---

## What Went Well

### The `DealCard` Component

`DealCard` was the most satisfying component to build. It accepts a `deal` object as a prop and renders the product image, title, star rating, sale price, original price, and Add to Cart button — everything self-contained. The star rating logic was a small but interesting challenge:

```jsx
{[1, 2, 3, 4, 5].map((star) => (
  <span key={star} style={{ color: star <= rating ? '#f0c040' : '#ccc' }}>★</span>
))}
```

Mapping over a fixed array of 1–5 and comparing each value to the `rating` prop produces the correct number of filled and empty stars without any external library.

### Matching Amazon's Visual Design

Getting the colours right made the biggest difference to how convincing the recreation looks. Amazon's brand colours are not generic — the exact yellow is `#febd69` (search bar, buttons), the top navbar is `#131921` (near-black), and the secondary nav is `#232f3e` (dark navy). Using DevTools' colour picker to extract these exact values and applying them consistently made the recreation look professional rather than approximate.

### Carousel with `useState` and `useEffect`

The hero carousel was the most technically complex component. It manages:
- `currentSlide` state (0, 1, or 2)
- Manual navigation via arrow buttons (`prevSlide`, `nextSlide` functions with wraparound)
- Clickable dot indicators that jump directly to a slide
- Auto-advance every 4 seconds using `setInterval` inside `useEffect`

The cleanup function in `useEffect` was essential:

```js
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);
  return () => clearInterval(timer); // cleanup prevents memory leak
}, []);
```

Without the cleanup, navigating away from the page (in a multi-page app) would leave the interval running, which is a memory leak. Learning this was one of the most practically useful moments of the assignment.

---

## Challenges Faced

### The Navbar Complexity

Amazon's navbar has more sub-parts than any other section: logo, location display, category dropdown, search input, search button, account dropdown, returns link, and cart with item count. Initially I put all of this in a single `Navbar.jsx` file, which grew to over 150 lines of JSX. It worked but was hard to read.

I refactored it by extracting the search bar into a `SearchBar.jsx` sub-component and the account/cart cluster into a `NavActions.jsx` sub-component. This brought each file back to a readable length and made the navbar much easier to modify.

The lesson: even within a single "component", if a section is large enough to be confusing, extract it further.

### Horizontal Scroll for Deal Cards

On tablet and mobile screen widths, the six deal cards don't fit in a single row. I needed horizontal scrolling. The CSS solution was:

```css
.deals-row {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  scroll-snap-type: x mandatory;
}

.deal-card {
  flex-shrink: 0;
  width: 230px;
  scroll-snap-align: start;
}
```

`scroll-snap-type` made the scrolling feel native and intentional rather than janky. This was a CSS feature I had not used before.

### Category Grid — 4-Column Responsive Layout

The "Shop by Category" section shows 4 columns on desktop (Electronics, Books, Fashion, Home & Kitchen on row 1; Sports, Toys, Beauty, Automotive on row 2). On mobile it collapses to 1 column. CSS Grid handled this cleanly:

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .category-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .category-grid { grid-template-columns: 1fr; }
}
```

The `1fr` unit distributes available space evenly regardless of viewport width, which is exactly the behaviour Amazon's grid exhibits.

### Footer Column Layout

The footer has 4 columns of links with bold headings. On desktop they sit side-by-side; on mobile they stack vertically. This was straightforward with Flexbox but required setting `flex: 1` on each column so they all share equal width on desktop.

---

## Mistakes Made and Lessons Learned

| Mistake | Lesson |
|---------|--------|
| Put all navbar logic into one file (150+ lines) | Extract sub-components as soon as a component becomes hard to read |
| Forgot `clearInterval` in carousel `useEffect` cleanup | Always return a cleanup function from `useEffect` when using timers or subscriptions |
| Used inline `style={{ color: '...' }}` everywhere | Define colour tokens in CSS variables or a theme file so they are consistent and easy to change |
| Hard-coded product data directly inside `TodaysDeals.jsx` | Always separate data from presentation — put data in a `data/` file from the start |
| Did not test on mobile until near the end | Test at all breakpoints from the first day using DevTools device emulation |

---

## What I Am Proud Of

The carousel feels the most polished. The smooth CSS transition between slides, the auto-advance, the dot indicators, and the arrow buttons all work together in a way that genuinely looks and feels like the real Amazon carousel. Building it from scratch with only `useState` and `useEffect` — no carousel library — gave me a real understanding of how sliders work under the hood.

The deal cards are also visually convincing. The combination of the red sale price, the grey struck-through original price, the yellow star rating, and the bold yellow "Add to Cart" button exactly matches Amazon's visual hierarchy for communicating value and urgency.

---

## What I Would Do Differently

- **Add a working cart.** The "Add to Cart" button currently has no behaviour beyond a hover effect. Using React Context or a simple `useState` array at the page level, I could track cart items and display a count badge on the navbar cart icon — making the prototype feel like a real application.
- **Use Next.js `<Image>` for all images.** I mixed `<img>` and `<Image>` during development. Next.js's `<Image>` provides lazy loading and automatic WebP conversion, which significantly improves page load performance. All images should use it consistently.
- **Add keyboard navigation to the carousel.** The current carousel only responds to mouse clicks. Adding `onKeyDown` handlers so left/right arrow keys control the slides would improve accessibility.
- **Extract colour tokens.** The Amazon brand colours (`#febd69`, `#131921`, `#232f3e`) are used in multiple components. Defining them once as CSS custom properties (`--amazon-yellow: #febd69`) and referencing them everywhere would make future colour changes a one-line edit.

---

## Key Takeaway

Recreating a real, familiar page was far more instructive than building something from scratch. Every design decision Amazon made — why the search bar is centred and full-width, why deal prices are red, why the category grid uses 4 columns — becomes visible and understandable when you have to implement it yourself. This assignment taught me not just how to write React components, but how to read a UI critically and translate what I observe into structured, maintainable code.