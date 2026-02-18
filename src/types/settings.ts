import { SettingSection, SettingValueType } from './database';

export type SettingsMap = Record<string, unknown>;

export type SectionSettings = {
  section: SettingSection;
  settings: SettingsMap;
};

export type SettingDefinition = {
  key: string;
  label: string;
  description?: string;
  value_type: SettingValueType;
  default_value: unknown;
};
