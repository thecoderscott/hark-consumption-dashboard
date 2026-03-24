import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Assumes the Next.js dev server is already running on :3000.
    // Run `npm run dev` before `npm run cypress:run`.
    baseUrl: "http://localhost:3000",
    supportFile: false,
  },
});
