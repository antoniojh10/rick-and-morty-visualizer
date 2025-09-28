import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import Header from "@/components/layout/Header";

describe("Header", () => {
  it("does not render Home/My favorites links in desktop nav", () => {
    renderWithProviders(<Header />);
    expect(screen.queryByRole("link", { name: /home/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /my favorites/i })).not.toBeInTheDocument();
  });

  it("opens mobile menu via portal", () => {
    renderWithProviders(<Header />);
    const open = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(open);
    // Portal renders under body
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });
});
