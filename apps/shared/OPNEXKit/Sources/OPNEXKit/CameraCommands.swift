import Foundation

public enum OPNEXCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum OPNEXCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum OPNEXCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum OPNEXCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct OPNEXCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: OPNEXCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: OPNEXCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: OPNEXCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: OPNEXCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct OPNEXCameraClipParams: Codable, Sendable, Equatable {
    public var facing: OPNEXCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: OPNEXCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: OPNEXCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: OPNEXCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
