import YAML from 'yaml';
import siteConfigRaw from './site.config.yaml?raw';
import presetsRaw from './presets.yaml?raw';
import stylesRaw from './styles.yaml?raw';
import type { AppConfig, LayoutPreset, StylesConfig, SidebarSection } from '../types/config';

const parseYaml = <T>(raw: string): T => YAML.parse(raw) as T;

let _appConfig: AppConfig | null = null;
let _presets: Record<string, LayoutPreset> | null = null;
let _styles: StylesConfig | null = null;

export function getAppConfig(): AppConfig {
  if (!_appConfig) {
    _appConfig = parseYaml<AppConfig>(siteConfigRaw);
  }
  return _appConfig;
}

export function getPresets(): Record<string, LayoutPreset> {
  if (!_presets) {
    _presets = parseYaml<Record<string, LayoutPreset>>(presetsRaw);
  }
  return _presets;
}

export function getPreset(id: string): LayoutPreset | undefined {
  const presets = getPresets();
  return presets[id];
}

export function resolvePreset(id: string): LayoutPreset | undefined {
  const presets = getPresets();
  const preset = presets[id];
  if (!preset) return undefined;

  if (preset.extends) {
    const parent = resolvePreset(preset.extends);
    if (parent) {
      return mergePresets(parent, preset);
    }
  }
  return preset;
}

function mergePresets(base: LayoutPreset, override: LayoutPreset): LayoutPreset {
  return {
    ...base,
    ...override,
    structure: {
      ...base.structure,
      ...override.structure,
      sidebar: {
        ...base.structure.sidebar,
        ...override.structure.sidebar,
      },
    },
    components: {
      ...base.components,
      ...override.components,
    },
    overrides: override.overrides || base.overrides,
  };
}

export function getStyles(): StylesConfig {
  if (!_styles) {
    _styles = parseYaml<StylesConfig>(stylesRaw);
  }
  return _styles;
}

export function getStyle(path: string): string | undefined {
  const styles = getStyles();
  const parts = path.split('.');
  let current: unknown = styles;

  for (const part of parts) {
    if (typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export function getThemeClass(theme: string): string {
  const styles = getStyles();
  return styles.themes[theme] || styles.themes.matrix;
}

export function getResolvedLayoutConfig(presetId?: string): {
  sidebarSections: SidebarSection[];
  sidebarVisible: boolean;
  sidebarPosition: 'left' | 'right';
  sidebarWidth: number;
  headerVisible: boolean;
} {
  const config = getAppConfig();
  const targetPresetId = presetId || config.layout.preset;
  const preset = resolvePreset(targetPresetId);

  const layoutConfig = config.layout;

  let sidebarSections = layoutConfig.components.sidebar.sections;
  let sidebarVisible = layoutConfig.components.sidebar.visible;
  let sidebarPosition = layoutConfig.components.sidebar.position;
  let sidebarWidth = layoutConfig.components.sidebar.width;
  let headerVisible = layoutConfig.components.header.visible;

  if (preset) {
    if (preset.components.sidebar?.visible !== undefined) {
      sidebarVisible = preset.components.sidebar.visible;
    }
    if (preset.components.sidebar?.sections) {
      sidebarSections = preset.components.sidebar.sections;
    }
    if (preset.structure.sidebar?.position) {
      sidebarPosition = preset.structure.sidebar.position;
    }
    if (preset.structure.sidebar?.width) {
      sidebarWidth = preset.structure.sidebar.width;
    }
    if (preset.components.header?.visible !== undefined) {
      headerVisible = preset.components.header.visible;
    }
    if (preset.overrides?.sidebar?.sections) {
      sidebarSections = preset.overrides.sidebar.sections;
    }
    if (preset.overrides?.header?.visible !== undefined) {
      headerVisible = preset.overrides.header.visible;
    }
  }

  return {
    sidebarSections,
    sidebarVisible,
    sidebarPosition,
    sidebarWidth,
    headerVisible,
  };
}

export function interpolateTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return key in variables ? String(variables[key]) : `{${key}}`;
  });
}

export function getWelcomeMessage(): string {
  const config = getAppConfig();
  return interpolateTemplate(config.messages.welcome, {
    version: config.site.version,
  });
}

export function getCopyright(): string {
  const config = getAppConfig();
  return interpolateTemplate(config.site.copyright, {
    year: new Date().getFullYear().toString(),
    name: config.site.name,
  });
}
