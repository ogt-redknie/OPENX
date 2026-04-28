import type { ModelCatalogProvider } from "../types.js";

export type OPNEXProviderIndexPluginInstall = {
  npmSpec: string;
  defaultChoice?: "npm";
  minHostVersion?: string;
  expectedIntegrity?: string;
};

export type OPNEXProviderIndexPlugin = {
  id: string;
  package?: string;
  source?: string;
  install?: OPNEXProviderIndexPluginInstall;
};

export type OPNEXProviderIndexProviderAuthChoice = {
  method: string;
  choiceId: string;
  choiceLabel: string;
  choiceHint?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  optionKey?: string;
  cliFlag?: string;
  cliOption?: string;
  cliDescription?: string;
  onboardingScopes?: readonly ("text-inference" | "image-generation")[];
};

export type OPNEXProviderIndexProvider = {
  id: string;
  name: string;
  plugin: OPNEXProviderIndexPlugin;
  docs?: string;
  categories?: readonly string[];
  authChoices?: readonly OPNEXProviderIndexProviderAuthChoice[];
  previewCatalog?: ModelCatalogProvider;
};

export type OPNEXProviderIndex = {
  version: number;
  providers: Readonly<Record<string, OPNEXProviderIndexProvider>>;
};
