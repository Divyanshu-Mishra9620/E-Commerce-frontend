export const THEME_STORAGE_KEY = "elysoria-theme";

export function getThemeInitScript() {
  return `(() => {
    try {
      const storageKey = "${THEME_STORAGE_KEY}";
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme =
        storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  })();`;
}
