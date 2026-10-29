import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

const STORAGE_DARK = 'dark-mode';
const STORAGE_ULTRA = 'isUltraDarkThemeEnabled';

function readBool(key: string, fallback: boolean): boolean {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === 'true';
}

function applyDom(isDark: boolean, isUltra: boolean) {
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(isDark ? 'dark' : 'light');
  // Native scrollbars read color-scheme, not the body class.
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  if (isUltra) {
    document.documentElement.setAttribute('data-theme', 'ultra-dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const msg = document.getElementById('message');
  if (msg) {
    msg.classList.remove('dark', 'light');
    msg.classList.add(isDark ? 'dark' : 'light');
  }
}

// module load so the document is in the right theme before React mounts.
const initialDark = readBool(STORAGE_DARK, true);
const initialUltra = readBool(STORAGE_ULTRA, false);
applyDom(initialDark, initialUltra);

// Classic v2.x palette: navy surfaces, teal primary, rounded 1.5rem cards.
// v2 used #008771; one step darker clears WCAG 4.5:1 for white button text.
const V2_PRIMARY = '#00846e';
const BASE_TOKENS = {
  colorPrimary: V2_PRIMARY,
  colorInfo: V2_PRIMARY,
  colorLink: V2_PRIMARY,
  colorPrimaryHover: '#18947b',
  colorPrimaryActive: '#006655',
  colorPrimaryBorderHover: '#18947b',
  colorPrimaryTextHover: '#18947b',
  colorLinkHover: '#18947b',
  borderRadius: 8,
  lineHeight: 1.5,
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Vazirmatn', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};
const DARK_TOKENS = {
  ...BASE_TOKENS,
  colorBgBase: '#0a1222',
  colorBgLayout: '#0a1222',
  colorBgContainer: '#151f31',
  colorBgElevated: '#222d42',
  colorBorder: '#2c3950',
  colorBorderSecondary: 'rgba(65, 85, 119, 0.5)',
  colorText: 'rgba(255, 255, 255, 0.75)',
  colorTextHeading: 'rgba(255, 255, 255, 0.85)',
};
const ULTRA_DARK_TOKENS = {
  ...BASE_TOKENS,
  colorBgBase: '#21242a',
  colorBgLayout: '#21242a',
  colorBgContainer: '#0c0e12',
  colorBgElevated: '#222327',
  colorBorder: '#32353b',
  colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
  colorText: 'rgb(255 255 255 / 85%)',
};
const DARK_LAYOUT_TOKENS = {
  bodyBg: '#0a1222',
  headerBg: '#151f31',
  headerColor: '#ffffff',
  footerBg: '#0a1222',
  siderBg: '#151f31',
  triggerBg: '#151f31',
  triggerColor: 'rgba(255, 255, 255, 0.75)',
};
const ULTRA_DARK_LAYOUT_TOKENS = {
  bodyBg: '#21242a',
  headerBg: '#0c0e12',
  headerColor: '#ffffff',
  footerBg: '#21242a',
  siderBg: '#0c0e12',
  triggerBg: '#0c0e12',
  triggerColor: 'rgb(255 255 255 / 85%)',
};
const MENU_TOKENS = {
  itemBorderRadius: 8,
  itemSelectedBg: '#006655',
  itemSelectedColor: '#ffffff',
  itemHoverColor: '#008771',
  itemHoverBg: '#e8f4f2',
};
const DARK_MENU_TOKENS = {
  ...MENU_TOKENS,
  darkItemBg: '#151f31',
  darkSubMenuItemBg: '#151f31',
  darkPopupBg: '#222d42',
  darkItemSelectedBg: '#006655',
  darkItemHoverBg: 'rgba(0, 135, 113, 0.18)',
  darkItemColor: 'rgba(255, 255, 255, 0.75)',
};
const ULTRA_DARK_MENU_TOKENS = {
  ...MENU_TOKENS,
  darkItemBg: '#0c0e12',
  darkSubMenuItemBg: '#0c0e12',
  darkPopupBg: '#222327',
  darkItemSelectedBg: '#006655',
  darkItemHoverBg: 'rgba(0, 135, 113, 0.18)',
  darkItemColor: 'rgb(255 255 255 / 85%)',
};
const CARD_TOKENS = { borderRadiusLG: 24 };
const DARK_CARD_TOKENS = { ...CARD_TOKENS, colorBorderSecondary: '#0a1222' };
const ULTRA_DARK_CARD_TOKENS = {
  ...CARD_TOKENS,
  colorBorderSecondary: '#21242a',
};
const STATISTIC_TOKENS = {
  contentFontSize: 17,
  titleFontSize: 14,
};
const CONTROL_TOKENS = { borderRadius: 16 };
// antd 1.x button shadows, much softer than antd 6's tinted ones.
const BUTTON_TOKENS = {
  ...CONTROL_TOKENS,
  primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.043)',
  defaultShadow: '0 2px 0 rgba(0, 0, 0, 0.016)',
  dangerShadow: '0 2px 0 rgba(0, 0, 0, 0.043)',
};
const TABLE_TOKENS = { borderRadiusLG: 16, cellPaddingBlock: 10, cellPaddingInline: 8 };
const DARK_TABLE_TOKENS = {
  ...TABLE_TOKENS,
  headerBg: '#0a1222',
  rowHoverBg: 'rgba(44, 57, 80, 0.2)',
  rowSelectedBg: 'rgba(0, 135, 113, 0.14)',
  rowSelectedHoverBg: 'rgba(0, 135, 113, 0.22)',
  bodySortBg: 'rgba(0, 135, 113, 0.08)',
};
const ULTRA_DARK_TABLE_TOKENS = {
  ...TABLE_TOKENS,
  headerBg: '#21242a',
  rowHoverBg: 'rgba(89, 89, 89, 0.15)',
  rowSelectedBg: 'rgba(0, 135, 113, 0.2)',
  rowSelectedHoverBg: 'rgba(0, 135, 113, 0.3)',
  bodySortBg: 'rgba(0, 135, 113, 0.12)',
};
const LIGHT_TABLE_TOKENS = { ...TABLE_TOKENS, headerBg: '#f0f2f5', rowHoverBg: '#e8f4f2' };
const LIGHT_CONTRAST_TOKENS = {
  ...BASE_TOKENS,
  colorBgLayout: '#f0f2f5',
  colorText: 'rgba(0, 0, 0, 0.65)',
  colorTextDescription: 'rgba(0, 0, 0, 0.58)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.58)',
  colorTextPlaceholder: '#767676',
  colorError: '#cf1322',
  colorErrorText: '#cf1322',
  colorSuccessText: '#237804',
};
const SHARED_COMPONENTS = {
  Statistic: STATISTIC_TOKENS,
  Button: BUTTON_TOKENS,
  Input: CONTROL_TOKENS,
  InputNumber: CONTROL_TOKENS,
  Select: CONTROL_TOKENS,
  DatePicker: CONTROL_TOKENS,
  Tabs: {
    itemSelectedColor: V2_PRIMARY,
    inkBarColor: V2_PRIMARY,
    itemHoverColor: '#18947b',
    itemActiveColor: '#006655',
  },
  Collapse: { borderRadiusLG: 16 },
  Modal: { borderRadiusLG: 16 },
  Tag: { borderRadiusSM: 16 },
};

// hashed:false drops the `:where(.css-<hash>)` wrapper antd puts around every
// rule. It costs nothing in specificity — `:where()` contributes zero, so the
// panel's own `.ant-*` overrides still win — and it removes roughly 5,700
// wrappers, 16% of the generated stylesheet, from what the browser has to parse.
//
// cssVar.key pins the CSS-variable scope. Every panel page mounts its own
// ConfigProvider (there is no root one), and without a fixed key each mints a
// fresh useId-derived scope, so navigating re-serialises and re-injects the whole
// token block under a new class instead of reusing the one already in the head.
const SHARED_STYLE_CONFIG = {
  hashed: false,
  cssVar: { key: 'xui' },
} as const;

export function buildAntdThemeConfig(isDark: boolean, isUltra: boolean): ThemeConfig {
  if (!isDark) {
    return {
      ...SHARED_STYLE_CONFIG,
      algorithm: antdTheme.defaultAlgorithm,
      token: LIGHT_CONTRAST_TOKENS,
      components: {
        ...SHARED_COMPONENTS,
        Layout: {
          bodyBg: '#f0f2f5',
          siderBg: '#ffffff',
          triggerBg: '#ffffff',
          triggerColor: 'rgba(0, 0, 0, 0.65)',
        },
        Menu: MENU_TOKENS,
        Card: CARD_TOKENS,
        Table: LIGHT_TABLE_TOKENS,
      },
    };
  }
  return {
    ...SHARED_STYLE_CONFIG,
    algorithm: antdTheme.darkAlgorithm,
    token: isUltra ? ULTRA_DARK_TOKENS : DARK_TOKENS,
    components: {
      ...SHARED_COMPONENTS,
      Layout: isUltra ? ULTRA_DARK_LAYOUT_TOKENS : DARK_LAYOUT_TOKENS,
      Menu: isUltra ? ULTRA_DARK_MENU_TOKENS : DARK_MENU_TOKENS,
      Card: isUltra ? ULTRA_DARK_CARD_TOKENS : DARK_CARD_TOKENS,
      Table: isUltra ? ULTRA_DARK_TABLE_TOKENS : DARK_TABLE_TOKENS,
    },
  };
}

export function pauseAnimationsUntilLeave(elementId: string): void {
  document.documentElement.setAttribute('data-theme-animations', 'off');
  const el = document.getElementById(elementId);
  if (!el) return;
  const restore = () => {
    document.documentElement.removeAttribute('data-theme-animations');
    el.removeEventListener('mouseleave', restore);
    el.removeEventListener('touchend', restore);
  };
  el.addEventListener('mouseleave', restore);
  el.addEventListener('touchend', restore);
}

interface ThemeContextValue {
  isDark: boolean;
  isUltra: boolean;
  toggleTheme: () => void;
  toggleUltra: () => void;
  antdThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(initialDark);
  const [isUltra, setIsUltra] = useState<boolean>(initialUltra);

  useLayoutEffect(() => {
    applyDom(isDark, isUltra);
    localStorage.setItem(STORAGE_DARK, String(isDark));
    localStorage.setItem(STORAGE_ULTRA, String(isUltra));
  }, [isDark, isUltra]);

  const toggleTheme = useCallback(() => setIsDark((v) => !v), []);
  const toggleUltra = useCallback(() => setIsUltra((v) => !v), []);

  const antdThemeConfig = useMemo(() => buildAntdThemeConfig(isDark, isUltra), [isDark, isUltra]);

  const value = useMemo<ThemeContextValue>(
    () => ({ isDark, isUltra, toggleTheme, toggleUltra, antdThemeConfig }),
    [isDark, isUltra, toggleTheme, toggleUltra, antdThemeConfig],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
