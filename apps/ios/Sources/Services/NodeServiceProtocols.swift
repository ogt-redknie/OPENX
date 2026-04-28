import CoreLocation
import Foundation
import OPNEXKit
import UIKit

typealias OPNEXCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias OPNEXCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: OPNEXCameraSnapParams) async throws -> OPNEXCameraSnapResult
    func clip(params: OPNEXCameraClipParams) async throws -> OPNEXCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: OPNEXLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: OPNEXLocationGetParams,
        desiredAccuracy: OPNEXLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: OPNEXLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> OPNEXDeviceStatusPayload
    func info() -> OPNEXDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: OPNEXPhotosLatestParams) async throws -> OPNEXPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: OPNEXContactsSearchParams) async throws -> OPNEXContactsSearchPayload
    func add(params: OPNEXContactsAddParams) async throws -> OPNEXContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: OPNEXCalendarEventsParams) async throws -> OPNEXCalendarEventsPayload
    func add(params: OPNEXCalendarAddParams) async throws -> OPNEXCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: OPNEXRemindersListParams) async throws -> OPNEXRemindersListPayload
    func add(params: OPNEXRemindersAddParams) async throws -> OPNEXRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: OPNEXMotionActivityParams) async throws -> OPNEXMotionActivityPayload
    func pedometer(params: OPNEXPedometerParams) async throws -> OPNEXPedometerPayload
}

struct WatchMessagingStatus: Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchExecApprovalResolveEvent: Equatable {
    var replyId: String
    var approvalId: String
    var decision: OPNEXWatchExecApprovalDecision
    var sentAtMs: Int?
    var transport: String
}

struct WatchExecApprovalSnapshotRequestEvent: Equatable {
    var requestId: String
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setStatusHandler(_ handler: (@Sendable (WatchMessagingStatus) -> Void)?)
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func setExecApprovalResolveHandler(_ handler: (@Sendable (WatchExecApprovalResolveEvent) -> Void)?)
    func setExecApprovalSnapshotRequestHandler(
        _ handler: (@Sendable (WatchExecApprovalSnapshotRequestEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: OPNEXWatchNotifyParams) async throws -> WatchNotificationSendResult
    func sendExecApprovalPrompt(
        _ message: OPNEXWatchExecApprovalPromptMessage) async throws -> WatchNotificationSendResult
    func sendExecApprovalResolved(
        _ message: OPNEXWatchExecApprovalResolvedMessage) async throws -> WatchNotificationSendResult
    func sendExecApprovalExpired(
        _ message: OPNEXWatchExecApprovalExpiredMessage) async throws -> WatchNotificationSendResult
    func syncExecApprovalSnapshot(
        _ message: OPNEXWatchExecApprovalSnapshotMessage) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
