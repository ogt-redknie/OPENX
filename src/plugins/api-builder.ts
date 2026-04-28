import type { OPNEXConfig } from "../config/types.opnex.js";
import type { PluginRuntime } from "./runtime/types.js";
import type { OPNEXPluginApi, PluginLogger } from "./types.js";

export type BuildPluginApiParams = {
  id: string;
  name: string;
  version?: string;
  description?: string;
  source: string;
  rootDir?: string;
  registrationMode: OPNEXPluginApi["registrationMode"];
  config: OPNEXConfig;
  pluginConfig?: Record<string, unknown>;
  runtime: PluginRuntime;
  logger: PluginLogger;
  resolvePath: (input: string) => string;
  handlers?: Partial<
    Pick<
      OPNEXPluginApi,
      | "registerTool"
      | "registerHook"
      | "registerHttpRoute"
      | "registerChannel"
      | "registerGatewayMethod"
      | "registerCli"
      | "registerReload"
      | "registerNodeHostCommand"
      | "registerSecurityAuditCollector"
      | "registerService"
      | "registerGatewayDiscoveryService"
      | "registerCliBackend"
      | "registerTextTransforms"
      | "registerConfigMigration"
      | "registerMigrationProvider"
      | "registerAutoEnableProbe"
      | "registerProvider"
      | "registerSpeechProvider"
      | "registerRealtimeTranscriptionProvider"
      | "registerRealtimeVoiceProvider"
      | "registerMediaUnderstandingProvider"
      | "registerImageGenerationProvider"
      | "registerVideoGenerationProvider"
      | "registerMusicGenerationProvider"
      | "registerWebFetchProvider"
      | "registerWebSearchProvider"
      | "registerInteractiveHandler"
      | "onConversationBindingResolved"
      | "registerCommand"
      | "registerContextEngine"
      | "registerCompactionProvider"
      | "registerAgentHarness"
      | "registerCodexAppServerExtensionFactory"
      | "registerAgentToolResultMiddleware"
      | "registerSessionExtension"
      | "enqueueNextTurnInjection"
      | "registerTrustedToolPolicy"
      | "registerToolMetadata"
      | "registerControlUiDescriptor"
      | "registerRuntimeLifecycle"
      | "registerAgentEventSubscription"
      | "setRunContext"
      | "getRunContext"
      | "clearRunContext"
      | "registerSessionSchedulerJob"
      | "registerDetachedTaskRuntime"
      | "registerMemoryCapability"
      | "registerMemoryPromptSection"
      | "registerMemoryPromptSupplement"
      | "registerMemoryCorpusSupplement"
      | "registerMemoryFlushPlan"
      | "registerMemoryRuntime"
      | "registerMemoryEmbeddingProvider"
      | "on"
    >
  >;
};

const noopRegisterTool: OPNEXPluginApi["registerTool"] = () => {};
const noopRegisterHook: OPNEXPluginApi["registerHook"] = () => {};
const noopRegisterHttpRoute: OPNEXPluginApi["registerHttpRoute"] = () => {};
const noopRegisterChannel: OPNEXPluginApi["registerChannel"] = () => {};
const noopRegisterGatewayMethod: OPNEXPluginApi["registerGatewayMethod"] = () => {};
const noopRegisterCli: OPNEXPluginApi["registerCli"] = () => {};
const noopRegisterReload: OPNEXPluginApi["registerReload"] = () => {};
const noopRegisterNodeHostCommand: OPNEXPluginApi["registerNodeHostCommand"] = () => {};
const noopRegisterSecurityAuditCollector: OPNEXPluginApi["registerSecurityAuditCollector"] =
  () => {};
const noopRegisterService: OPNEXPluginApi["registerService"] = () => {};
const noopRegisterGatewayDiscoveryService: OPNEXPluginApi["registerGatewayDiscoveryService"] =
  () => {};
const noopRegisterCliBackend: OPNEXPluginApi["registerCliBackend"] = () => {};
const noopRegisterTextTransforms: OPNEXPluginApi["registerTextTransforms"] = () => {};
const noopRegisterConfigMigration: OPNEXPluginApi["registerConfigMigration"] = () => {};
const noopRegisterMigrationProvider: OPNEXPluginApi["registerMigrationProvider"] = () => {};
const noopRegisterAutoEnableProbe: OPNEXPluginApi["registerAutoEnableProbe"] = () => {};
const noopRegisterProvider: OPNEXPluginApi["registerProvider"] = () => {};
const noopRegisterSpeechProvider: OPNEXPluginApi["registerSpeechProvider"] = () => {};
const noopRegisterRealtimeTranscriptionProvider: OPNEXPluginApi["registerRealtimeTranscriptionProvider"] =
  () => {};
const noopRegisterRealtimeVoiceProvider: OPNEXPluginApi["registerRealtimeVoiceProvider"] =
  () => {};
const noopRegisterMediaUnderstandingProvider: OPNEXPluginApi["registerMediaUnderstandingProvider"] =
  () => {};
const noopRegisterImageGenerationProvider: OPNEXPluginApi["registerImageGenerationProvider"] =
  () => {};
const noopRegisterVideoGenerationProvider: OPNEXPluginApi["registerVideoGenerationProvider"] =
  () => {};
const noopRegisterMusicGenerationProvider: OPNEXPluginApi["registerMusicGenerationProvider"] =
  () => {};
const noopRegisterWebFetchProvider: OPNEXPluginApi["registerWebFetchProvider"] = () => {};
const noopRegisterWebSearchProvider: OPNEXPluginApi["registerWebSearchProvider"] = () => {};
const noopRegisterInteractiveHandler: OPNEXPluginApi["registerInteractiveHandler"] = () => {};
const noopOnConversationBindingResolved: OPNEXPluginApi["onConversationBindingResolved"] =
  () => {};
const noopRegisterCommand: OPNEXPluginApi["registerCommand"] = () => {};
const noopRegisterContextEngine: OPNEXPluginApi["registerContextEngine"] = () => {};
const noopRegisterCompactionProvider: OPNEXPluginApi["registerCompactionProvider"] = () => {};
const noopRegisterAgentHarness: OPNEXPluginApi["registerAgentHarness"] = () => {};
const noopRegisterCodexAppServerExtensionFactory: OPNEXPluginApi["registerCodexAppServerExtensionFactory"] =
  () => {};
const noopRegisterAgentToolResultMiddleware: OPNEXPluginApi["registerAgentToolResultMiddleware"] =
  () => {};
const noopRegisterSessionExtension: OPNEXPluginApi["registerSessionExtension"] = () => {};
const noopEnqueueNextTurnInjection: OPNEXPluginApi["enqueueNextTurnInjection"] = async (
  injection,
) => ({ enqueued: false, id: "", sessionKey: injection.sessionKey });
const noopRegisterTrustedToolPolicy: OPNEXPluginApi["registerTrustedToolPolicy"] = () => {};
const noopRegisterToolMetadata: OPNEXPluginApi["registerToolMetadata"] = () => {};
const noopRegisterControlUiDescriptor: OPNEXPluginApi["registerControlUiDescriptor"] = () => {};
const noopRegisterRuntimeLifecycle: OPNEXPluginApi["registerRuntimeLifecycle"] = () => {};
const noopRegisterAgentEventSubscription: OPNEXPluginApi["registerAgentEventSubscription"] =
  () => {};
const noopSetRunContext: OPNEXPluginApi["setRunContext"] = () => false;
const noopGetRunContext: OPNEXPluginApi["getRunContext"] = () => undefined;
const noopClearRunContext: OPNEXPluginApi["clearRunContext"] = () => {};
const noopRegisterSessionSchedulerJob: OPNEXPluginApi["registerSessionSchedulerJob"] = () =>
  undefined;
const noopRegisterDetachedTaskRuntime: OPNEXPluginApi["registerDetachedTaskRuntime"] = () => {};
const noopRegisterMemoryCapability: OPNEXPluginApi["registerMemoryCapability"] = () => {};
const noopRegisterMemoryPromptSection: OPNEXPluginApi["registerMemoryPromptSection"] = () => {};
const noopRegisterMemoryPromptSupplement: OPNEXPluginApi["registerMemoryPromptSupplement"] =
  () => {};
const noopRegisterMemoryCorpusSupplement: OPNEXPluginApi["registerMemoryCorpusSupplement"] =
  () => {};
const noopRegisterMemoryFlushPlan: OPNEXPluginApi["registerMemoryFlushPlan"] = () => {};
const noopRegisterMemoryRuntime: OPNEXPluginApi["registerMemoryRuntime"] = () => {};
const noopRegisterMemoryEmbeddingProvider: OPNEXPluginApi["registerMemoryEmbeddingProvider"] =
  () => {};
const noopOn: OPNEXPluginApi["on"] = () => {};

export function buildPluginApi(params: BuildPluginApiParams): OPNEXPluginApi {
  const handlers = params.handlers ?? {};
  return {
    id: params.id,
    name: params.name,
    version: params.version,
    description: params.description,
    source: params.source,
    rootDir: params.rootDir,
    registrationMode: params.registrationMode,
    config: params.config,
    pluginConfig: params.pluginConfig,
    runtime: params.runtime,
    logger: params.logger,
    registerTool: handlers.registerTool ?? noopRegisterTool,
    registerHook: handlers.registerHook ?? noopRegisterHook,
    registerHttpRoute: handlers.registerHttpRoute ?? noopRegisterHttpRoute,
    registerChannel: handlers.registerChannel ?? noopRegisterChannel,
    registerGatewayMethod: handlers.registerGatewayMethod ?? noopRegisterGatewayMethod,
    registerCli: handlers.registerCli ?? noopRegisterCli,
    registerReload: handlers.registerReload ?? noopRegisterReload,
    registerNodeHostCommand: handlers.registerNodeHostCommand ?? noopRegisterNodeHostCommand,
    registerSecurityAuditCollector:
      handlers.registerSecurityAuditCollector ?? noopRegisterSecurityAuditCollector,
    registerService: handlers.registerService ?? noopRegisterService,
    registerGatewayDiscoveryService:
      handlers.registerGatewayDiscoveryService ?? noopRegisterGatewayDiscoveryService,
    registerCliBackend: handlers.registerCliBackend ?? noopRegisterCliBackend,
    registerTextTransforms: handlers.registerTextTransforms ?? noopRegisterTextTransforms,
    registerConfigMigration: handlers.registerConfigMigration ?? noopRegisterConfigMigration,
    registerMigrationProvider: handlers.registerMigrationProvider ?? noopRegisterMigrationProvider,
    registerAutoEnableProbe: handlers.registerAutoEnableProbe ?? noopRegisterAutoEnableProbe,
    registerProvider: handlers.registerProvider ?? noopRegisterProvider,
    registerSpeechProvider: handlers.registerSpeechProvider ?? noopRegisterSpeechProvider,
    registerRealtimeTranscriptionProvider:
      handlers.registerRealtimeTranscriptionProvider ?? noopRegisterRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider:
      handlers.registerRealtimeVoiceProvider ?? noopRegisterRealtimeVoiceProvider,
    registerMediaUnderstandingProvider:
      handlers.registerMediaUnderstandingProvider ?? noopRegisterMediaUnderstandingProvider,
    registerImageGenerationProvider:
      handlers.registerImageGenerationProvider ?? noopRegisterImageGenerationProvider,
    registerVideoGenerationProvider:
      handlers.registerVideoGenerationProvider ?? noopRegisterVideoGenerationProvider,
    registerMusicGenerationProvider:
      handlers.registerMusicGenerationProvider ?? noopRegisterMusicGenerationProvider,
    registerWebFetchProvider: handlers.registerWebFetchProvider ?? noopRegisterWebFetchProvider,
    registerWebSearchProvider: handlers.registerWebSearchProvider ?? noopRegisterWebSearchProvider,
    registerInteractiveHandler:
      handlers.registerInteractiveHandler ?? noopRegisterInteractiveHandler,
    onConversationBindingResolved:
      handlers.onConversationBindingResolved ?? noopOnConversationBindingResolved,
    registerCommand: handlers.registerCommand ?? noopRegisterCommand,
    registerContextEngine: handlers.registerContextEngine ?? noopRegisterContextEngine,
    registerCompactionProvider:
      handlers.registerCompactionProvider ?? noopRegisterCompactionProvider,
    registerAgentHarness: handlers.registerAgentHarness ?? noopRegisterAgentHarness,
    registerCodexAppServerExtensionFactory:
      handlers.registerCodexAppServerExtensionFactory ?? noopRegisterCodexAppServerExtensionFactory,
    registerAgentToolResultMiddleware:
      handlers.registerAgentToolResultMiddleware ?? noopRegisterAgentToolResultMiddleware,
    registerSessionExtension: handlers.registerSessionExtension ?? noopRegisterSessionExtension,
    enqueueNextTurnInjection: handlers.enqueueNextTurnInjection ?? noopEnqueueNextTurnInjection,
    registerTrustedToolPolicy: handlers.registerTrustedToolPolicy ?? noopRegisterTrustedToolPolicy,
    registerToolMetadata: handlers.registerToolMetadata ?? noopRegisterToolMetadata,
    registerControlUiDescriptor:
      handlers.registerControlUiDescriptor ?? noopRegisterControlUiDescriptor,
    registerRuntimeLifecycle: handlers.registerRuntimeLifecycle ?? noopRegisterRuntimeLifecycle,
    registerAgentEventSubscription:
      handlers.registerAgentEventSubscription ?? noopRegisterAgentEventSubscription,
    setRunContext: handlers.setRunContext ?? noopSetRunContext,
    getRunContext: handlers.getRunContext ?? noopGetRunContext,
    clearRunContext: handlers.clearRunContext ?? noopClearRunContext,
    registerSessionSchedulerJob:
      handlers.registerSessionSchedulerJob ?? noopRegisterSessionSchedulerJob,
    registerDetachedTaskRuntime:
      handlers.registerDetachedTaskRuntime ?? noopRegisterDetachedTaskRuntime,
    registerMemoryCapability: handlers.registerMemoryCapability ?? noopRegisterMemoryCapability,
    registerMemoryPromptSection:
      handlers.registerMemoryPromptSection ?? noopRegisterMemoryPromptSection,
    registerMemoryPromptSupplement:
      handlers.registerMemoryPromptSupplement ?? noopRegisterMemoryPromptSupplement,
    registerMemoryCorpusSupplement:
      handlers.registerMemoryCorpusSupplement ?? noopRegisterMemoryCorpusSupplement,
    registerMemoryFlushPlan: handlers.registerMemoryFlushPlan ?? noopRegisterMemoryFlushPlan,
    registerMemoryRuntime: handlers.registerMemoryRuntime ?? noopRegisterMemoryRuntime,
    registerMemoryEmbeddingProvider:
      handlers.registerMemoryEmbeddingProvider ?? noopRegisterMemoryEmbeddingProvider,
    resolvePath: params.resolvePath,
    on: handlers.on ?? noopOn,
  };
}
