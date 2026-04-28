import Foundation

public enum OPNEXCalendarCommand: String, Codable, Sendable {
    case events = "calendar.events"
    case add = "calendar.add"
}

public typealias OPNEXCalendarEventsParams = OPNEXDateRangeLimitParams

public struct OPNEXCalendarAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var startISO: String
    public var endISO: String
    public var isAllDay: Bool?
    public var location: String?
    public var notes: String?
    public var calendarId: String?
    public var calendarTitle: String?

    public init(
        title: String,
        startISO: String,
        endISO: String,
        isAllDay: Bool? = nil,
        location: String? = nil,
        notes: String? = nil,
        calendarId: String? = nil,
        calendarTitle: String? = nil)
    {
        self.title = title
        self.startISO = startISO
        self.endISO = endISO
        self.isAllDay = isAllDay
        self.location = location
        self.notes = notes
        self.calendarId = calendarId
        self.calendarTitle = calendarTitle
    }
}

public struct OPNEXCalendarEventPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var startISO: String
    public var endISO: String
    public var isAllDay: Bool
    public var location: String?
    public var calendarTitle: String?

    public init(
        identifier: String,
        title: String,
        startISO: String,
        endISO: String,
        isAllDay: Bool,
        location: String? = nil,
        calendarTitle: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.startISO = startISO
        self.endISO = endISO
        self.isAllDay = isAllDay
        self.location = location
        self.calendarTitle = calendarTitle
    }
}

public struct OPNEXCalendarEventsPayload: Codable, Sendable, Equatable {
    public var events: [OPNEXCalendarEventPayload]

    public init(events: [OPNEXCalendarEventPayload]) {
        self.events = events
    }
}

public struct OPNEXCalendarAddPayload: Codable, Sendable, Equatable {
    public var event: OPNEXCalendarEventPayload

    public init(event: OPNEXCalendarEventPayload) {
        self.event = event
    }
}
