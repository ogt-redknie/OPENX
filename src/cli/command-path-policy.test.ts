import { afterEach, describe, expect, it, vi } from "vitest";
import type { CliCommandCatalogEntry } from "./command-catalog.js";
import {
  resolveCliCatalogCommandPath,
  resolveCliCommandPathPolicy,
  resolveCliNetworkProxyPolicy,
} from "./command-path-policy.js";

describe("command-path-policy", () => {
  afterEach(() => {
    vi.doUnmock("./command-catalog.js");
    vi.resetModules();
  });

  it("resolves status policy with shared startup semantics", () => {
    expect(resolveCliCommandPathPolicy(["status"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "when-suppressed",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: false,
      networkProxy: "bypass",
    });
  });

  it("applies exact overrides after broader channel plugin rules", () => {
    expect(resolveCliCommandPathPolicy(["channels", "send"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "always",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "default",
    });
    expect(resolveCliCommandPathPolicy(["channels", "add"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
    expect(resolveCliCommandPathPolicy(["channels", "status"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: expect.any(Function),
    });
    expect(resolveCliCommandPathPolicy(["channels", "list"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
    expect(resolveCliCommandPathPolicy(["channels", "logs"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
  });

  it("keeps config-only agent commands on config-only startup", () => {
    for (const commandPath of [
      ["agents", "bind"],
      ["agents", "bindings"],
      ["agents", "unbind"],
      ["agents", "set-identity"],
      ["agents", "delete"],
    ]) {
      expect(resolveCliCommandPathPolicy(commandPath)).toEqual({
        bypassConfigGuard: false,
        routeConfigGuard: "never",
        loadPlugins: "never",
        hideBanner: false,
        ensureCliPath: true,
        networkProxy: "bypass",
      });
    }
  });

  it("resolves mixed startup-only rules", () => {
    expect(resolveCliCommandPathPolicy(["configure"])).toEqual({
      bypassConfigGuard: true,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "default",
    });
    expect(resolveCliCommandPathPolicy(["config", "validate"])).toEqual({
      bypassConfigGuard: true,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
    expect(resolveCliCommandPathPolicy(["gateway", "status"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "always",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
    expect(resolveCliCommandPathPolicy(["plugins", "update"])).toEqual({
      bypassConfigGuard: false,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: true,
      ensureCliPath: true,
      networkProxy: "default",
    });
    for (const commandPath of [
      ["plugins", "install"],
      ["plugins", "list"],
      ["plugins", "inspect"],
      ["plugins", "registry"],
      ["plugins", "doctor"],
    ]) {
      expect(resolveCliCommandPathPolicy(commandPath)).toEqual({
        bypassConfigGuard: false,
        routeConfigGuard: "never",
        loadPlugins: "never",
        hideBanner: false,
        ensureCliPath: true,
        networkProxy: "default",
      });
    }
    expect(resolveCliCommandPathPolicy(["cron", "list"])).toEqual({
      bypassConfigGuard: true,
      routeConfigGuard: "never",
      loadPlugins: "never",
      hideBanner: false,
      ensureCliPath: true,
      networkProxy: "bypass",
    });
  });

  it("defaults unknown command paths to network proxy routing", () => {
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "googlemeet", "login"])).toBe(
      "default",
    );
  });

  it("resolves static network proxy bypass policies from the catalog", () => {
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "status"])).toBe("bypass");
    expect(
      resolveCliNetworkProxyPolicy(["node", "opnex", "config", "get", "proxy.enabled"]),
    ).toBe("bypass");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "proxy", "start"])).toBe("bypass");
  });

  it("resolves mixed network proxy policies from argv-sensitive catalog entries", () => {
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "gateway"])).toBe("default");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "gateway", "run"])).toBe("default");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "gateway", "health"])).toBe("bypass");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "node", "run"])).toBe("default");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "node", "status"])).toBe("bypass");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "agent", "--local"])).toBe("default");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "agent", "run"])).toBe("bypass");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "channels", "status"])).toBe("bypass");
    expect(
      resolveCliNetworkProxyPolicy(["node", "opnex", "channels", "status", "--probe"]),
    ).toBe("default");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "models", "status"])).toBe("bypass");
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "models", "status", "--probe"])).toBe(
      "default",
    );
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "skills", "info", "browser"])).toBe(
      "bypass",
    );
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "skills", "search", "browser"])).toBe(
      "default",
    );
  });

  it("uses the longest catalog command path for deep network proxy overrides", async () => {
    const catalog: readonly CliCommandCatalogEntry[] = [
      { commandPath: ["nodes"], policy: { networkProxy: "bypass" } },
      {
        commandPath: ["nodes", "camera", "snap"],
        exact: true,
        policy: { networkProxy: "default" },
      },
    ];

    vi.resetModules();
    vi.doMock("./command-catalog.js", async (importOriginal) => {
      const actual = await importOriginal<typeof import("./command-catalog.js")>();
      return { ...actual, cliCommandCatalog: catalog };
    });
    const { resolveCliCatalogCommandPath, resolveCliNetworkProxyPolicy } =
      await import("./command-path-policy.js");

    expect(resolveCliCatalogCommandPath(["node", "opnex", "nodes", "camera", "snap"])).toEqual([
      "nodes",
      "camera",
      "snap",
    ]);
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "nodes", "camera", "snap"])).toBe(
      "default",
    );
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "nodes", "camera", "list"])).toBe(
      "bypass",
    );
  });

  it("stops catalog command path resolution before positional arguments", () => {
    expect(
      resolveCliCatalogCommandPath(["node", "opnex", "config", "get", "proxy.enabled"]),
    ).toEqual(["config", "get"]);
    expect(
      resolveCliCatalogCommandPath(["node", "opnex", "message", "send", "--to", "demo"]),
    ).toEqual(["message"]);
  });

  it("treats bare gateway invocations with options as the gateway runtime", () => {
    const argv = ["node", "opnex", "gateway", "--port", "1234"];

    expect(resolveCliCatalogCommandPath(argv)).toEqual(["gateway"]);
    expect(resolveCliNetworkProxyPolicy(argv)).toBe("default");
  });

  it("does not let gateway run option values spoof bypass subcommands", () => {
    for (const argv of [
      ["node", "opnex", "gateway", "--token", "status"],
      ["node", "opnex", "gateway", "--token=status"],
      ["node", "opnex", "gateway", "--password", "health"],
      ["node", "opnex", "gateway", "--password-file", "status"],
      ["node", "opnex", "gateway", "--ws-log", "compact"],
    ]) {
      expect(resolveCliCatalogCommandPath(argv), argv.join(" ")).toEqual(["gateway"]);
      expect(resolveCliNetworkProxyPolicy(argv), argv.join(" ")).toBe("default");
    }
  });

  it("still resolves real gateway bypass subcommands after their command token", () => {
    expect(resolveCliCatalogCommandPath(["node", "opnex", "gateway", "status"])).toEqual([
      "gateway",
      "status",
    ]);
    expect(
      resolveCliCatalogCommandPath(["node", "opnex", "gateway", "status", "--token", "secret"]),
    ).toEqual(["gateway", "status"]);
    expect(resolveCliNetworkProxyPolicy(["node", "opnex", "gateway", "status"])).toBe("bypass");
  });
});
