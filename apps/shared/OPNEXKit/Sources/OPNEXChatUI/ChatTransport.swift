import Foundation

public enum OPNEXChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(OPNEXChatEventPayload)
    case agent(OPNEXAgentEventPayload)
    case seqGap
}

public protocol OPNEXChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> OPNEXChatHistoryPayload
    func listModels() async throws -> [OPNEXChatModelChoice]
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [OPNEXChatAttachmentPayload]) async throws -> OPNEXChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> OPNEXChatSessionsListResponse
    func setSessionModel(sessionKey: String, model: String?) async throws
    func setSessionThinking(sessionKey: String, thinkingLevel: String) async throws

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<OPNEXChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
    func resetSession(sessionKey: String) async throws
    func compactSession(sessionKey: String) async throws
}

extension OPNEXChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func resetSession(sessionKey _: String) async throws {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.reset not supported by this transport"])
    }

    public func compactSession(sessionKey _: String) async throws {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.compact not supported by this transport"])
    }

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> OPNEXChatSessionsListResponse {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }

    public func listModels() async throws -> [OPNEXChatModelChoice] {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "models.list not supported by this transport"])
    }

    public func setSessionModel(sessionKey _: String, model _: String?) async throws {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.patch(model) not supported by this transport"])
    }

    public func setSessionThinking(sessionKey _: String, thinkingLevel _: String) async throws {
        throw NSError(
            domain: "OPNEXChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.patch(thinkingLevel) not supported by this transport"])
    }
}
