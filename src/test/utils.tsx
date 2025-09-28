import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SelectionProvider } from '@/context/SelectionContext';
import { ViewProvider } from '@/context/ViewContext';

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Parameters<typeof render>[1]
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <ThemeProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <SelectionProvider>
              <ViewProvider>{children}</ViewProvider>
            </SelectionProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </ThemeProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
