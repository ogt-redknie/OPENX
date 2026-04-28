/** Root OPNEX configuration Zod schema — the full `opnex.json` shape. */
export { OPNEXSchema } from "../config/zod-schema.js";
export { validateJsonSchemaValue } from "../plugins/schema-validator.js";
export type { JsonSchemaObject } from "../shared/json-schema.types.js";
