import '@testing-library/jest-dom';

// Mock matchMedia for ThemeProvider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-color-scheme: dark') ? false : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock crypto.randomUUID for NotificationContext
if (!('crypto' in globalThis)) {
  // @ts-expect-error - define crypto if missing
  globalThis.crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  // @ts-expect-error - polyfill
  globalThis.crypto.randomUUID = () => 'test-uuid-' + Math.random().toString(16).slice(2);
}
