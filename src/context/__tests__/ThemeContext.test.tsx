import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function Consumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

function setup() {
  window.localStorage.clear();
  document.documentElement.className = "";
}

describe("ThemeProvider", () => {
  beforeEach(() => setup());

  it("initializes from OS preference or light by default and applies html class", async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    // After effect run, expect light theme by default (per setup matchMedia mock)
    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  it("toggles theme and persists, updating html class", async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    const btn = await screen.findByText("toggle");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  it("loads saved theme from localStorage on mount", async () => {
    window.localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
