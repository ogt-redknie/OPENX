import { importFreshModule } from "opnex/plugin-sdk/test-fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";

type LoggerModule = typeof import("./logger.js");

const originalGetBuiltinModule = (
  process as NodeJS.Process & { getBuiltinModule?: (id: string) => unknown }
).getBuiltinModule;

async function importBrowserSafeLogger(params?: {
  resolvePreferredOPNEXTmpDir?: ReturnType<typeof vi.fn>;
}): Promise<{
  module: LoggerModule;
  resolvePreferredOPNEXTmpDir: ReturnType<typeof vi.fn>;
}> {
  const resolvePreferredOPNEXTmpDir =
    params?.resolvePreferredOPNEXTmpDir ??
    vi.fn(() => {
      throw new Error("resolvePreferredOPNEXTmpDir should not run during browser-safe import");
    });

  vi.doMock("../infra/tmp-opnex-dir.js", async () => {
    const actual = await vi.importActual<typeof import("../infra/tmp-opnex-dir.js")>(
      "../infra/tmp-opnex-dir.js",
    );
    return {
      ...actual,
      resolvePreferredOPNEXTmpDir,
    };
  });

  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });

  const module = await importFreshModule<LoggerModule>(
    import.meta.url,
    "./logger.js?scope=browser-safe",
  );
  return { module, resolvePreferredOPNEXTmpDir };
}

describe("logging/logger browser-safe import", () => {
  afterEach(() => {
    vi.doUnmock("../infra/tmp-opnex-dir.js");
    Object.defineProperty(process, "getBuiltinModule", {
      configurable: true,
      value: originalGetBuiltinModule,
    });
  });

  it("does not resolve the preferred temp dir at import time when node fs is unavailable", async () => {
    const { module, resolvePreferredOPNEXTmpDir } = await importBrowserSafeLogger();

    expect(resolvePreferredOPNEXTmpDir).not.toHaveBeenCalled();
    expect(module.DEFAULT_LOG_DIR).toBe("/tmp/opnex");
    expect(module.DEFAULT_LOG_FILE).toBe("/tmp/opnex/opnex.log");
  });

  it("disables file logging when imported in a browser-like environment", async () => {
    const { module, resolvePreferredOPNEXTmpDir } = await importBrowserSafeLogger();

    expect(module.getResolvedLoggerSettings()).toMatchObject({
      level: "silent",
      file: "/tmp/opnex/opnex.log",
    });
    expect(module.isFileLogLevelEnabled("info")).toBe(false);
    expect(() => module.getLogger().info("browser-safe")).not.toThrow();
    expect(resolvePreferredOPNEXTmpDir).not.toHaveBeenCalled();
  });
});
