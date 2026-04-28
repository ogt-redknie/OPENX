/**
 * Deprecated bundled-channel compatibility surface.
 *
 * OPNEX-maintained bundled plugins should import
 * opnex/plugin-sdk/bundled-channel-config-schema. Third-party plugins should
 * define plugin-local schemas and import primitives from
 * opnex/plugin-sdk/channel-config-schema instead of depending on bundled
 * channel schemas.
 */
export * from "./bundled-channel-config-schema.js";
