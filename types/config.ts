export type SidebarSection = 'logo' | 'profile' | 'clock' | 'catalog' | 'tags' | 'statistics' | 'footer';
export type HeaderSection = 'brand' | 'session' | 'status';

export type Theme = 'matrix' | 'amber' | 'modern' | 'cyberpunk';

export interface SiteConfig {
  name: string;
  author: string;
  title: string;
  bio: string;
  prompt: string;
  version: string;
  asciiLogo: string;
  avatarUrl: string;
  location: string;
  copyright: string;
}

export interface SidebarComponentConfig {
  visible: boolean;
  width: number;
  sections: SidebarSection[];
  position: 'left' | 'right';
  order?: number;
}

export interface HeaderComponentConfig {
  visible: boolean;
  sections: HeaderSection[];
}

export interface TerminalComponentConfig {
  visible: boolean;
  scrollBehavior: 'auto' | 'smooth' | 'none';
}

export interface LayoutConfig {
  preset: string;
  components: {
    sidebar: SidebarComponentConfig;
    header: HeaderComponentConfig;
    terminal: TerminalComponentConfig;
  };
}

export interface ThemeConfig {
  default: Theme;
  available: Theme[];
}

export interface FeatureConfig {
  enabled: boolean;
  command?: string;
  provider?: string;
}

export interface FeaturesConfig {
  search: FeatureConfig;
  tags: FeatureConfig;
  comments: FeatureConfig;
  rss: FeatureConfig;
  statistics: FeatureConfig;
}

export interface SystemStatusConfig {
  cpu: string;
  ram: string;
  uptime: string;
  kernel: string;
}

export interface MessagesConfig {
  welcome: string;
  ready: string;
  loading: string;
  error: string;
}

export interface AppConfig {
  site: SiteConfig;
  layout: LayoutConfig;
  theme: ThemeConfig;
  features: FeaturesConfig;
  systemStatus: SystemStatusConfig;
  messages: MessagesConfig;
}

export interface PresetStructure {
  type: 'flex-row' | 'flex-col';
  direction?: 'ltr' | 'rtl';
  sidebar?: {
    position: 'left' | 'right';
    width: number;
  };
}

export interface PresetComponents {
  sidebar?: {
    visible: boolean;
    order?: number;
    sections?: SidebarSection[];
  };
  main?: {
    order?: number;
  };
  header?: {
    visible?: boolean;
  };
  terminal?: {
    visible?: boolean;
  };
}

export interface LayoutPreset {
  id: string;
  name: string;
  description?: string;
  extends?: string;
  structure: PresetStructure;
  components: PresetComponents;
  overrides?: {
    sidebar?: {
      sections?: SidebarSection[];
    };
    header?: {
      visible?: boolean;
    };
  };
}

export interface StylesConfig {
  base: Record<string, unknown>;
  sidebar: Record<string, unknown>;
  header: Record<string, unknown>;
  terminal: Record<string, unknown>;
  themes: Record<string, string>;
  animations: Record<string, string>;
}
