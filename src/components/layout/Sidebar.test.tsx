import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import Sidebar from "@/components/layout/Sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Sidebar", () => {
  it("renders Home and My favorites links", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my favorites/i })).toBeInTheDocument();
  });
});
