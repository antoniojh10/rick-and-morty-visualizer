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

    const btn = await screen.findByRole("button", { name: /Light/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("title", expect.stringMatching(/Switch to dark/i));
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Dark/i })).toBeInTheDocument();
    });
    const btnDark = screen.getByRole("button", { name: /Dark/i });
    expect(btnDark).toHaveAttribute("title", expect.stringMatching(/Switch to light/i));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
