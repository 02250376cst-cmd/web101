# Reflection — Practical 5: Implementing Infinite Scroll with TanStack Query

## Overview

This practical had me replacing the TikTok clone's single-fetch video loading with infinite scroll using TanStack Query and cursor-based pagination. The original feed loaded every video in the database in one request, which worked fine with 50 test videos but would completely fall apart with a real application. By the end of this practical, the feed loads 5 videos at a time and fetches the next batch automatically as the user scrolls — the same way the actual TikTok app works.

---

## What I Learned

### Cursor-Based Pagination vs Offset Pagination

I'd heard of pagination before but always thought of it in terms of page numbers — "page 1", "page 2", "page 3". That's offset-based pagination and it's the simpler of the two approaches. But going through the theory made the problem with it clear: if someone posts a new video while you're scrolling through the feed, all the offsets shift and you either see a duplicate or skip a video entirely. For a live social media feed where content is constantly being added, this is a real problem.

Cursor-based pagination solves it by anchoring each request to a specific video ID rather than a numeric position. "Give me 5 videos after ID 46" always returns the same result regardless of what else has been added to the database. Understanding why this matters — not just how to implement it — made the extra complexity feel justified.

### The n+1 Pattern

The way the backend determines whether there are more pages was something I found genuinely clever. Instead of running a separate `COUNT(*)` query to know the total number of records (which gets expensive on large tables), the backend just requests one more item than it needs. If it gets back 6 items when it asked for 5, it knows there are more. The extra item gets stripped before sending the response, but its presence was enough information to set `hasNextPage: true`. It's an efficient trick that I'll definitely use again.

### TanStack Query and useInfiniteQuery

This was my first time using TanStack Query properly. I'd seen it mentioned in tutorials before but always skipped it and just used `useEffect` with `fetch`. After using `useInfiniteQuery` for this practical, I understand why people reach for it.

Without TanStack Query I would have had to manually track the current cursor in state, manage separate loading states for the initial fetch and each subsequent page fetch, handle errors at each stage, implement my own caching so switching between the For You and Following feeds didn't re-fetch unnecessarily, and figure out how to append new pages to the existing list. That's a lot of code that's easy to get wrong. `useInfiniteQuery` handles all of it, and the `getNextPageParam` function is a clean way to tell it how to get the next cursor from each page's response.

The data structure it returns — `data.pages` as an array of page responses — was unfamiliar at first. I had to use `flatMap` to turn it into a single flat array of videos for rendering. Once I understood that structure it made sense, but it was confusing for a few minutes.

### Intersection Observer for Triggering Loads

I had used the Intersection Observer API in the previous practical for auto-playing videos, so the concept wasn't new. But using it to trigger data fetching rather than media playback was a different application of the same idea. The `rootMargin: '200px'` setting was the most important detail — it starts loading the next page 200 pixels before the user actually reaches the bottom, so by the time they scroll there, the next videos are already loaded. Without that margin, there would be a noticeable pause every time the user hit the bottom and had to wait for the fetch.

---

## Challenges I Faced

### Only 5 Videos Loading — Sentinel Not Firing

After implementing everything, the feed loaded the first 5 videos but then nothing happened when I scrolled to the bottom. The Intersection Observer wasn't detecting the sentinel element at the bottom of the feed.

The issue was that the sentinel div was too small and the observer threshold was set too high. I fixed it by giving the sentinel `minHeight: '80px'` so it was physically tall enough to be detected, changing the threshold from `0.6` to `0`, and adding `rootMargin: '200px'` so it fires before the user fully reaches the bottom. Adding a `console.log` inside the observer callback was how I confirmed it was now firing correctly.

### The Explore Page Breaking

After updating the API to return the paginated format `{ videos, nextCursor, hasNextPage }` instead of a plain array, the Explore page completely broke with the error `videos.filter is not a function`. The Explore page was calling `.filter()` directly on the API response, which used to be an array but was now an object.

The fix was to loop through all pages using the cursor until `hasNextPage` was false, collect all videos into one flat array, and then apply the filter. It also highlighted an interesting design tension — the Explore page needs all videos at once for search to work, while the feed only wants a few at a time. Both use the same paginated endpoint but consume it differently.

### QueryClientProvider Requiring 'use client'

When I added `QueryClientProvider` to `layout.js`, I got an error because `useState` (used to create the QueryClient) can't be used in a Server Component. Adding `'use client'` to the top of `layout.js` fixed it, but it also meant the `export const metadata` object no longer worked since metadata exports are only valid in Server Components. I had to remove the metadata export from the layout file to get it to work.

### Response Format Change Breaking Other Parts

Changing the API response from a plain array to a paginated object broke more things than just the Explore page. Any place in the codebase that was calling `videoService.getAllVideos()` and expecting an array needed to be updated. It was a good reminder that changing an API contract has ripple effects throughout the frontend, and in a real project this kind of change would need to be coordinated carefully or done with a versioned endpoint.

---

## What I'd Do Differently

I'd add the `console.log` debugging line to the Intersection Observer from the very beginning rather than only adding it when things weren't working. It takes two seconds to add and immediately tells you whether the observer is firing at all, which is the first thing you need to know when debugging infinite scroll.

I'd also update the Explore page and any other consumers of the video API at the same time as changing the response format, rather than discovering them one by one when they break.

---

## What Went Well

Once everything was wired up correctly, the infinite scroll genuinely felt smooth. Scrolling through the feed and having videos appear continuously without any visible loading pause was satisfying — especially because I understood every piece of the mechanism that was making it work. The TanStack Query devtools panel was also really useful during development, showing exactly which queries were active, what data they had cached, and when they were being refetched.

The architecture also ended up clean. The `useInfiniteQuery` hook handles all the pagination state, the Intersection Observer handles the trigger, and the VideoCard components don't know or care that they're part of an infinite scroll — they just render a video. That separation of concerns made the whole thing easier to reason about.

---

## Conclusion

This practical gave me a solid understanding of how infinite scroll actually works at a technical level, not just from a user experience perspective. Cursor-based pagination, TanStack Query's `useInfiniteQuery`, and the Intersection Observer API are all patterns used in production React applications, and building them from scratch in a real project made them feel genuinely learnable rather than intimidating. The bugs I hit along the way — the sentinel not firing, the Explore page breaking, the layout metadata conflict — were all useful in their own way and I'd be much faster implementing this pattern a second time.