import chalk, { Chalk } from "chalk";
import { OPNEX_PALETTE } from "./palette.js";

const hasForceColor =
  typeof process.env.FORCE_COLOR === "string" &&
  process.env.FORCE_COLOR.trim().length > 0 &&
  process.env.FORCE_COLOR.trim() !== "0";

const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;

const hex = (value: string) => baseChalk.hex(value);

export const theme = {
  accent: hex(OPNEX_PALETTE.accent),
  accentBright: hex(OPNEX_PALETTE.accentBright),
  accentDim: hex(OPNEX_PALETTE.accentDim),
  info: hex(OPNEX_PALETTE.info),
  success: hex(OPNEX_PALETTE.success),
  warn: hex(OPNEX_PALETTE.warn),
  error: hex(OPNEX_PALETTE.error),
  muted: hex(OPNEX_PALETTE.muted),
  heading: baseChalk.bold.hex(OPNEX_PALETTE.accent),
  command: hex(OPNEX_PALETTE.accentBright),
  option: hex(OPNEX_PALETTE.warn),
} as const;

export const isRich = () => baseChalk.level > 0;

export const colorize = (rich: boolean, color: (value: string) => string, value: string) =>
  rich ? color(value) : value;
