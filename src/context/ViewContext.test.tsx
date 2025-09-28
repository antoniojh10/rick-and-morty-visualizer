import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewProvider, useView } from './ViewContext';

// Test component that uses the ViewContext
function TestComponent() {
  const { viewMode, setViewMode, toggleView } = useView();

  return (
    <div>
      <span data-testid="view-mode">{viewMode}</span>
      <button onClick={() => setViewMode('table')}>Set Table</button>
      <button onClick={() => setViewMode('grid')}>Set Grid</button>
      <button onClick={toggleView}>Toggle</button>
    </div>
  );
}

describe('ViewContext', () => {
  it('provides default grid view mode', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>
    );

    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  it('allows setting view mode to table', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>
    );

    fireEvent.click(screen.getByText('Set Table'));
    expect(screen.getByTestId('view-mode')).toHaveTextContent('table');
  });

  it('allows setting view mode to grid', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>
    );

    // First set to table
    fireEvent.click(screen.getByText('Set Table'));
    expect(screen.getByTestId('view-mode')).toHaveTextContent('table');

    // Then set back to grid
    fireEvent.click(screen.getByText('Set Grid'));
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  it('toggles between grid and table views', () => {
    render(
      <ViewProvider>
        <TestComponent />
      </ViewProvider>
    );

    // Start with grid
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');

    // Toggle to table
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('view-mode')).toHaveTextContent('table');

    // Toggle back to grid
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useView must be used within a ViewProvider');

    console.error = originalError;
  });
});
