
## Practical 4: Connecting TikTok Frontend to Backend

---

## Overview

This practical had me connecting the Next.js frontend I'd built previously to the Express.js backend, turning what was essentially a static UI into a real working application. By the end I had a fully functional TikTok clone where everything — login, registration, video uploads, likes, comments, following — actually works and saves to a real database. It was the first time I'd built something full-stack from scratch without following a step-by-step tutorial for the entire thing, and it felt genuinely satisfying to see it come together.

---

## What I Learned

### React Context for Global State

Before this practical I understood the concept of React Context but hadn't built one myself for a real use case. Setting up `authContext.jsx` to manage login state across the entire app was my first proper implementation of it.

The pattern I used — wrapping the whole app in an `AuthProvider`, storing the user object and token in both state and localStorage, and exposing `login`, `logout`, and `register` functions through a custom `useAuth()` hook — is a clean and reusable pattern I'll definitely use again. The key insight was that Context solves the problem of needing the same data in completely unrelated parts of the component tree without passing props through every level in between.

### Axios Interceptors

I'd used Axios for simple API calls before but never with interceptors. Setting up a request interceptor that automatically reads the JWT from localStorage and attaches it to every outgoing request as a `Bearer` token was one of those moments where something clicks and you realise how much boilerplate it eliminates. Without it, every single API call in every service file would need to manually read the token and set the header.

The response interceptor that automatically logs the user out when it receives a 401 was also useful — it means I don't have to handle token expiry in every individual API call, it's handled globally in one place.

### Intersection Observer API

I had never used the Intersection Observer API before this project. I used it to automatically play videos when they scroll into view and pause them when they scroll out. The concept is straightforward — you observe a DOM element and get a callback whenever its visibility changes — but the implementation in React with `useRef` and `useEffect` cleanup required some careful thinking.

The `threshold: 0.6` option means the callback fires when 60% of the element is visible. The cleanup function that disconnects the observer and pauses the video on unmount was important to add, otherwise videos would keep playing after navigating away from the feed.

### Browser Autoplay Policy

I didn't know about the browser autoplay policy before this practical and ran into it hard. Videos were playing silently and I spent time trying to figure out why my `muted={false}` wasn't working. After researching it, I understood — browsers block autoplay with sound unless the user has explicitly interacted with the page first. This is a security/UX policy that can't be bypassed in code.

The solution I implemented mirrors what TikTok actually does: start all videos muted, listen for the first user interaction (click, touch, or keypress) anywhere on the page, then unmute the currently visible video from that point forward. I used a `userInteracted` state in `VideoFeed` that gets passed down as a prop to each `VideoCard`, and each card checks it when deciding whether to unmute.

### Next.js App Router and Dynamic Routes

Working with the Next.js 15 App Router taught me things I hadn't encountered in older tutorials. The biggest one was that dynamic route `params` are now a Promise in Next.js 15+, so accessing `params.userId` directly throws a warning. I had to use `React.use(params)` to unwrap it first, which wasn't in the original guide and took some debugging to identify.

I also got more comfortable with the App Router file conventions — `layout.js` for shared layout, `page.jsx` for each route, and the `[userId]` folder naming for dynamic segments.

---

## Challenges I Faced

### Videos Playing Over Each Other

The first version of my video feed had all videos trying to play simultaneously as soon as the page loaded. The audio was completely chaotic — every video's sound playing at once. I fixed this by implementing the Intersection Observer on each `VideoCard` so only the video currently in view plays. When a video leaves the viewport it pauses, resets to the start, and mutes itself so there's no audio bleed into the next video.

### Follow State Not Persisting on Reload

When I first built the explore-users page, clicking Follow worked — it sent the request to the backend and the button changed. But when I refreshed the page, the button showed "Follow" again even for users I was already following. The follow state was only tracked locally in React state, which resets on every page load.

The fix was to load the current user's following list from the backend when the page mounts, and use that to pre-populate the `followStates` object before rendering. I added a `GET /api/users/:id/following` endpoint to the backend specifically for this, which returns the list of user IDs the person follows. Now the buttons show the correct state on every load.

### `params` Is a Promise in Next.js 15

The profile page was throwing this warning in the console:

```
A param property was accessed directly with `params.userId`. 
`params` is a Promise and must be unwrapped with React.use()
```

I was doing `params.userId` directly in the component, which worked in older Next.js but was deprecated in v15. The fix was importing `use` from React and doing `const { userId } = use(params)` at the top of the component. It's a small change but it was confusing to diagnose because the page still worked despite the warning.

### CORS When Accessing via Network IP

When I tried to open the app from my phone using the machine's network IP, the pages loaded but login and all API calls failed. The issue was that the frontend was configured to call `http://localhost:5000/api`, but on another device `localhost` refers to that device's own machine, which has no server running.

I fixed it by updating `.env.local` to use the actual network IP (`http://10.2.43.217:5000/api`) and making sure the backend's CORS config accepted requests from the network IP as well. I also had to add the IP to `allowedDevOrigins` in `next.config.mjs` to stop Next.js from blocking its own dev resources from that origin.

### Module Not Found Errors on First Run

When I first ran `npm run dev` on the frontend, I got a cascade of `Module not found: Can't resolve '@/components/ui/VideoFeed'` errors. The `@/` alias was configured correctly in `jsconfig.json`, but the actual files didn't exist yet — I hadn't created them. It sounds obvious in retrospect but when you're setting up a project with a lot of files the errors can look more mysterious than they are. I went through each missing file systematically and created them one by one.

---

## What I'd Do Differently

I'd create all the files and folder structure before running the dev server the first time, rather than running it after each file and fixing one error at a time. Having the full structure in place makes it much clearer what's missing.

I'd also test on a real mobile device or via network IP much earlier in development. The autoplay and CORS issues I hit were only visible in that context, and finding them late meant more back-tracking.

---

## What Went Well

The component architecture I ended up with is clean and well-separated. The `videoService.js` and `userService.js` files abstract all the API calls, the `authContext` handles all auth state, and the individual page components are mostly just layout and logic. This made it easy to fix bugs in one place without touching unrelated files.

The video feed also genuinely feels smooth. Auto-play on scroll, auto-pause when leaving view, the "tap for sound" hint that disappears after the first interaction — it behaves like a real social video app, not a demo.

---

## Conclusion

Connecting the frontend to a real backend changed how the whole project felt. Features that were previously fake — mocked data, hardcoded states — became real interactions with a real database. I learned a lot about patterns that are standard in production React apps: global state with Context, API abstraction with services, automatic auth headers with interceptors, and the browser autoplay policy that every video platform has to work around. The bugs I hit along the way — the follow state not persisting, params being a Promise, CORS on network access — were all genuinely educational to debug and fix.