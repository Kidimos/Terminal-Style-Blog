import React from 'react';
import { useConfig, useLayoutConfig } from '../hooks/useConfig';
import { useStyles } from '../hooks/useStyles';
import { CATEGORIES, getAllTagsWithCount, getCategoryStats, getTotalPosts } from '../services/postService';
import SidebarCollapsible from './SidebarCollapsible';
import type { SidebarSection as SidebarSectionType, Theme } from '../types/config';

interface SidebarSectionProps {
  type: SidebarSectionType;
  currentTime: Date;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ type, currentTime, onCategoryClick, onTagClick }) => {
  const config = useConfig();
  const { get } = useStyles();

  switch (type) {
    case 'logo':
      return (
        <div className={get('sidebar.logo.wrapper')}>
          <pre className={get('sidebar.logo.text')}>{config.site.asciiLogo}</pre>
        </div>
      );

    case 'profile':
      return (
        <div className={get('sidebar.profile.wrapper')}>
          <img
            src={config.site.avatarUrl}
            alt={config.site.author}
            className={get('sidebar.profile.avatar')}
          />
          <div className="flex-1 min-w-0">
            <p className={get('sidebar.profile.name')}>{config.site.author}</p>
            <p className={get('sidebar.profile.title')}>{config.site.title}</p>
            <p className={get('sidebar.profile.bio')}>"{config.site.bio}"</p>
          </div>
        </div>
      );

    case 'clock':
      return (
        <SidebarCollapsible title="Master Clock" storageKey="clock" defaultOpen={true}>
          <p className={get('sidebar.clock.time')}>
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </p>
          <p className={get('sidebar.clock.date')}>{currentTime.toDateString().toUpperCase()}</p>
        </SidebarCollapsible>
      );

    case 'catalog':
      return (
        <SidebarCollapsible title="Catalog // 目录" storageKey="catalog" defaultOpen={true}>
          <div className={get('sidebar.catalog.grid')}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={get('sidebar.catalog.item')}
                onClick={() => onCategoryClick(cat)}
              >
                <span className={get('sidebar.catalog.bullet')}>▸</span>
                <span className={get('sidebar.catalog.text')}>{cat}</span>
              </div>
            ))}
          </div>
          <div className={get('sidebar.catalog.location')}>
            <span className={get('sidebar.catalog.statusDot')}>●</span>
            <span className={get('sidebar.catalog.locationText')}>{config.site.location}</span>
          </div>
        </SidebarCollapsible>
      );

    case 'tags':
      const tagsWithCount = getAllTagsWithCount();
      if (tagsWithCount.length === 0) return null;
      return (
        <SidebarCollapsible title="Tags // 标签" storageKey="tags" defaultOpen={true}>
          <div className={get('sidebar.tags.cloud')}>
            {tagsWithCount.slice(0, 12).map(({ tag, count }) => (
              <span
                key={tag}
                className={get('sidebar.tags.tag')}
                onClick={() => onTagClick(tag)}
              >
                {tag}
                <span className={get('sidebar.tags.count')}>({count})</span>
              </span>
            ))}
          </div>
        </SidebarCollapsible>
      );

    case 'statistics':
      const categoryStats = getCategoryStats();
      const totalPosts = getTotalPosts();
      return (
        <SidebarCollapsible title="Statistics // 统计" storageKey="statistics" defaultOpen={false}>
          <div className={get('sidebar.statistics.content')}>
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className={get('sidebar.statistics.categoryRow')}>
                <span>{cat}</span>
                <span>{count}</span>
              </div>
            ))}
            <div className={get('sidebar.statistics.totalRow')}>
              <span>TOTAL</span>
              <span>{totalPosts} posts</span>
            </div>
          </div>
        </SidebarCollapsible>
      );

    case 'footer':
      return (
        <div className={get('sidebar.footer.wrapper')}>
          <p>&copy; {new Date().getFullYear()} {config.site.name}_SYSTEMS</p>
          <p>AUTHORIZED_OPERATOR_ONLY</p>
        </div>
      );

    default:
      return null;
  }
};

interface SidebarProps {
  currentTime: Date;
  theme: Theme;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTime, onCategoryClick, onTagClick, isCollapsed = false }) => {
  const config = useConfig();
  const layoutConfig = useLayoutConfig(config.layout.preset);
  const { get } = useStyles();

  if (!layoutConfig.sidebarVisible) {
    return null;
  }

  return (
    <aside
      className={`${get('sidebar.root')} ${isCollapsed ? get('sidebar.rootCollapsed') : ''}`}
      style={{ width: isCollapsed ? 0 : layoutConfig.sidebarWidth }}
    >
      {layoutConfig.sidebarSections.map((section) => (
        <SidebarSection
          key={section}
          type={section}
          currentTime={currentTime}
          onCategoryClick={onCategoryClick}
          onTagClick={onTagClick}
        />
      ))}
    </aside>
  );
};

export default Sidebar;
