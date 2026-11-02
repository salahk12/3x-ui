import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Card,
  Col,
  Popover,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import {
  ApiOutlined,
  AreaChartOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarsOutlined,
  CloudDownloadOutlined,
  CloudServerOutlined,
  CloudUploadOutlined,
  ControlOutlined,
  DashboardOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HistoryOutlined,
  PoweroffOutlined,
  ReloadOutlined,
  SwapOutlined,
  ToolOutlined,
} from '@ant-design/icons';

import { CPUFormatter, SizeFormatter, TimeFormatter } from '@/utils';
import { formatPanelVersion } from '@/lib/panel-version';
import type { Status } from '@/models/status';
import './ClassicOverview.css';

const RELEASES_URL = 'https://github.com/salahk12/3x-ui/releases';
const CHANNEL_URL = 'https://t.me/XrayUI';
const DOCS_URL = 'https://docs.sanaei.dev/';

const XRAY_STATE_KEYS: Record<string, string> = {
  running: 'pages.index.xrayStatusRunning',
  stop: 'pages.index.xrayStatusStop',
  error: 'pages.index.xrayStatusError',
};

const BADGE_ANIMATION: Record<string, string> = {
  green: 'xray-running-animation',
  orange: 'xray-stop-animation',
  red: 'xray-error-animation',
};

interface ClassicOverviewProps {
  status: Status;
  isMobile: boolean;
  accessLogEnable: boolean;
  panelVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  showIp: boolean;
  onToggleIp: () => void;
  onStopXray: () => void;
  onRestartXray: () => void;
  onOpenLogs: () => void;
  onOpenXrayLogs: () => void;
  onOpenAmneziaWGLogs: () => void;
  onOpenConfig: () => void;
  onOpenBackup: () => void;
  onOpenSystemHistory: () => void;
  onOpenXrayMetrics: () => void;
  onOpenPanelUpdate: () => void;
  onOpenVersionSwitch: () => void;
}

function CardAction({
  icon,
  text,
  isMobile,
  onClick,
}: {
  icon: ReactNode;
  text: string;
  isMobile: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="classic-card-action" onClick={onClick} aria-label={text}>
      {icon}
      {!isMobile && <span>{text}</span>}
    </button>
  );
}

function Gauge({ percent, color, label }: { percent: number; color: string; label: ReactNode }) {
  return (
    <Col span={12} className="text-center">
      <Progress
        type="dashboard"
        status="normal"
        strokeColor={color}
        percent={Number(percent.toFixed(2))}
        format={(p) => `${p}%`}
      />
      <div className="classic-gauge-label">{label}</div>
    </Col>
  );
}

export default function ClassicOverview(props: ClassicOverviewProps) {
  const { t } = useTranslation();
  const { status, isMobile } = props;
  const hasXrayVersion = !!status.xray.version && status.xray.version !== 'Unknown';
  const stateText = t(XRAY_STATE_KEYS[status.xray.state] ?? 'pages.index.xrayStatusUnknown');
  const containerScope = status.resourceScope === 'container';

  const xrayBadge = (
    <Badge
      status="processing"
      className={BADGE_ANIMATION[status.xray.color] ?? 'xray-processing-animation'}
      text={stateText}
      color={status.xray.color}
    />
  );

  const xrayActions = [
    ...(props.accessLogEnable
      ? [
          <CardAction
            key="logs"
            icon={<FileTextOutlined aria-hidden />}
            text={t('pages.index.logs')}
            isMobile={isMobile}
            onClick={props.onOpenXrayLogs}
          />,
        ]
      : []),
    <CardAction
      key="stop"
      icon={<PoweroffOutlined aria-hidden />}
      text={t('pages.index.stopXray')}
      isMobile={isMobile}
      onClick={props.onStopXray}
    />,
    <CardAction
      key="restart"
      icon={<ReloadOutlined aria-hidden />}
      text={t('pages.index.restartXray')}
      isMobile={isMobile}
      onClick={props.onRestartXray}
    />,
    <CardAction
      key="version"
      icon={<ToolOutlined aria-hidden />}
      text={hasXrayVersion ? `v${status.xray.version}` : t('pages.index.xraySwitch')}
      isMobile={isMobile}
      onClick={props.onOpenVersionSwitch}
    />,
  ];

  const manageActions = [
    <CardAction
      key="logs"
      icon={<BarsOutlined aria-hidden />}
      text={t('pages.index.logs')}
      isMobile={isMobile}
      onClick={props.onOpenLogs}
    />,
    ...(status.amneziawg.configured
      ? [
          <CardAction
            key="awg"
            icon={<ApiOutlined aria-hidden />}
            text={t('pages.index.amneziawgLogs')}
            isMobile={isMobile}
            onClick={props.onOpenAmneziaWGLogs}
          />,
        ]
      : []),
    <CardAction
      key="config"
      icon={<ControlOutlined aria-hidden />}
      text={t('pages.index.config')}
      isMobile={isMobile}
      onClick={props.onOpenConfig}
    />,
    <CardAction
      key="backup"
      icon={<CloudServerOutlined aria-hidden />}
      text={t('pages.index.backup')}
      isMobile={isMobile}
      onClick={props.onOpenBackup}
    />,
  ];

  return (
    <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 12]} className="classic-overview">
      <Col span={24}>
        <Card hoverable>
          <Row gutter={[0, isMobile ? 16 : 0]}>
            <Col xs={24} md={12}>
              <Row>
                <Gauge
                  percent={status.cpu.percent}
                  color={status.cpu.color}
                  label={
                    <>
                      {t('pages.index.cpu')}:{' '}
                      {containerScope
                        ? `${status.logicalPro} vCPU`
                        : CPUFormatter.cpuCoreFormat(status.cpuCores)}{' '}
                      <Tooltip
                        title={
                          <>
                            <div>
                              <b>{t('pages.index.logicalProcessors')}:</b> {status.logicalPro}
                            </div>
                            <div>
                              <b>{t('pages.index.frequency')}:</b>{' '}
                              {CPUFormatter.cpuSpeedFormat(status.cpuSpeedMhz)}
                            </div>
                          </>
                        }
                      >
                        <AreaChartOutlined aria-hidden />
                      </Tooltip>
                      <Tooltip title={t('pages.index.systemHistoryTitle')}>
                        <Button
                          size="small"
                          shape="circle"
                          className="ml-8"
                          icon={<HistoryOutlined aria-hidden />}
                          aria-label={t('pages.index.systemHistoryTitle')}
                          onClick={props.onOpenSystemHistory}
                        />
                      </Tooltip>
                    </>
                  }
                />
                <Gauge
                  percent={status.mem.percent}
                  color={status.mem.color}
                  label={
                    <>
                      {t('pages.index.memory')}: {SizeFormatter.sizeFormat(status.mem.current)} /{' '}
                      {SizeFormatter.sizeFormat(status.mem.total)}
                    </>
                  }
                />
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Row>
                <Gauge
                  percent={status.swap.percent}
                  color={status.swap.color}
                  label={
                    <>
                      {t('pages.index.swap')}: {SizeFormatter.sizeFormat(status.swap.current)} /{' '}
                      {SizeFormatter.sizeFormat(status.swap.total)}
                    </>
                  }
                />
                <Gauge
                  percent={status.disk.percent}
                  color={status.disk.color}
                  label={
                    <>
                      {t('pages.index.storage')}: {SizeFormatter.sizeFormat(status.disk.current)} /{' '}
                      {SizeFormatter.sizeFormat(status.disk.total)}
                    </>
                  }
                />
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          hoverable
          title={
            <Space>
              <span>{t('pages.index.xrayStatus')}</span>
              {isMobile && hasXrayVersion && <Tag color="green">v{status.xray.version}</Tag>}
            </Space>
          }
          extra={
            status.xray.errorMsg ? (
              <Popover
                title={
                  <Row justify="space-between" align="middle">
                    <span>{t('pages.index.xrayErrorPopoverTitle')}</span>
                    <button
                      type="button"
                      className="classic-icon-button"
                      aria-label={t('pages.index.logs')}
                      onClick={props.onOpenLogs}
                    >
                      <BarsOutlined aria-hidden />
                    </button>
                  </Row>
                }
                content={<div className="classic-xray-error">{status.xray.errorMsg}</div>}
              >
                {xrayBadge}
              </Popover>
            ) : (
              xrayBadge
            )
          }
          actions={xrayActions}
        />
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('menu.link')} actions={manageActions} />
      </Col>

      <Col xs={24} lg={12}>
        <Card
          hoverable
          title="3X-UI"
          extra={
            props.updateAvailable ? (
              <Tooltip title={`${t('pages.index.updatePanel')}: ${props.latestVersion}`}>
                <Tag
                  color="orange"
                  className="cursor-pointer"
                  style={{ margin: 0 }}
                  icon={<CloudDownloadOutlined aria-hidden />}
                  onClick={props.onOpenPanelUpdate}
                >
                  {formatPanelVersion(props.latestVersion)}
                  {!isMobile && <span> {t('pages.index.updatePanel')}</span>}
                </Tag>
              </Tooltip>
            ) : (
              <Tooltip title={t('pages.index.updatePanel')}>
                <Button
                  size="small"
                  shape="circle"
                  icon={<CloudDownloadOutlined aria-hidden />}
                  aria-label={t('pages.index.updatePanel')}
                  onClick={props.onOpenPanelUpdate}
                />
              </Tooltip>
            )
          }
        >
          <a rel="noopener noreferrer" href={RELEASES_URL} target="_blank">
            <Tag color="green">{formatPanelVersion(props.panelVersion)}</Tag>
          </a>
          <a rel="noopener noreferrer" href={CHANNEL_URL} target="_blank">
            <Tag color="green">@XrayUI</Tag>
          </a>
          <a rel="noopener noreferrer" href={DOCS_URL} target="_blank">
            <Tag color="purple">{t('pages.index.documentation')}</Tag>
          </a>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('pages.index.operationHours')}>
          <Tag color={status.xray.color}>
            Xray: {TimeFormatter.formatSecond(status.appStats.uptime)}
          </Tag>
          <Tag color="green">
            {containerScope ? 'CT' : 'OS'}:{' '}
            {status.metricAvailable('uptime') ? TimeFormatter.formatSecond(status.uptime) : '—'}
          </Tag>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('pages.index.systemLoad')}>
          <Tooltip title={t('pages.index.systemLoadDesc')}>
            <Tag color="green">
              {status.loads[0]} | {status.loads[1]} | {status.loads[2]}
            </Tag>
          </Tooltip>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          hoverable
          title={t('usage')}
          extra={
            <Tooltip title={t('pages.index.xrayMetricsTitle')}>
              <Button
                size="small"
                shape="circle"
                icon={<DashboardOutlined aria-hidden />}
                aria-label={t('pages.index.xrayMetricsTitle')}
                onClick={props.onOpenXrayMetrics}
              />
            </Tooltip>
          }
        >
          <Tag color="green">
            {t('pages.index.memory')}: {SizeFormatter.sizeFormat(status.appStats.mem)}
          </Tag>
          <Tag color="green">
            {t('pages.index.threads')}: {status.appStats.threads}
          </Tag>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('pages.index.overallSpeed')}>
          <Row gutter={isMobile ? [8, 8] : 0}>
            <Col span={12}>
              <Statistic
                title={t('pages.index.upload')}
                value={SizeFormatter.sizeFormat(status.netIO.up)}
                prefix={<ArrowUpOutlined aria-hidden />}
                suffix="/s"
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={t('pages.index.download')}
                value={SizeFormatter.sizeFormat(status.netIO.down)}
                prefix={<ArrowDownOutlined aria-hidden />}
                suffix="/s"
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('pages.index.totalData')}>
          <Row gutter={isMobile ? [8, 8] : 0}>
            <Col span={12}>
              <Statistic
                title={t('pages.index.sent')}
                value={SizeFormatter.sizeFormat(status.netTraffic.sent)}
                prefix={<CloudUploadOutlined aria-hidden />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={t('pages.index.received')}
                value={SizeFormatter.sizeFormat(status.netTraffic.recv)}
                prefix={<CloudDownloadOutlined aria-hidden />}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card
          hoverable
          title={t('pages.index.ipAddresses')}
          extra={
            <Tooltip
              title={t('pages.index.toggleIpVisibility')}
              placement={isMobile ? 'topRight' : 'top'}
            >
              <button
                type="button"
                className="classic-icon-button"
                aria-label={t('pages.index.toggleIpVisibility')}
                onClick={props.onToggleIp}
              >
                {props.showIp ? <EyeOutlined aria-hidden /> : <EyeInvisibleOutlined aria-hidden />}
              </button>
            </Tooltip>
          }
        >
          <Row className={props.showIp ? 'ip-visible' : 'ip-hidden'} gutter={isMobile ? [8, 8] : 0}>
            <Col span={isMobile ? 24 : 12}>
              <Statistic
                title="IPv4"
                value={String(status.publicIP.ipv4)}
                prefix={<GlobalOutlined aria-hidden />}
              />
            </Col>
            <Col span={isMobile ? 24 : 12}>
              <Statistic
                title="IPv6"
                value={String(status.publicIP.ipv6)}
                prefix={<GlobalOutlined aria-hidden />}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card hoverable title={t('pages.index.connectionCount')}>
          <Row gutter={isMobile ? [8, 8] : 0}>
            <Col span={12}>
              <Statistic
                title="TCP"
                value={status.tcpCount}
                prefix={<SwapOutlined aria-hidden />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="UDP"
                value={status.udpCount}
                prefix={<SwapOutlined aria-hidden />}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
