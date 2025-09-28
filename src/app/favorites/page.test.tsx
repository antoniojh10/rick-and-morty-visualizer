import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import FavoritesPage from "@/app/favorites/page";
import * as FavoritesContext from "@/context/FavoritesContext";
import type { FavoriteItem } from "@/context/FavoritesContext";

// Mock the FavoritesContext
vi.mock("@/context/FavoritesContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/FavoritesContext")>();
  return {
    ...actual,
    useFavorites: vi.fn(),
  };
});

// Type for the mock implementation
const mockUseFavorites = vi.mocked(FavoritesContext.useFavorites);

const mockFavorite: FavoriteItem = {
  id: 1,
  name: "Rick Sanchez",
  image: "rick.png"
};

describe("Favorites page", () => {
  const clearMock = vi.fn();
  const removeMock = vi.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("renders favorites and shows clear button when there are favorites", () => {
    // Setup mock return value
    mockUseFavorites.mockReturnValue({
      favorites: {
        [mockFavorite.id]: mockFavorite
      },
      add: vi.fn(),
      addMany: vi.fn(),
      remove: removeMock,
      clear: clearMock,
      isFavorite: vi.fn().mockReturnValue(true)
    });

    renderWithProviders(<FavoritesPage />);

    // Should show the favorite
    expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    // Should show clear button
    const clearButton = screen.getByRole("button", { name: /clear all/i });
    expect(clearButton).toBeInTheDocument();

    // Test clear functionality
    fireEvent.click(clearButton);
    expect(clearMock).toHaveBeenCalled();
  });

  it("shows empty state when there are no favorites", () => {
    // Setup mock return value for empty favorites
    mockUseFavorites.mockReturnValue({
      favorites: {},
      add: vi.fn(),
      addMany: vi.fn(),
      remove: removeMock,
      clear: clearMock,
      isFavorite: vi.fn().mockReturnValue(false)
    });

    renderWithProviders(<FavoritesPage />);

    // Should show empty state
    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
    // Should not show clear button
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
  });

  it("allows removing individual favorites", () => {
    mockUseFavorites.mockReturnValue({
      favorites: {
        [mockFavorite.id]: mockFavorite
      },
      add: vi.fn(),
      addMany: vi.fn(),
      remove: removeMock,
      clear: clearMock,
      isFavorite: vi.fn().mockReturnValue(true)
    });

    renderWithProviders(<FavoritesPage />);

    // Find and click the remove button
    const removeButton = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(removeMock).toHaveBeenCalledWith(mockFavorite.id);
  });
});
