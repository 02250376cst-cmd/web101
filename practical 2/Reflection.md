# Reflection — Weather API Dashboard: RESTful API Operations

## Introduction

This practical was different from the previous two in an important way: instead of building an API, I was **consuming** one. The shift from server-side to client-side API usage required a different mental model — thinking about authentication keys, CORS, asynchronous data fetching, and how to keep the UI responsive while waiting for network responses.

---

## What I Set Out to Do

The goal was to demonstrate all four HTTP methods (GET, POST, PUT, DELETE) in a single browser-based application using two real public APIs. I chose the OpenWeatherMap API for GET requests (because it returns interesting, real data) and JSONPlaceholder for the write operations (because it accepts and simulates PUT/DELETE without needing authentication beyond a user ID).

---

## What I Learned

### The `fetch` API and Async/Await

Every API call in this project uses the browser's `fetch()` function with `async/await`. Before this lab, I had used `fetch` for basic GET requests, but this was my first time using it for POST, PUT, and DELETE with custom headers and JSON bodies.

The pattern for a POST request was more involved than I expected:

```js
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

The `Content-Type` header tells the server that the body is JSON. Without it, the server may reject the request or misparse the body. This is a small detail that caused a real bug early on — my POST requests were silently failing because I forgot the header.

### `response.ok` vs `response.status`

I learned that `fetch()` does **not** throw an error for HTTP error responses (4xx, 5xx). It only rejects the promise for network failures (no internet, DNS failure). This means you must always check `response.ok` (which is `true` for 200–299 status codes) and throw manually:

```js
if (!response.ok) {
  throw new Error(data.message || 'Request failed');
}
```

Missing this check meant my app was silently accepting 404 responses from the weather API as successful — a subtle but serious bug.

### API Key Security

The OpenWeatherMap API key is embedded directly in the JavaScript file. This is fine for a local development project, but it is a significant security problem in production — anyone who views the page source can steal the key. In a real application, the key would be stored in a server-side environment variable and all API requests would go through a backend proxy that injects the key server-side.

### Local State Management Without a Framework

Without React or any other state management library, I managed application state in a plain JavaScript array (`savedLocations[]`). Every time the array changed (add, update, delete), I called `renderSavedLocations()` to re-render the entire list. This is a simplified version of what React does automatically with `useState` — and it made me appreciate why React's declarative rendering model is so powerful for anything beyond a simple project.

### `encodeURIComponent` for Query Parameters

City names with spaces (e.g., "New York") would break the URL if not encoded. `encodeURIComponent("New York")` produces `"New%20York"`, which is safe to embed in a URL query string. Forgetting this caused a broken request for multi-word city names.

---

## Challenges Faced

### JSONPlaceholder Does Not Actually Persist Data

JSONPlaceholder is a fake API — it accepts POST, PUT, and DELETE requests and returns success responses, but the data is never actually stored on the server. This means that every time the page reloads, the saved locations are re-fetched from JSONPlaceholder's default data, and any changes made during the session are lost.

I worked around this by maintaining a local `savedLocations` array that tracks all changes made during the session. This is a common pattern when a real backend is not available.

### The Edit Modal

Building a modal dialog without a UI library required inline styles for positioning (`position: fixed`, `z-index`, `background-color: rgba(...)`) and careful DOM manipulation to show/hide it. Pre-filling the modal with the existing location data required fetching the record from the local array by ID and setting each form field's `value` property manually.

### CORS

During early testing, I tried to fetch the weather data directly from the browser and hit a CORS error when my API key was invalid. The error message was confusing — it mentioned CORS but the real problem was a 401 Unauthorized response. This was a good reminder that CORS error messages in the browser can mask the underlying HTTP error.

---

## Mistakes Made and Lessons Learned

| Mistake | Lesson |
|---------|--------|
| Forgot `Content-Type: application/json` header on POST | Always set the content type header when sending a JSON body |
| Did not check `response.ok` after `fetch()` | `fetch()` does not throw on 4xx/5xx — always check `response.ok` |
| Embedded API key in client-side JavaScript | API keys must be kept server-side in production; use environment variables |
| Used `alert()` for error display | Replace `alert()` with inline UI error messages for better UX |

---

## What I Would Do Differently

- **Use a backend proxy for the API key.** Build a small Express endpoint that holds the API key and proxies weather requests. The frontend calls my own backend, not OpenWeatherMap directly.
- **Add loading state indicators.** While waiting for `fetch()` to resolve, show a spinner or disable the button. The current implementation shows "Loading..." text but does not disable the button, allowing duplicate requests.
- **Use `localStorage` for persistence.** Since JSONPlaceholder does not persist data, I could use `localStorage` to save the `savedLocations` array across page reloads.
- **Use a proper modal library.** The hand-coded modal works but lacks accessibility features (focus trap, ESC key close, ARIA attributes). A library like `dialog` (native HTML) would be more robust.

---

## Key Takeaway

This practical gave me hands-on experience with the complete HTTP request/response cycle from the client side. Understanding that `fetch()` does not throw on error responses, that API keys must be protected, and that local state must be carefully managed when using fake APIs are all real-world skills that apply immediately to frontend development. Consuming an API is just as nuanced as building one.