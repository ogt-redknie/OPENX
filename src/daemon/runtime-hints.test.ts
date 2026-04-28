import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          OPNEX_STATE_DIR: "/tmp/opnex-state",
          OPNEX_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "opnex-gateway",
        windowsTaskName: "OPNEX Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/opnex-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/opnex-state/logs/gateway.err.log",
      "Restart attempts: /tmp/opnex-state/logs/gateway-restart.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        env: {
          OPNEX_STATE_DIR: "/tmp/opnex-state",
        },
        systemdServiceName: "opnex-gateway",
        windowsTaskName: "OPNEX Gateway",
      }),
    ).toEqual([
      "Logs: journalctl --user -u opnex-gateway.service -n 200 --no-pager",
      "Restart attempts: /tmp/opnex-state/logs/gateway-restart.log",
    ]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        env: {
          OPNEX_STATE_DIR: "/tmp/opnex-state",
        },
        systemdServiceName: "opnex-gateway",
        windowsTaskName: "OPNEX Gateway",
      }),
    ).toEqual([
      'Logs: schtasks /Query /TN "OPNEX Gateway" /V /FO LIST',
      "Restart attempts: /tmp/opnex-state/logs/gateway-restart.log",
    ]);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "opnex gateway install",
        startCommand: "opnex gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.opnex.gateway.plist",
        systemdServiceName: "opnex-gateway",
        windowsTaskName: "OPNEX Gateway",
      }),
    ).toEqual([
      "opnex gateway install",
      "opnex gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.opnex.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "opnex gateway install",
        startCommand: "opnex gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.opnex.gateway.plist",
        systemdServiceName: "opnex-gateway",
        windowsTaskName: "OPNEX Gateway",
      }),
    ).toEqual([
      "opnex gateway install",
      "opnex gateway",
      "systemctl --user start opnex-gateway.service",
    ]);
  });
});
