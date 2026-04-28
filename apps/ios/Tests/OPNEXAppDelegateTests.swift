import Testing
@testable import OPNEX

@Suite(.serialized) struct OPNEXAppDelegateTests {
    @Test @MainActor func resolvesRegistryModelBeforeViewTaskAssignsDelegateModel() {
        let registryModel = NodeAppModel()
        OPNEXAppModelRegistry.appModel = registryModel
        defer { OPNEXAppModelRegistry.appModel = nil }

        let delegate = OPNEXAppDelegate()

        #expect(delegate._test_resolvedAppModel() === registryModel)
    }

    @Test @MainActor func prefersExplicitDelegateModelOverRegistryFallback() {
        let registryModel = NodeAppModel()
        let explicitModel = NodeAppModel()
        OPNEXAppModelRegistry.appModel = registryModel
        defer { OPNEXAppModelRegistry.appModel = nil }

        let delegate = OPNEXAppDelegate()
        delegate.appModel = explicitModel

        #expect(delegate._test_resolvedAppModel() === explicitModel)
    }
}
