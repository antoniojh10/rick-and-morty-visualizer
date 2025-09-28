import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ScrollToTop } from './ScrollToTop';

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('ScrollToTop', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('scroll', vi.fn());
  });

  it('does not render when showInInfiniteMode is false', () => {
    render(<ScrollToTop showInInfiniteMode={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render when scroll position is below threshold', () => {
    render(<ScrollToTop showInInfiniteMode={true} threshold={300} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders when scroll position is above threshold', () => {
    render(<ScrollToTop showInInfiniteMode={true} threshold={300} />);

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      writable: true,
    });

    // Trigger scroll event
    fireEvent.scroll(window);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('calls scrollTo when button is clicked', () => {
    render(<ScrollToTop showInInfiniteMode={true} threshold={300} />);

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      writable: true,
    });

    // Trigger scroll event
    fireEvent.scroll(window);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('uses custom threshold', () => {
    render(<ScrollToTop showInInfiniteMode={true} threshold={500} />);

    // Simulate scroll below custom threshold
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      writable: true,
    });

    fireEvent.scroll(window);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    // Simulate scroll above custom threshold
    Object.defineProperty(window, 'scrollY', {
      value: 600,
      writable: true,
    });

    fireEvent.scroll(window);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
