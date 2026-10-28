export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

// Writes the pointer position onto the element so `.spotlight` can paint its glow.
export function trackSpotlight(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  element.style.setProperty("--my", `${event.clientY - rect.top}px`);
}
