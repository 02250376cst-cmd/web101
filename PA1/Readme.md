# Amazon Home Page — WEB101 PA1 # git link https://github.com/02250376cst-cmd/web101
# Practical Assignment 1 — Amazon Home Page Recreation (React/Next.js)

## Overview

This project is a **React-based recreation of Amazon's home page** built with Next.js. It replicates the visual layout, component structure, and core interactive behaviours of Amazon's homepage — including the navigation bar, hero banner carousel, shop-by-category grid, today's deals product cards, and multi-column footer — using locally sourced mock data instead of a live API.

The application is accessible at `http://10.2.42.80:3000` during development.

---

## Functionality

The application implements the following features:

| Feature | Description |
|---------|-------------|
| **Navbar** | Amazon logo, "Deliver to Bhutan" location display, category dropdown + search bar + search button, Hello/Sign In account link, Returns & Orders link, Cart icon with label |
| **Navigation Strip** | Secondary nav bar with links: All, Today's Deals, Customer Service, Registry, Gift Cards, Sell, Electronics, Fashion, Books |
| **Hero Carousel** | Full-width banner slider with 3 slides (e.g. "Big Spring Sale"), left/right arrow navigation, and dot indicators showing current slide |
| **Shop by Category** | 4-column grid of category cards, each with a background image, category name (e.g. Electronics, Books, Fashion, Home & Kitchen, Sports, Toys, Beauty, Automotive), and a "Shop now →" link |
| **Today's Deals** | Horizontal scrollable row of product deal cards — each with product image, title, star rating (filled/empty stars), sale price in red, original price struck through, and a yellow "Add to Cart" button |
| **Back to Top Bar** | Dark bar with centred "Back to top" text that scrolls the user to the top of the page |
| **Footer** | 4-column footer with sections: Get to Know Us, Make Money with Us, Amazon Payment Products, Let Us Help You — plus a copyright bar ("© 2026 Amazon") |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** (App Router) | React framework — file-based routing, dev server, image optimisation |
| **React 18** | Component rendering, `useState` for carousel and cart state, `useEffect` for auto-slide |
| **CSS Modules / Tailwind CSS** | Component-scoped styling and responsive layout |
| **Mock Data (local JS file)** | Product deals, category cards, carousel slides — no external API |

> `create-react-app` is deprecated and was **not used**. See: https://react.dev/blog/2025/02/14/sunsetting-create-react-app

---

## Project Structure

```
stdno_WEB101_PA1/

│   ├── app/
│   │   ├── page.jsx                  # Root page — composes all sections in order
│   │   ├── layout.jsx                # Global layout (metadata, body wrapper)
│   │   └── globals.css               # Global base styles (resets, fonts, colours)
│   ├── components/
│   │   ├── CategoryGrid.jsx 
│   │   │             
│   │   ├── DealSection.jsx 
│   │   │          
│   │   ├── Footer.jsx
│   │   │          
│   │   ├── HeroBanner.jsx
│   │   │       
│   │   ├── Navbar.jsx  
│   │   │   
│   │   ├── ProductCard.jsx
│   │        
│   │          
│   └── data/                         
│       ├── categories.js             # Shop by Category array
│       └── product.js         
├── public/
│   └── images/                       # Product and category images
├── next.config.js
├── package.json
└── README.md
```

---

## Component Architecture

```
<RootPage>                         ← app/page.jsx
  ├── <Navbar />                   ← logo · location · search · account · cart
  ├── <NavStrip />                 ← All · Today's Deals · Electronics · Fashion…
  ├── <Carousel />                 ← 3-slide hero banner with arrows + dots
  ├── <CategoryGrid>               ← "Shop by Category" heading + 4-col grid
  │     └── <CategoryCard /> ×8   ← Electronics, Books, Fashion, Home & Kitchen…
  ├── <TodaysDeals>                ← "Today's Deals" heading + "See all deals →"
  │     └── <DealCard /> ×6       ← Wireless Earbuds, Phone Stand, USB-C Hub…
  ├── <BackToTop />                ← dark bar · "Back to top"
  └── <Footer />                   ← 4 columns of links + copyright bar
```

---

## Reusable Components

### `DealCard`
The primary reusable component. Rendered once per deal item from `data/deals.js`.

**Props:**
```js
{
  image: string,       // path to product image
  title: string,       // e.g. "Wireless Earbuds Pro"
  rating: number,      // e.g. 4 (out of 5 — renders filled/empty stars)
  salePrice: string,   // e.g. "$29.99" (displayed in red)
  originalPrice: string, // e.g. "$59.99" (displayed struck through)
}
```

**Features:**
- Star rating rendered by mapping 1–5, filling stars up to `rating` value
- Sale price styled in red, original price in grey with `text-decoration: line-through`
- Yellow "Add to Cart" button with hover state

---

### `CategoryCard`
Rendered once per category from `data/categories.js`.

**Props:**
```js
{
  image: string,   // category background/hero image
  name: string,    // e.g. "Electronics"
  href: string,    // link target for "Shop now →"
}
```

---

### `Carousel`
Self-contained banner slider.

**State:**
- `currentSlide` — index of the currently visible slide (0, 1, or 2)
- Auto-advances every 4 seconds via `setInterval` in `useEffect`
- Left/right arrow buttons call `prevSlide()` / `nextSlide()`
- Dot indicators reflect `currentSlide` and are clickable

---

## Mock Data

All data is sourced locally — no external API calls are made.

```js
// src/data/deals.js
export const deals = [
  { id: 1, image: "/images/earbuds.jpg",   title: "Wireless Earbuds Pro",   rating: 4, salePrice: "$29.99", originalPrice: "$59.99" },
  { id: 2, image: "/images/stand.jpg",     title: "Phone Stand Adjustable", rating: 5, salePrice: "$12.99", originalPrice: "$24.99" },
  { id: 3, image: "/images/hub.jpg",       title: "USB-C Hub 7-in-1",       rating: 3, salePrice: "$34.99", originalPrice: "$49.99" },
  { id: 4, image: "/images/sleeve.jpg",    title: "Laptop Sleeve 15\"",     rating: 2, salePrice: "$19.99", originalPrice: "$35.99" },
  { id: 5, image: "/images/keyboard.jpg",  title: "Mechanical Keyboard",    rating: 5, salePrice: "$79.99", originalPrice: "$120.00" },
  { id: 6, image: "/images/webcam.jpg",    title: "HD Webcam 1080p",        rating: 4, salePrice: "$44.99", originalPrice: "$70.00" },
];

// src/data/categories.js
export const categories = [
  { id: 1, image: "/images/cat-electronics.jpg", name: "Electronics",    href: "#" },
  { id: 2, image: "/images/cat-books.jpg",        name: "Books",          href: "#" },
  { id: 3, image: "/images/cat-fashion.jpg",      name: "Fashion",        href: "#" },
  { id: 4, image: "/images/cat-home.jpg",         name: "Home & Kitchen", href: "#" },
  { id: 5, image: "/images/cat-sports.jpg",       name: "Sports",         href: "#" },
  { id: 6, image: "/images/cat-toys.jpg",         name: "Toys",           href: "#" },
  { id: 7, image: "/images/cat-beauty.jpg",       name: "Beauty",         href: "#" },
  { id: 8, image: "/images/cat-auto.jpg",         name: "Automotive",     href: "#" },
];

// src/data/carouselSlides.js
export const slides = [
  { id: 1, title: "Big Spring Sale", subtitle: "Save on thousands of items", cta: "Shop now", bg: "#d4e8f8" },
  { id: 2, title: "New Arrivals",    subtitle: "Fresh picks every week",      cta: "Shop now", bg: "#fde8c8" },
  { id: 3, title: "Deal of the Day", subtitle: "Limited time offers",         cta: "Shop now", bg: "#d8f0e0" },
];
```

---

## Responsive Design

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | `< 640px` | Single column; navbar collapses; category grid 1-col; deals scroll horizontally |
| Tablet | `640px – 1023px` | 2-column category grid; deals row with partial card overflow scroll |
| Desktop | `≥ 1024px` | Full layout matching screenshots: 4-col category grid, 6-card deals row |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/stdno_WEB101_PA1.git
cd stdno_WEB101_PA1

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---
