import { useMemo } from 'react';
import {
  getAppConfig,
  getPresets,
  getPreset,
  resolvePreset,
  getResolvedLayoutConfig,
  getWelcomeMessage,
  getCopyright,
} from '../config/loader';
import type { LayoutPreset } from '../types/config';

export function useConfig() {
  return useMemo(() => getAppConfig(), []);
}

export function usePresets() {
  return useMemo(() => getPresets(), []);
}

export function usePreset(id: string): LayoutPreset | undefined {
  return useMemo(() => getPreset(id), [id]);
}

export function useResolvedPreset(id: string): LayoutPreset | undefined {
  return useMemo(() => resolvePreset(id), [id]);
}

export function useLayoutConfig(presetId?: string) {
  return useMemo(() => getResolvedLayoutConfig(presetId), [presetId]);
}

export function useWelcomeMessage(): string {
  return useMemo(() => getWelcomeMessage(), []);
}

export function useCopyright(): string {
  return useMemo(() => getCopyright(), []);
}
