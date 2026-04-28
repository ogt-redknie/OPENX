import Foundation
import OPNEXKit
import Testing
@testable import OPNEX

struct MacNodeModeCoordinatorTests {
    @Test func `remote mode does not advertise browser proxy`() {
        let caps = MacNodeModeCoordinator.resolvedCaps(
            browserControlEnabled: true,
            cameraEnabled: false,
            locationMode: .off,
            connectionMode: .remote)
        let commands = MacNodeModeCoordinator.resolvedCommands(caps: caps)

        #expect(!caps.contains(OPNEXCapability.browser.rawValue))
        #expect(!commands.contains(OPNEXBrowserCommand.proxy.rawValue))
        #expect(commands.contains(OPNEXCanvasCommand.present.rawValue))
        #expect(commands.contains(OPNEXSystemCommand.notify.rawValue))
    }

    @Test func `local mode advertises browser proxy when enabled`() {
        let caps = MacNodeModeCoordinator.resolvedCaps(
            browserControlEnabled: true,
            cameraEnabled: false,
            locationMode: .off,
            connectionMode: .local)
        let commands = MacNodeModeCoordinator.resolvedCommands(caps: caps)

        #expect(caps.contains(OPNEXCapability.browser.rawValue))
        #expect(commands.contains(OPNEXBrowserCommand.proxy.rawValue))
    }
}
