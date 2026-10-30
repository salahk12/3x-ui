import { useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, Switch, Tag, Tooltip, type TableColumnType } from 'antd';

import { SizeFormatter, IntlUtil, ColorUtils } from '@/utils';
import { InfinityIcon } from '@/components/ui';
import { useDatepicker } from '@/hooks/useDatepicker';
import type { NodeRecord } from '@/api/queries/useNodesQuery';
import { coerceInboundJsonField } from '@/models/dbinbound';

import { RowActionsCell } from './RowActions';
import {
  SPEED_COLUMN_WIDTH,
  SPEED_TAG_CLASS_NAME,
  SPEED_TAG_STYLE,
} from '@/components/utility/speedTagStyle';
import { InboundSpeedTag, isActiveSpeed } from './InboundSpeedTag';
import {
  readStreamHints,
  networkL4,
  shadowsocksNetworkLabel,
  tunnelNetworkLabel,
  mixedNetworkLabel,
  formatHostRemarksLabel,
} from './helpers';
import type { ClientCountEntry, DBInboundRecord, InboundSpeedEntry, RowAction } from './types';

interface UseInboundColumnsParams {
  hasAnyRemark: boolean;
  hasAnySubSortIndex: boolean;
  hasActiveNode: boolean;
  nodesById: Map<number, NodeRecord>;
  hostRemarksByInboundId: Map<number, string[]>;
  clientCount: Record<number, ClientCountEntry>;
  inboundSpeed: Record<number, InboundSpeedEntry>;
  subEnable: boolean;
  expireDiff: number;
  trafficDiff: number;
  onRowAction: (action: { key: RowAction; dbInbound: DBInboundRecord }) => void;
  onSwitchEnable: (dbInbound: DBInboundRecord, next: boolean) => void;
}

export function useInboundColumns({
  hasAnyRemark,
  hasAnySubSortIndex,
  hasActiveNode,
  nodesById,
  hostRemarksByInboundId,
  clientCount,
  inboundSpeed,
  subEnable,
  expireDiff,
  trafficDiff,
  onRowAction,
  onSwitchEnable,
}: UseInboundColumnsParams): TableColumnType<DBInboundRecord>[] {
  const { t } = useTranslation();
  const { datepicker } = useDatepicker();

  return useMemo(() => {
    const fallbackClientCount = (record: DBInboundRecord): ClientCountEntry | null => {
      const settings = coerceInboundJsonField(record.settings) as {
        clients?: { email?: string; enable?: boolean }[];
      };
      const clients = Array.isArray(settings.clients) ? settings.clients : [];
      if (clients.length === 0) return null;
      const active = clients
        .filter((client) => client.email && client.enable !== false)
        .map((client) => client.email!);
      const deactive = clients
        .filter((client) => client.email && client.enable === false)
        .map((client) => client.email!);
      return {
        clients: clients.length,
        active,
        deactive,
        depleted: [],
        expiring: [],
        online: [],
      };
    };

    const cols: TableColumnType<DBInboundRecord>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'right',
        width: 60,
      },
      {
        title: t('pages.inbounds.operate'),
        key: 'action',
        align: 'center',
        width: 70,
        render: (_, record) => (
          <RowActionsCell
            record={record}
            subEnable={subEnable}
            hasClients={(clientCount[record.id]?.clients || 0) > 0}
            onClick={(key) => onRowAction({ key, dbInbound: record })}
          />
        ),
      },
      {
        title: t('pages.inbounds.enable'),
        key: 'enable',
        align: 'center',
        width: 80,
        render: (_, record) => (
          <Switch
            aria-label={t('pages.inbounds.enable')}
            checked={record.enable}
            onChange={(next) => onSwitchEnable(record, next)}
          />
        ),
      },
    ];

    if (hasAnyRemark) {
      cols.push({
        title: t('pages.inbounds.remark'),
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        width: 120,
        render: (_, record) => {
          const hostRemarks = hostRemarksByInboundId.get(record.id) ?? [];
          if (hostRemarks.length === 0) {
            return record.remark || null;
          }
          const { display, full } = formatHostRemarksLabel(hostRemarks);
          return (
            <div className="inbound-remark-cell">
              <div className="inbound-remark">{record.remark}</div>
              <Tooltip title={full}>
                <div className="inbound-host-remarks">({display})</div>
              </Tooltip>
            </div>
          );
        },
      });
    }

    if (hasActiveNode) {
      cols.push({
        title: t('pages.inbounds.node'),
        key: 'node',
        align: 'center',
        width: 130,
        render: (_, record) => {
          if (record.nodeId == null) {
            return <Tag color="default">{t('pages.inbounds.localPanel')}</Tag>;
          }
          const node = nodesById.get(record.nodeId);
          if (!node) {
            return <Tag color="orange">node #{record.nodeId}</Tag>;
          }
          return <Tag color={node.status === 'online' ? 'blue' : 'red'}>{node.name}</Tag>;
        },
      });
    }

    if (hasAnySubSortIndex) {
      cols.push({
        title: (
          <Tooltip title={t('pages.inbounds.form.subSortIndex')}>
            {t('pages.inbounds.subSortIndex')}
          </Tooltip>
        ),
        dataIndex: 'subSortIndex',
        key: 'subSortIndex',
        align: 'right',
        width: 90,
      });
    }

    cols.push(
      {
        title: t('pages.inbounds.port'),
        dataIndex: 'port',
        key: 'port',
        align: 'center',
        width: 80,
      },
      {
        title: t('pages.inbounds.protocol'),
        key: 'protocol',
        align: 'left',
        width: 150,
        render: (_, record) => {
          const tags: ReactElement[] = [
            <Tag key="p" color="purple">
              {record.protocol}
            </Tag>,
          ];
          if (record.isWireguard || record.isAmneziawg || record.isHysteria || record.isTuic) {
            tags.push(
              <Tag key="n" color="green">
                UDP
              </Tag>,
            );
          } else if (record.isSS) {
            const stream = readStreamHints(record.streamSettings);
            tags.push(
              <Tag key="n" color="green">
                {shadowsocksNetworkLabel(record.settings)}
              </Tag>,
            );
            if (stream.isTls)
              tags.push(
                <Tag key="tls" color="blue">
                  TLS
                </Tag>,
              );
          } else if (record.isTunnel) {
            tags.push(
              <Tag key="n" color="green">
                {tunnelNetworkLabel(record.settings)}
              </Tag>,
            );
          } else if (record.isMixed) {
            tags.push(
              <Tag key="n" color="green">
                {mixedNetworkLabel(record.settings)}
              </Tag>,
            );
          } else if (record.isVMess || record.isVLess || record.isTrojan) {
            const stream = readStreamHints(record.streamSettings);
            tags.push(
              <Tag key="n" color="green">
                {stream.network || 'tcp'}
              </Tag>,
            );
            const l4 = networkL4(stream.network);
            if (l4)
              tags.push(
                <Tag key="l4" color="green">
                  {l4}
                </Tag>,
              );
            if (stream.isTls)
              tags.push(
                <Tag key="tls" color="blue">
                  TLS
                </Tag>,
              );
            if (stream.isReality)
              tags.push(
                <Tag key="reality" color="blue">
                  Reality
                </Tag>,
              );
          }
          return <div className="protocol-tags">{tags}</div>;
        },
      },
      {
        title: t('clients'),
        key: 'clients',
        align: 'left',
        width: 140,
        render: (_, record) => {
          const cc = clientCount[record.id] || fallbackClientCount(record);
          if (!cc) return null;
          const groups: { key: string; title: string; color?: string; emails: string[] }[] = [
            { key: 'deactive', title: t('disabled'), emails: cc.deactive },
            { key: 'depleted', title: t('depleted'), color: 'red', emails: cc.depleted },
            { key: 'expiring', title: t('depletingSoon'), color: 'orange', emails: cc.expiring },
            { key: 'online', title: t('online'), color: 'blue', emails: cc.online },
          ];
          return (
            <>
              <Tag color="green" style={{ margin: 0 }}>
                {cc.clients}
              </Tag>
              {groups
                .filter((group) => group.emails.length > 0)
                .map((group) => (
                  <Popover
                    key={group.key}
                    title={group.title}
                    content={
                      <div className="client-email-list">
                        {group.emails.map((e) => (
                          <div key={e}>{e}</div>
                        ))}
                      </div>
                    }
                  >
                    <Tag color={group.color} style={{ margin: 0, padding: '0 2px' }}>
                      {group.emails.length}
                    </Tag>
                  </Popover>
                ))}
            </>
          );
        },
      },
      {
        title: t('pages.inbounds.traffic'),
        key: 'traffic',
        align: 'center',
        width: 140,
        render: (_, record) => (
          <Popover
            content={
              <table cellPadding={2}>
                <tbody>
                  <tr>
                    <td>↑ {SizeFormatter.sizeFormat(record.up)}</td>
                    <td>↓ {SizeFormatter.sizeFormat(record.down)}</td>
                  </tr>
                  {record.total > 0 && record.up + record.down < record.total && (
                    <tr>
                      <td>{t('remained')}</td>
                      <td>{SizeFormatter.sizeFormat(record.total - record.up - record.down)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            }
          >
            <Tag color={ColorUtils.usageColor(record.up + record.down, trafficDiff, record.total)}>
              {SizeFormatter.sizeFormat(record.up + record.down)} /{' '}
              {record.total > 0 ? SizeFormatter.sizeFormat(record.total) : <InfinityIcon />}
            </Tag>
          </Popover>
        ),
      },
      {
        title: t('pages.inbounds.speed'),
        key: 'speed',
        align: 'center',
        width: SPEED_COLUMN_WIDTH,
        render: (_, record) => {
          const speed = inboundSpeed[record.id];
          if (!isActiveSpeed(speed)) {
            return (
              <Tag color="default" className={SPEED_TAG_CLASS_NAME} style={SPEED_TAG_STYLE}>
                —
              </Tag>
            );
          }
          return <InboundSpeedTag speed={speed} withTooltip tableCell />;
        },
      },
      {
        title: t('pages.inbounds.expireDate'),
        key: 'expiryTime',
        align: 'center',
        width: 100,
        render: (_, record) => {
          if (record.expiryTime > 0) {
            return (
              <Popover content={IntlUtil.formatDate(record.expiryTime, datepicker)}>
                <Tag
                  color={ColorUtils.usageColor(Date.now(), expireDiff, record._expiryTime)}
                  style={{ minWidth: 50 }}
                >
                  {IntlUtil.formatRelativeTime(record.expiryTime)}
                </Tag>
              </Popover>
            );
          }
          return (
            <Tag color="purple">
              <InfinityIcon />
            </Tag>
          );
        },
      },
    );

    return cols;
  }, [
    t,
    hasAnyRemark,
    hasAnySubSortIndex,
    hasActiveNode,
    nodesById,
    hostRemarksByInboundId,
    clientCount,
    inboundSpeed,
    subEnable,
    expireDiff,
    trafficDiff,
    datepicker,
    onRowAction,
    onSwitchEnable,
  ]);
}
