import Foundation

public enum OPNEXScreenCommand: String, Codable, Sendable {
    case snapshot = "screen.snapshot"
    case record = "screen.record"
}

public enum OPNEXScreenSnapshotFormat: String, Codable, Sendable {
    case jpeg
    case png
}

public struct OPNEXScreenSnapshotParams: Codable, Sendable, Equatable {
    public var screenIndex: Int?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: OPNEXScreenSnapshotFormat?

    public init(
        screenIndex: Int? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: OPNEXScreenSnapshotFormat? = nil)
    {
        self.screenIndex = screenIndex
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
    }
}

public struct OPNEXScreenRecordParams: Codable, Sendable, Equatable {
    public var screenIndex: Int?
    public var durationMs: Int?
    public var fps: Double?
    public var format: String?
    public var includeAudio: Bool?

    public init(
        screenIndex: Int? = nil,
        durationMs: Int? = nil,
        fps: Double? = nil,
        format: String? = nil,
        includeAudio: Bool? = nil)
    {
        self.screenIndex = screenIndex
        self.durationMs = durationMs
        self.fps = fps
        self.format = format
        self.includeAudio = includeAudio
    }
}
