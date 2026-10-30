import { useEffect, useState } from 'react';
import {
  Alert,
  AutoComplete,
  Badge,
  Checkbox,
  Collapse,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Segmented,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

// antd 6 generates each component's CSS the first time that component renders.
// A form modal uses dozens of components the list page never showed, so its
// first open paid ~400 ms of style generation and recalculation before the
// modal could appear. Rendering one hidden instance of each while the page is
// idle moves that cost off the click; the injected styles stay cached.
export default function AntdStyleWarmup() {
  const [phase, setPhase] = useState<'wait' | 'render' | 'done'>('wait');

  useEffect(() => {
    if (phase === 'done') return;
    const next = () => setPhase(phase === 'wait' ? 'render' : 'done');
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(next, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(next, 500);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase !== 'render') return null;
  return (
    <div aria-hidden inert style={{ display: 'none' }}>
      <Form layout="horizontal" labelCol={{ span: 8 }}>
        <Form.Item label="w" tooltip="w" htmlFor="xui-warm-input">
          <Input id="xui-warm-input" />
        </Form.Item>
        <Form.Item label="w" htmlFor="xui-warm-password">
          <Input.Password id="xui-warm-password" />
        </Form.Item>
        <Form.Item label="w" htmlFor="xui-warm-textarea">
          <Input.TextArea id="xui-warm-textarea" />
        </Form.Item>
        <Space.Compact>
          <Input addonBefore="w" aria-label="w" />
        </Space.Compact>
        <InputNumber aria-label="w" />
        <Select aria-label="w" options={[{ value: 'w', label: 'w' }]} value="w" />
        <Select
          aria-label="w"
          mode="multiple"
          options={[{ value: 'w', label: 'w' }]}
          value={['w']}
        />
        <AutoComplete aria-label="w" options={[{ value: 'w' }]} />
        <DatePicker aria-label="w" />
        <Switch aria-label="w" />
        <Checkbox aria-label="w" />
        <Radio.Group aria-label="w" options={['w']} optionType="button" />
        <Radio aria-label="w" />
        <Segmented options={['w']} />
      </Form>
      <Tabs items={[{ key: 'w', label: 'w', children: 'w' }]} />
      <Collapse items={[{ key: 'w', label: 'w', children: 'w' }]} />
      <Descriptions bordered items={[{ key: 'w', label: 'w', children: 'w' }]} />
      <Alert title="w" showIcon />
      <Badge count={1} />
      <Tag>w</Tag>
      <Divider />
      <Empty />
      <Pagination total={20} />
      <Progress percent={1} />
      <Typography.Text>w</Typography.Text>
      <Tooltip title="w">
        <span />
      </Tooltip>
      <Popover content="w">
        <span />
      </Popover>
      <Popconfirm title="w">
        <span />
      </Popconfirm>
      <Dropdown menu={{ items: [] }}>
        <span />
      </Dropdown>
      <Modal open={false} />
      <Drawer open={false} />
    </div>
  );
}
