import { memo } from 'react';
import styles from './TabNav.module.css';

export interface Tab {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Tab navigation for switching between dashboard sections
 */
function TabNavComponent({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export const TabNav = memo(TabNavComponent);
export default TabNav;
