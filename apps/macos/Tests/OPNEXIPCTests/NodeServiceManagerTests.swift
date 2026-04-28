import Foundation
import Testing
@testable import OPNEX

@Suite(.serialized) struct NodeServiceManagerTests {
    @Test func `builds node service commands with current CLI shape`() async throws {
        try await TestIsolation.withUserDefaultsValues(["opnex.gatewayProjectRootPath": nil]) {
            let tmp = try makeTempDirForTests()
            CommandResolver.setProjectRoot(tmp.path)

            let opnexPath = tmp.appendingPathComponent("node_modules/.bin/opnex")
            try makeExecutableForTests(at: opnexPath)

            let start = NodeServiceManager._testServiceCommand(["start"])
            #expect(start == [opnexPath.path, "node", "start", "--json"])

            let stop = NodeServiceManager._testServiceCommand(["stop"])
            #expect(stop == [opnexPath.path, "node", "stop", "--json"])
        }
    }
}
