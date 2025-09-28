import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CharacterFilters from "./CharacterFilters";

// Increase timeout for tests
const TEST_TIMEOUT = 10000; // 10 seconds

const mockOnChange = vi.fn();

describe("CharacterFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnChange.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });


  it("should call onChange immediately when input changes", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "a" } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      name: "a",
      status: "",
      sort: "none"
    });
  });

  it("should call onChange immediately with 2 characters", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "ri" } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      name: "ri",
      status: "",
      sort: "none"
    });
  });

  it("should call onChange immediately with 3 characters", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "ric" } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      name: "ric",
      status: "",
      sort: "none"
    });
  });

  it("should call onChange immediately with 4 characters", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "rick" } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      name: "rick",
      status: "",
      sort: "none"
    });
  });

  it("should call onChange immediately with 5 characters", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "ricks" } });
    
    expect(mockOnChange).toHaveBeenCalledWith({
      name: "ricks",
      status: "",
      sort: "none"
    });
  });

  it("should call onChange for each rapid change", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("Search by name...");
    
    // Simulate rapid typing - each change should trigger onChange immediately
    fireEvent.change(input, { target: { value: "r" } });
    fireEvent.change(input, { target: { value: "ri" } });
    fireEvent.change(input, { target: { value: "ric" } });
    fireEvent.change(input, { target: { value: "rick" } });
    
    // Should have been called 4 times (once for each change)
    expect(mockOnChange).toHaveBeenCalledTimes(4);
    expect(mockOnChange).toHaveBeenLastCalledWith({
      name: "rick",
      status: "",
      sort: "none"
    });
  });

  it("should include status and sort in the onChange call", () => {
    render(<CharacterFilters onChange={mockOnChange} />);
    
    // Set status
    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "Alive" } });
    
    // Set sort
    const sortSelect = screen.getByLabelText("Sort");
    fireEvent.change(sortSelect, { target: { value: "az" } });
    
    // Type in search
    const input = screen.getByPlaceholderText("Search by name...");
    fireEvent.change(input, { target: { value: "morty" } });
    
    // Should have been called 4 times (initial render + 3 field changes)
    expect(mockOnChange).toHaveBeenCalledTimes(4);
    expect(mockOnChange).toHaveBeenLastCalledWith({
      name: "morty",
      status: "Alive",
      sort: "az"
    });
  });
});

