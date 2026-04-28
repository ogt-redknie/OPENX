import ActivityKit
import Foundation

/// Shared schema used by iOS app + Live Activity widget extension.
struct OPNEXActivityAttributes: ActivityAttributes {
    var agentName: String
    var sessionKey: String

    struct ContentState: Codable, Hashable {
        var statusText: String
        var isIdle: Bool
        var isDisconnected: Bool
        var isConnecting: Bool
        var startedAt: Date
    }
}

#if DEBUG
extension OPNEXActivityAttributes {
    static let preview = OPNEXActivityAttributes(agentName: "main", sessionKey: "main")
}

extension OPNEXActivityAttributes.ContentState {
    static let connecting = OPNEXActivityAttributes.ContentState(
        statusText: "Connecting...",
        isIdle: false,
        isDisconnected: false,
        isConnecting: true,
        startedAt: .now)

    static let idle = OPNEXActivityAttributes.ContentState(
        statusText: "Idle",
        isIdle: true,
        isDisconnected: false,
        isConnecting: false,
        startedAt: .now)

    static let disconnected = OPNEXActivityAttributes.ContentState(
        statusText: "Disconnected",
        isIdle: false,
        isDisconnected: true,
        isConnecting: false,
        startedAt: .now)
}
#endif
