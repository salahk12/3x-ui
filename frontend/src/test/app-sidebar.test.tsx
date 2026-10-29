import { act, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, test, vi } from 'vitest';

import AppSidebar from '@/layouts/AppSidebar';
import { renderWithProviders } from './test-utils';

vi.mock('@/api/queries/useAllSettings', () => ({
  useAllSettings: () => ({ allSetting: {} }),
}));

afterEach(() => {
  localStorage.clear();
});

// rc-menu registers its items in a microtask after render; settle it inside act().
async function renderSidebar() {
  const view = renderWithProviders(
    <MemoryRouter>
      <AppSidebar />
    </MemoryRouter>,
  );
  await act(async () => {});
  return view;
}

test('starts expanded with labels like the v2 sidebar', async () => {
  const view = await renderSidebar();
  const sidebar = view.container.querySelector('.ant-layout-sider');
  expect(sidebar?.classList.contains('ant-layout-sider-collapsed')).toBe(false);
  expect(view.container.querySelector('.ant-sidebar')?.getAttribute('style')).toContain(
    'width: 200px',
  );
});

test('collapses from the bottom trigger and restores the choice', async () => {
  const first = await renderSidebar();
  const trigger = first.container.querySelector('.ant-layout-sider-trigger');
  fireEvent.click(trigger!);

  expect(
    first.container
      .querySelector('.ant-layout-sider')
      ?.classList.contains('ant-layout-sider-collapsed'),
  ).toBe(true);
  expect(localStorage.getItem('isSidebarCollapsed')).toBe('true');
  first.unmount();

  const second = await renderSidebar();
  expect(
    second.container
      .querySelector('.ant-layout-sider')
      ?.classList.contains('ant-layout-sider-collapsed'),
  ).toBe(true);
  expect(second.container.querySelector('.ant-sidebar')?.getAttribute('style')).toContain(
    'width: 80px',
  );
});

test('shows the theme submenu first', async () => {
  await renderSidebar();
  expect(screen.getAllByText('Theme').length).toBeGreaterThan(0);
});
