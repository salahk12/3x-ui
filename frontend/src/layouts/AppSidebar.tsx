import { useCallback, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Checkbox, Drawer, Layout, Menu, Switch } from 'antd';
import type { MenuProps } from 'antd';
import {
  ApartmentOutlined,
  BulbFilled,
  BulbOutlined,
  CloseOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  CodeOutlined,
  DatabaseOutlined,
  DiscordOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuOutlined,
  SafetyOutlined,
  SettingOutlined,
  TelegramFilled,
} from '@ant-design/icons';

import { HttpUtil } from '@/utils';
import { pauseAnimationsUntilLeave, useTheme } from '@/hooks/useTheme';
import { useAllSettings } from '@/api/queries/useAllSettings';
import { PANEL_ROUTES } from '@/routes/panelRoutes';
import './AppSidebar.css';

const LOGOUT_KEY = '__logout__';
const THEME_KEY = '__theme__';
const THEME_DARK_KEY = '__theme_dark__';
const THEME_ULTRA_KEY = '__theme_ultra__';
const SIDER_WIDTH = 200;
const COLLAPSED_WIDTH = 80;
// Same storage key the v2.x panel used, so a returning operator keeps their choice.
const SIDEBAR_COLLAPSED_KEY = 'isSidebarCollapsed';

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  } catch {}
}

export default function AppSidebar() {
  const { t } = useTranslation();
  const { isDark, isUltra, toggleTheme, toggleUltra } = useTheme();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const { allSetting } = useAllSettings();
  const showSubFormats = !!(allSetting.subJsonEnable || allSetting.subClashEnable);
  const showSubBalancers = !!allSetting.subJsonEnable;

  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onCollapse = useCallback((value: boolean) => {
    saveCollapsed(value);
    setCollapsed(value);
  }, []);

  const currentTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  const onToggleDark = useCallback(
    (id: string) => {
      pauseAnimationsUntilLeave(id);
      if (isDark && isUltra) toggleUltra();
      toggleTheme();
    },
    [isDark, isUltra, toggleTheme, toggleUltra],
  );

  const onToggleUltra = useCallback(
    (id: string) => {
      pauseAnimationsUntilLeave(id);
      toggleUltra();
    },
    [toggleUltra],
  );

  const themeItem = useCallback(
    (idSuffix: string): NonNullable<MenuProps['items']>[number] => {
      const darkId = `change-theme${idSuffix}`;
      const ultraId = `change-theme-ultra${idSuffix}`;
      const children: NonNullable<MenuProps['items']> = [
        {
          key: THEME_DARK_KEY,
          className: 'ant-menu-theme-switch',
          label: (
            <span id={darkId} className="theme-switch-row">
              <span>{t('menu.dark')}</span>
              <Switch size="small" checked={isDark} aria-label={t('menu.dark')} />
            </span>
          ),
        },
      ];
      if (isDark) {
        children.push({
          key: THEME_ULTRA_KEY,
          className: 'ant-menu-theme-switch',
          label: (
            <span id={ultraId} className="theme-switch-row">
              <span>{t('menu.ultraDark')}</span>
              <Checkbox checked={isUltra} aria-label={t('menu.ultraDark')} />
            </span>
          ),
        });
      }
      return {
        key: THEME_KEY,
        icon: isDark ? <BulbFilled aria-hidden /> : <BulbOutlined aria-hidden />,
        label: t('menu.theme'),
        children,
      };
    },
    [t, isDark, isUltra],
  );

  const settingsChildren = useMemo<NonNullable<MenuProps['items']>>(() => {
    const children: NonNullable<MenuProps['items']> = [
      {
        key: '/settings#general',
        icon: <SettingOutlined aria-hidden />,
        label: t('pages.settings.panelSettings'),
      },
      {
        key: '/settings#security',
        icon: <SafetyOutlined aria-hidden />,
        label: t('pages.settings.securitySettings'),
      },
      {
        key: '/settings#telegram',
        icon: <TelegramFilled aria-hidden />,
        label: t('pages.settings.TGBotSettings'),
      },
      {
        key: '/settings#email',
        icon: <MailOutlined aria-hidden />,
        label: t('pages.settings.emailSettings'),
      },
      {
        key: '/settings#discord',
        icon: <DiscordOutlined aria-hidden />,
        label: t('pages.settings.discordSettings'),
      },
      {
        key: '/settings#subscription',
        icon: <CloudServerOutlined aria-hidden />,
        label: t('pages.settings.subSettings'),
      },
    ];
    if (showSubFormats) {
      children.push({
        key: '/settings#subscription-formats',
        icon: <CodeOutlined aria-hidden />,
        label: t('menu.subFormats'),
      });
    }
    if (showSubBalancers) {
      children.push({
        key: '/settings#subscription-balancers',
        icon: <ApartmentOutlined aria-hidden />,
        label: t('pages.settings.subBalancers.menu'),
      });
    }
    return children;
  }, [t, showSubFormats, showSubBalancers]);

  const xrayChildren = useMemo<NonNullable<MenuProps['items']>>(
    () => [
      {
        key: '/xray#basic',
        icon: <SettingOutlined aria-hidden />,
        label: t('pages.xray.basicTemplate'),
      },
      {
        key: '/xray#balancer',
        icon: <ClusterOutlined aria-hidden />,
        label: t('pages.xray.Balancers'),
      },
      {
        key: '/xray#dns',
        icon: <DatabaseOutlined aria-hidden />,
        label: 'DNS',
      },
      {
        key: '/xray#advanced',
        icon: <CodeOutlined aria-hidden />,
        label: t('pages.xray.advancedTemplate'),
      },
    ],
    [t],
  );

  const navItems = useMemo<NonNullable<MenuProps['items']>>(() => {
    const item = (
      key: string,
      Icon: ComponentType,
      label: ReactNode,
      children?: MenuProps['items'],
    ) =>
      children
        ? { key, icon: <Icon aria-hidden />, label, children }
        : { key, icon: <Icon aria-hidden />, label };
    return [
      ...PANEL_ROUTES.map((route) =>
        item(
          route.path,
          route.icon,
          t(route.titleKey),
          route.path === '/settings'
            ? settingsChildren
            : route.path === '/xray'
              ? xrayChildren
              : undefined,
        ),
      ),
      item(LOGOUT_KEY, LogoutOutlined, t('logout')),
    ];
  }, [t, settingsChildren, xrayChildren]);

  const settingsActive = pathname === '/settings';
  const xrayActive = pathname === '/xray';
  const selectedKey = settingsActive
    ? `/settings${hash || '#general'}`
    : xrayActive
      ? `/xray${hash || '#basic'}`
      : pathname === ''
        ? '/'
        : pathname;

  const openSubmenu = settingsActive ? '/settings' : xrayActive ? '/xray' : null;
  const [openKeys, setOpenKeys] = useState<string[]>(() => (openSubmenu ? [openSubmenu] : []));
  if (openSubmenu && !openKeys.includes(openSubmenu)) {
    setOpenKeys([...openKeys, openSubmenu]);
  }

  const onMenuClick = useCallback(
    async (key: string, idSuffix: string) => {
      if (key === THEME_DARK_KEY) {
        onToggleDark(`change-theme${idSuffix}`);
        return false;
      }
      if (key === THEME_ULTRA_KEY) {
        onToggleUltra(`change-theme-ultra${idSuffix}`);
        return false;
      }
      if (key === LOGOUT_KEY) {
        await HttpUtil.post('/logout');
        window.location.href = window.X_UI_BASE_PATH || '/';
        return true;
      }
      navigate(key);
      return true;
    },
    [navigate, onToggleDark, onToggleUltra],
  );

  const siderItems = useMemo(() => [themeItem(''), ...navItems], [themeItem, navItems]);
  const drawerItems = useMemo(() => [themeItem('-drawer'), ...navItems], [themeItem, navItems]);

  return (
    <div className="ant-sidebar" style={{ width: collapsed ? COLLAPSED_WIDTH : SIDER_WIDTH }}>
      <Layout.Sider
        theme={currentTheme}
        width={SIDER_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <Menu
          theme={currentTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={collapsed ? undefined : openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          className="sider-nav"
          items={siderItems}
          onClick={({ key }) => {
            void onMenuClick(String(key), '');
          }}
        />
      </Layout.Sider>

      <Drawer
        placement="left"
        closable={false}
        open={drawerOpen}
        rootClassName={currentTheme}
        size="min(82vw, 280px)"
        styles={{
          wrapper: { padding: 0 },
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
          header: { display: 'none' },
        }}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="drawer-header">
          <span className="drawer-brand">3X-UI</span>
          <button
            className="drawer-close"
            type="button"
            aria-label={t('close')}
            onClick={() => setDrawerOpen(false)}
          >
            <CloseOutlined aria-hidden />
          </button>
        </div>
        <Menu
          theme={currentTheme}
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          className="drawer-menu"
          items={drawerItems}
          onClick={({ key }) => {
            void onMenuClick(String(key), '-drawer').then((navigated) => {
              if (navigated) setDrawerOpen(false);
            });
          }}
        />
      </Drawer>

      {!drawerOpen && (
        <button
          className="drawer-handle"
          type="button"
          aria-label={t('menu.openMenu')}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuOutlined aria-hidden />
        </button>
      )}
    </div>
  );
}
