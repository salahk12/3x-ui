import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Descriptions,
  Dropdown,
  Layout,
  Popover,
  QRCode,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  message,
} from 'antd';
import {
  AndroidOutlined,
  AppleOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { ClipboardManager, IntlUtil, LanguageManager } from '@/utils';
import type { CalendarKind } from '@/utils';
import { setMessageInstance } from '@/utils/messageBus';
import { pauseAnimationsUntilLeave, useTheme } from '@/hooks/useTheme';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { buildSubApps, resolveSubStatus } from './subPageModel';
import { linkName } from './linkName';
import './SubPage.css';

const subData = window.__SUB_PAGE_DATA__ || {};

const sId = subData.sId || '';
const subUrl = subData.subUrl || '';
const subJsonUrl = subData.subJsonUrl || '';
const subClashUrl = subData.subClashUrl || '';
const subTitle = subData.subTitle || '';
const subSupportUrl = subData.subSupportUrl || '';
const updateHours = Number(subData.subUpdates || 0);
const announce = subData.announce || '';
const links: string[] = Array.isArray(subData.links) ? subData.links : [];
const totalByte = Number(subData.totalByte || 0);
const usedByte =
  Number(subData.usedByte || 0) ||
  Number(subData.downloadByte || 0) + Number(subData.uploadByte || 0);
const expireMs = Number(subData.expire || 0) * 1000;
const rawLastOnline = Number(subData.lastOnline || 0);
// v2 normalised second-based timestamps the same way.
const lastOnlineMs =
  rawLastOnline > 0 && rawLastOnline < 10_000_000_000 ? rawLastOnline * 1000 : rawLastOnline;
const datepicker = (subData.datepicker || 'gregorian') as CalendarKind;
const status = resolveSubStatus(
  { enabled: !!subData.enabled, usedByte, totalByte, expireMs },
  Date.now(),
);

const apps = buildSubApps({ subUrl, sId, subTitle });
const RTL_LANGUAGES = new Set(['fa-IR', 'ar-EG']);

function QrBox({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="qr-box">
      <Tag color="purple" className="qr-tag">
        {label}
      </Tag>
      <div className="qr-bg-sub">
        <button type="button" className="qr-bg-sub-inner" onClick={onCopy} aria-label={label}>
          <QRCode
            value={value}
            size={192}
            bordered={false}
            type="canvas"
            bgColor="#ffffff"
            color="#000000"
            className="qr-cv"
          />
        </button>
      </div>
    </div>
  );
}

export default function SubPage() {
  const { t } = useTranslation();
  const { isDark, isUltra, antdThemeConfig, toggleTheme, toggleUltra } = useTheme();
  const { isMobile } = useMediaQuery();
  const [messageApi, messageContextHolder] = message.useMessage();
  useEffect(() => {
    setMessageInstance(messageApi);
  }, [messageApi]);
  const [lang, setLang] = useState<string>(() => LanguageManager.getLanguage('subscription'));

  const onLangChange = useCallback((next: string) => {
    setLang(next);
    LanguageManager.setLanguage(next, 'subscription');
  }, []);

  const copy = useCallback(
    async (value: string, toast?: string) => {
      if (!value) return;
      const ok = await ClipboardManager.copyText(value);
      if (ok) messageApi.success(toast ?? t('copied'));
    },
    [t, messageApi],
  );

  const open = useCallback((url: string) => {
    if (url) window.open(url, '_blank');
  }, []);

  const onToggleDark = useCallback(() => {
    pauseAnimationsUntilLeave('sub-theme-dark');
    if (isDark && isUltra) toggleUltra();
    toggleTheme();
  }, [isDark, isUltra, toggleTheme, toggleUltra]);
  const onToggleUltra = useCallback(() => {
    pauseAnimationsUntilLeave('sub-theme-ultra');
    toggleUltra();
  }, [toggleUltra]);

  const langOptions = (
    LanguageManager.supportedLanguages as { value: string; name: string; icon: string }[]
  ).map((l) => ({
    value: l.value,
    label: (
      <Space size={8}>
        <span aria-hidden="true">{l.icon}</span>
        <span>{l.name}</span>
      </Space>
    ),
  }));

  const formatDate = (ms: number) => IntlUtil.formatDate(ms, datepicker, lang);
  const qrCount = 1 + (subJsonUrl ? 1 : 0) + (subClashUrl ? 1 : 0);

  const statusTag =
    status === 'disabled' ? (
      <Tag color="red">{t('subscription.inactive')}</Tag>
    ) : totalByte <= 0 ? (
      <Tag color="purple">{t('subscription.unlimited')}</Tag>
    ) : status === 'active' ? (
      <Tag color="green">{t('subscription.active')}</Tag>
    ) : (
      <Tag color="red">{t('subscription.inactive')}</Tag>
    );

  const descItems = [
    { key: 'sid', label: t('subscription.subId'), children: sId },
    { key: 'status', label: t('subscription.status'), children: statusTag },
    { key: 'down', label: t('subscription.downloaded'), children: subData.download || '0' },
    { key: 'up', label: t('subscription.uploaded'), children: subData.upload || '0' },
    { key: 'used', label: t('usage'), children: subData.used || '0' },
    { key: 'total', label: t('subscription.totalQuota'), children: subData.total || '∞' },
    ...(totalByte > 0
      ? [{ key: 'remained', label: t('remained'), children: subData.remained || '' }]
      : []),
    {
      key: 'online',
      label: t('lastOnline'),
      children: lastOnlineMs > 0 ? formatDate(lastOnlineMs) : '-',
    },
    {
      key: 'expiry',
      label: t('subscription.expiry'),
      children: expireMs === 0 ? t('subscription.noExpiry') : formatDate(expireMs),
    },
  ];

  const appMenu = (platform: 'android' | 'ios') => ({
    items: apps[platform].map((app) => ({ key: app.name, label: app.name })),
    onClick: ({ key }: { key: string }) => {
      const app = apps[platform].find((a) => a.name === key);
      if (app) open(app.url);
    },
  });

  const direction = RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
  const pageClass = ['subscription-page', isDark && 'is-dark', isUltra && 'is-ultra']
    .filter(Boolean)
    .join(' ');

  return (
    <ConfigProvider theme={antdThemeConfig} direction={direction}>
      {messageContextHolder}
      <Layout className={pageClass} dir={direction}>
        <Layout.Content className="sub-content">
          <Row justify="center">
            <Col xs={24} sm={22} md={18} lg={14} xl={12}>
              <Card
                hoverable
                className="subscription-card"
                title={
                  <Space>
                    <span>{subTitle || t('subscription.title')}</span>
                    <Tag>{sId}</Tag>
                  </Space>
                }
                extra={
                  <Popover
                    rootClassName={isDark ? 'dark' : 'light'}
                    title={t('menu.settings')}
                    placement="bottomRight"
                    trigger="click"
                    content={
                      <Space orientation="vertical" size={10} className="login-settings">
                        <Space id="sub-theme-dark" size={8}>
                          <Switch
                            size="small"
                            checked={isDark}
                            onChange={onToggleDark}
                            aria-label={t('menu.dark')}
                          />
                          <span>{t('menu.dark')}</span>
                        </Space>
                        {isDark && (
                          <Space id="sub-theme-ultra" size={8}>
                            <Checkbox
                              checked={isUltra}
                              onChange={onToggleUltra}
                              aria-label={t('menu.ultraDark')}
                            />
                            <span>{t('menu.ultraDark')}</span>
                          </Space>
                        )}
                        <span>{t('pages.settings.language')}</span>
                        <Select
                          className="sub-lang-select"
                          value={lang}
                          options={langOptions}
                          onChange={onLangChange}
                          aria-label={t('pages.settings.language')}
                          classNames={{ popup: { root: isDark ? 'dark' : 'light' } }}
                        />
                      </Space>
                    }
                  >
                    <Button
                      shape="circle"
                      icon={<SettingOutlined aria-hidden />}
                      aria-label={t('menu.settings')}
                    />
                  </Popover>
                }
              >
                {announce && (
                  <Alert type="info" showIcon title={announce} className="sub-announce" />
                )}

                {subUrl && (
                  <Row gutter={[8, 8]} justify="center" className="sub-qr-row">
                    <Col xs={24} sm={qrCount > 1 ? 12 : 24} className="text-center">
                      <QrBox
                        label={t('pages.settings.subSettings')}
                        value={subUrl}
                        onCopy={() => copy(subUrl)}
                      />
                    </Col>
                    {subJsonUrl && (
                      <Col xs={24} sm={12} className="text-center">
                        <QrBox
                          label={`${t('pages.settings.subSettings')} Json`}
                          value={subJsonUrl}
                          onCopy={() => copy(subJsonUrl)}
                        />
                      </Col>
                    )}
                    {subClashUrl && (
                      <Col xs={24} sm={12} className="text-center">
                        <QrBox
                          label="Clash / Mihomo"
                          value={subClashUrl}
                          onCopy={() => copy(subClashUrl)}
                        />
                      </Col>
                    )}
                  </Row>
                )}

                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  items={descItems}
                  className="sub-desc"
                />

                <div className="sub-links">
                  {links.map((link, idx) => (
                    <div key={link} className="sub-link-item">
                      <Tag color="purple" className="sub-link-tag">
                        {linkName(link, idx)}
                      </Tag>
                      <button
                        type="button"
                        className="subscription-link-box"
                        onClick={() => copy(link)}
                      >
                        {link}
                      </button>
                    </div>
                  ))}
                </div>

                {subUrl && (
                  <Row justify="center" gutter={[8, 8]} className="sub-app-row">
                    <Col xs={24} sm={12} className="text-center">
                      <Dropdown menu={appMenu('android')} trigger={['click']}>
                        <Button
                          type="primary"
                          size="large"
                          block={isMobile}
                          icon={<AndroidOutlined aria-hidden />}
                        >
                          Android <DownOutlined aria-hidden />
                        </Button>
                      </Dropdown>
                    </Col>
                    <Col xs={24} sm={12} className="text-center">
                      <Dropdown menu={appMenu('ios')} trigger={['click']}>
                        <Button
                          type="primary"
                          size="large"
                          block={isMobile}
                          icon={<AppleOutlined aria-hidden />}
                        >
                          iOS <DownOutlined aria-hidden />
                        </Button>
                      </Dropdown>
                    </Col>
                  </Row>
                )}

                {(updateHours > 0 || subSupportUrl) && (
                  <footer className="sub-footer">
                    {updateHours > 0 && (
                      <span>
                        <ClockCircleOutlined aria-hidden />{' '}
                        {t('subscription.updateInterval', { hours: updateHours })}
                      </span>
                    )}
                    {subSupportUrl && (
                      <a href={subSupportUrl} target="_blank" rel="noopener noreferrer">
                        <CustomerServiceOutlined aria-hidden /> {t('subscription.support')}
                      </a>
                    )}
                  </footer>
                )}
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
