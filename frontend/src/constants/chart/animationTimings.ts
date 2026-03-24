// Use `as const` so IDE context is aware of keys
// without needing to provide explicit typings.
// Ensures that the object is deeply readonly.
// Relies on inference of types.
export const animationTimings = {
  chart: 1000,
  consumption: 1200,
  temperature: 1200,
} as const;
