import { useState, type ReactNode } from 'react';

import './SectionSlide.css';

interface SectionSlideProps {
  activeKey: string;
  // Tab order, so the new section slides in from the side its tab sits on.
  order: string[];
  children: ReactNode;
}

// v2's animated tabs slid the incoming pane across and faded it in; antd 6
// swaps tab content instantly, so page-level sections replay that here.
export function SectionSlide({ activeKey, order, children }: SectionSlideProps) {
  // Previous-render tracking via state (React's "adjust state while rendering" pattern).
  const [shownKey, setShownKey] = useState(activeKey);
  const [direction, setDirection] = useState<'none' | 'next' | 'prev'>('none');
  if (shownKey !== activeKey) {
    const from = order.indexOf(shownKey);
    const to = order.indexOf(activeKey);
    setShownKey(activeKey);
    setDirection(from < 0 || to < 0 || from === to ? 'none' : to > from ? 'next' : 'prev');
  }

  return (
    <div className="section-slide-viewport">
      <div key={activeKey} className={`section-slide section-slide-${direction}`}>
        {children}
      </div>
    </div>
  );
}
