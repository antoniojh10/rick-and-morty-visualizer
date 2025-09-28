import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";

function Wrapped() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
  });

  it("shows Light initially and toggles to Dark, updating html class and title", async () => {
    render(<Wrapped />);

    // Accessible name comes from aria-label, not inner text
    const btn = await screen.findByRole("button", { name: /Toggle theme/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/Light/i);
    expect(btn).toHaveAttribute("title", expect.stringMatching(/Switch to dark/i));
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Toggle theme/i })).toBeInTheDocument();
    });
    const btnDark = screen.getByRole("button", { name: /Toggle theme/i });
    expect(btnDark).toHaveTextContent(/Dark/i);
    expect(btnDark).toHaveAttribute("title", expect.stringMatching(/Switch to light/i));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
