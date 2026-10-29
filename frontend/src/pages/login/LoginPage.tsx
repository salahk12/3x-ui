import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  Layout,
  Popover,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from 'antd';
import {
  KeyOutlined,
  LockOutlined,
  PoweroffOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { FormProvider, useForm } from 'react-hook-form';
import { HttpUtil, LanguageManager } from '@/utils';
import { FormField, rhfZodValidate } from '@/components/form/rhf';
import { setMessageInstance } from '@/utils/messageBus';
import { pauseAnimationsUntilLeave, useTheme } from '@/hooks/useTheme';
import { LoginFormSchema, TwoFactorCodeSchema, type LoginFormValues } from '@/schemas/login';
import './LoginPage.css';

const HEADLINE_INTERVAL_MS = 2000;

type LoginForm = LoginFormValues;

const basePath = window.X_UI_BASE_PATH || '';

export default function LoginPage() {
  const { t } = useTranslation();
  const { isDark, isUltra, toggleTheme, toggleUltra, antdThemeConfig } = useTheme();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    setMessageInstance(messageApi);
  }, [messageApi]);

  const [fetched, setFetched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [twoFactorEnable, setTwoFactorEnable] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const methods = useForm<LoginForm>({
    defaultValues: { username: '', password: '', twoFactorCode: '' },
  });
  const [lang, setLang] = useState<string>(() => LanguageManager.getLanguage());

  const headlineWords = useMemo(() => [t('pages.login.hello'), t('pages.login.title')], [t]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % headlineWords.length);
    }, HEADLINE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [headlineWords.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const msg = await HttpUtil.post('/getTwoFactorEnable');
      if (cancelled) return;
      if (msg.success) setTwoFactorEnable(!!msg.obj);
      setFetched(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = useCallback(async (values: LoginForm) => {
    setSubmitting(true);
    try {
      const msg = await HttpUtil.post('/login', values);
      if (msg.success) window.location.href = basePath + 'panel/';
    } finally {
      setSubmitting(false);
    }
  }, []);

  const onLangChange = useCallback((next: string) => {
    setLang(next);
    LanguageManager.setLanguage(next);
  }, []);

  const onToggleDark = useCallback(() => {
    pauseAnimationsUntilLeave('login-theme-dark');
    if (isDark && isUltra) toggleUltra();
    toggleTheme();
  }, [isDark, isUltra, toggleTheme, toggleUltra]);

  const onToggleUltra = useCallback(() => {
    pauseAnimationsUntilLeave('login-theme-ultra');
    toggleUltra();
  }, [toggleUltra]);

  const pageClass = useMemo(() => {
    const classes = ['login-app'];
    if (isDark) classes.push('is-dark');
    if (isUltra) classes.push('is-ultra');
    return classes.join(' ');
  }, [isDark, isUltra]);

  const langOptions = useMemo(
    () =>
      (
        LanguageManager.supportedLanguages as {
          value: string;
          name: string;
          icon: string;
        }[]
      ).map((l) => ({
        value: l.value,
        label: (
          <Space size={8}>
            <span aria-hidden="true">{l.icon}</span>
            <span>{l.name}</span>
          </Space>
        ),
      })),
    [],
  );

  const settingsContent = (
    <Space orientation="vertical" size={10} className="login-settings">
      <Space id="login-theme-dark" size={8}>
        <Switch size="small" checked={isDark} onChange={onToggleDark} aria-label={t('menu.dark')} />
        <span>{t('menu.dark')}</span>
      </Space>
      {isDark && (
        <Space id="login-theme-ultra" size={8}>
          <Checkbox checked={isUltra} onChange={onToggleUltra} aria-label={t('menu.ultraDark')} />
          <span>{t('menu.ultraDark')}</span>
        </Space>
      )}
      <span>{t('pages.settings.language')}</span>
      <Select
        className="login-lang-select"
        value={lang}
        options={langOptions}
        onChange={onLangChange}
        aria-label={t('pages.settings.language')}
        classNames={{ popup: { root: isDark ? 'dark' : 'light' } }}
      />
    </Space>
  );

  return (
    <ConfigProvider theme={antdThemeConfig}>
      {messageContextHolder}
      <Layout className={pageClass}>
        <Layout.Content className="login-content">
          <div className="waves-header" aria-hidden="true">
            <div className="waves-inner-header" />
            <svg
              className="waves"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="parallax">
                <use href="#gentle-wave" x="48" y="0" />
                <use href="#gentle-wave" x="48" y="3" />
                <use href="#gentle-wave" x="48" y="5" />
                <use href="#gentle-wave" x="48" y="7" />
              </g>
            </svg>
          </div>

          <div className="login-wrapper">
            <div id="login" className="login-card">
              {!fetched ? (
                <div className="login-loading">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <div className="setting-section">
                    <Popover
                      rootClassName={isDark ? 'dark' : 'light'}
                      title={t('menu.settings')}
                      placement="bottomRight"
                      trigger="click"
                      content={settingsContent}
                    >
                      <Button
                        shape="circle"
                        icon={<SettingOutlined aria-hidden />}
                        aria-label={t('menu.settings')}
                      />
                    </Popover>
                  </div>
                  <h2 className="welcome">
                    <b key={headlineIndex}>{headlineWords[headlineIndex]}</b>
                  </h2>

                  <FormProvider {...methods}>
                    <Form className="login-form" onFinish={methods.handleSubmit(onSubmit)}>
                      <FormField
                        name="username"
                        rules={{
                          validate: rhfZodValidate(LoginFormSchema.shape.username),
                        }}
                      >
                        <Input
                          prefix={<UserOutlined aria-hidden />}
                          autoComplete="username"
                          placeholder={t('username')}
                          aria-label={t('username')}
                          autoFocus
                        />
                      </FormField>

                      <FormField
                        name="password"
                        rules={{
                          validate: rhfZodValidate(LoginFormSchema.shape.password),
                        }}
                      >
                        <Input.Password
                          prefix={<LockOutlined aria-hidden />}
                          autoComplete="current-password"
                          placeholder={t('password')}
                          aria-label={t('password')}
                        />
                      </FormField>

                      {twoFactorEnable && (
                        <FormField
                          name="twoFactorCode"
                          rules={{
                            validate: rhfZodValidate(TwoFactorCodeSchema),
                          }}
                        >
                          <Input
                            prefix={<KeyOutlined aria-hidden />}
                            autoComplete="one-time-code"
                            placeholder={t('twoFactorCode')}
                            aria-label={t('twoFactorCode')}
                          />
                        </FormField>
                      )}

                      <Form.Item className="submit-row">
                        <div className={`wave-btn-bg${submitting ? ' is-loading' : ''}`}>
                          <Button
                            className="ant-btn-primary-login"
                            type="primary"
                            htmlType="submit"
                            loading={
                              submitting && {
                                icon: <PoweroffOutlined aria-hidden />,
                              }
                            }
                            aria-label={t('login')}
                          >
                            {submitting ? null : t('login')}
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </FormProvider>
                </>
              )}
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
