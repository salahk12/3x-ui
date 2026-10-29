import type { ReactNode } from 'react';
import { Collapse } from 'antd';

export interface SectionTabItem {
  key: string;
  label: ReactNode;
  children?: ReactNode;
}

interface SectionTabsProps {
  items: SectionTabItem[];
  defaultActiveKey?: string;
}

// v2.x grouped each settings page into collapsible panels (first one open) instead of inner tabs.
export function SectionTabs({ items, defaultActiveKey }: SectionTabsProps) {
  const first = defaultActiveKey ?? items[0]?.key;
  return (
    <Collapse
      className="section-tabs"
      defaultActiveKey={first ? [first] : []}
      items={items.map(({ key, label, children }) => ({ key, label, children }))}
    />
  );
}

// v2 panel headers were plain text; the icon argument is kept so callers stay unchanged.
export function sectionLabel(_icon: ReactNode, text: ReactNode, _iconsOnly?: boolean): ReactNode {
  return text;
}
