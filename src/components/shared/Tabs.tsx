'use client';

import { useState, type ReactNode, type CSSProperties } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
  activeColor?: string;
  className?: string;
};

export function Tabs({ tabs, defaultTab, activeColor, className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id || '');
  const activeTab = tabs.find((t) => t.id === activeId);

  const activeStyle: CSSProperties = activeColor
    ? { borderColor: activeColor, color: activeColor }
    : {};

  return (
    <div className={className}>
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={isActive ? activeStyle : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* タブコンテンツ */}
      <div className="pt-4">
        {activeTab?.content}
      </div>
    </div>
  );
}
