# Reflection — Practical 3: File Upload Implementation (Frontend)

## Introduction

This practical introduced one of the more complex frontend patterns in web development: file uploads. Unlike submitting a simple JSON form, file uploads involve `multipart/form-data` encoding, binary data transfer, progress tracking, and client-side validation — all of which required learning new APIs and libraries.

---

## Understanding Multipart Form Data

The first and most important conceptual shift was understanding **why** file uploads use `multipart/form-data` instead of `application/json`. JSON can only represent text — it cannot encode binary file data. `multipart/form-data` divides the HTTP request body into multiple parts, each with its own `Content-Type`, allowing both text fields and binary data to travel in the same request.

The browser's `FormData` object handles this automatically:

```js
const formData = new FormData();
formData.append('file', data.file[0]);  // binary file part
formData.append('name', data.name);     // text part
```

When `FormData` is passed to `axios.post()`, Axios automatically sets the correct `Content-Type: multipart/form-data` header with the boundary string. I initially set the header manually, which caused Multer on the backend to fail — Axios must generate the boundary automatically.

---

## What I Learned

### `react-dropzone`

`react-dropzone` provides the drag-and-drop behaviour by exposing `getRootProps()` and `getInputProps()` — helper functions that inject the correct event handlers and attributes into the dropzone `<div>` and hidden `<input>`. The `onDrop` callback receives an array of accepted files, already filtered by the `accept` and `maxSize` options.

The distinction between `acceptedFiles` and `fileRejections` in the `onDrop` callback was important: rejected files (wrong type or too large) end up in `fileRejections`, not `acceptedFiles`. I used this to show appropriate error messages without needing a manual validation step.

### `URL.createObjectURL()` for Image Previews

To show a preview of a selected image before uploading, I used `URL.createObjectURL(file)`. This creates a temporary local URL pointing to the file in memory — the image is never sent to a server just to generate a preview. This is efficient and fast.

For PDFs, `createObjectURL()` would generate a URL to render the PDF in an `<iframe>`, but showing a full PDF preview was excessive for this use case. Instead, I stored only the filename and displayed a PDF icon — a better UX decision.

### `axios` vs `fetch` for Progress Tracking

The native `fetch()` API does not expose upload progress. Axios provides an `onUploadProgress` callback that receives a `ProgressEvent` with `loaded` and `total` properties, making it the right choice for this feature:

```js
onUploadProgress: (progressEvent) => {
  const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  setUploadProgress(percentage);
}
```

This drives a progress bar component that updates in real time as chunks of the file are transmitted.

### `react-hook-form` with File Inputs

React Hook Form works seamlessly with text inputs via `register()`, but file inputs are trickier because `react-dropzone` manages the file selection, not the native `<input>`. I had to manually integrate the two: dropzone captures the file, and I passed it into React Hook Form's form data via `setValue()`.

---

## Challenges Faced

### CORS Between Frontend and Backend

The Next.js frontend runs on port 3000 and the Express backend on port 8000. Without CORS configuration on the backend, the browser blocks requests from 3000 to 8000. I had to ensure the Express server had `cors({ origin: 'http://localhost:3000' })` configured before the upload endpoint would work.

The error message in the browser was misleading — it said "CORS error" but the actual fix was on the Express server, not in the React code.

### Progress Bar Jumps to 100% for Small Files

For small test files (under ~50KB), the upload completes so fast that the progress bar jumps directly from 0 to 100 without intermediate values. This is expected behaviour but initially looked like a bug. For real applications with large files, the progress updates smoothly.

### Handling the `isUploading` State

I initially forgot to set `isUploading(false)` in the `catch` block, which meant the form stayed disabled indefinitely after a failed upload. Moving the reset to a `finally` block ensured it always runs regardless of success or failure.

### PDF Type Differentiation in Preview

The `filePreview` state needed to handle three cases: image files (show `<img>`), PDFs (show icon + filename), and unsupported types (show nothing). The conditional rendering logic grew complex quickly. In a larger project, I would extract this into a dedicated `FilePreview` component.

---

## Mistakes Made and Lessons Learned

| Mistake | Lesson |
|---------|--------|
| Manually set `Content-Type: multipart/form-data` header | Let Axios set this automatically — it must include the boundary string |
| Forgot `finally` block → form stuck in uploading state after error | Always use `finally` to reset UI state after async operations |
| Did not handle `fileRejections` from `useDropzone` | Check both `acceptedFiles` and `fileRejections` to give accurate user feedback |
| Called `URL.createObjectURL()` for PDFs | Only use `createObjectURL()` for images; show icon + filename for PDFs |

---

## What I Would Do Differently

- **Show rejection error messages.** When `react-dropzone` rejects a file (wrong type or too large), the current UI silently ignores it. I would display a message like "File must be JPEG, PNG, or PDF under 5MB."
- **Revoke object URLs on cleanup.** `URL.createObjectURL()` allocates memory. I would call `URL.revokeObjectURL(previewUrl)` in the `useEffect` cleanup function when the component unmounts.
- **Extract `FilePreview` as a component.** The preview rendering logic inside `index.js` is long and has three branches. A dedicated `<FilePreview file={filePreview} />` component would be cleaner.
- **Add a cancel upload feature.** Axios supports cancellation via `CancelToken` (or the newer `AbortController`). For large file uploads, a cancel button is important UX.

---

## Key Takeaway

File uploads sit at the intersection of several browser APIs (`FormData`, `URL.createObjectURL`, `ProgressEvent`), third-party libraries (`react-dropzone`, `axios`), and backend concerns (CORS, Multer, file storage). Getting all these pieces to work together required understanding each layer independently before connecting them. This practical was the most "full-stack" frontend exercise so far — it is impossible to implement correctly without understanding what the server expects to receive.