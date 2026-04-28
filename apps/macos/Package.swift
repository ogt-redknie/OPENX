// swift-tools-version: 6.2
// Package manifest for the OPNEX macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "OPNEX",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "OPNEXIPC", targets: ["OPNEXIPC"]),
        .library(name: "OPNEXDiscovery", targets: ["OPNEXDiscovery"]),
        .executable(name: "OPNEX", targets: ["OPNEX"]),
        .executable(name: "opnex-mac", targets: ["OPNEXMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.3.0"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.4.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.10.1"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.9.0"),
        .package(url: "https://github.com/steipete/Peekaboo.git", exact: "3.0.0-beta4"),
        .package(path: "../shared/OPNEXKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "OPNEXIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OPNEXDiscovery",
            dependencies: [
                .product(name: "OPNEXKit", package: "OPNEXKit"),
            ],
            path: "Sources/OPNEXDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OPNEX",
            dependencies: [
                "OPNEXIPC",
                "OPNEXDiscovery",
                .product(name: "OPNEXKit", package: "OPNEXKit"),
                .product(name: "OPNEXChatUI", package: "OPNEXKit"),
                .product(name: "OPNEXProtocol", package: "OPNEXKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/OPNEX.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OPNEXMacCLI",
            dependencies: [
                "OPNEXDiscovery",
                .product(name: "OPNEXKit", package: "OPNEXKit"),
                .product(name: "OPNEXProtocol", package: "OPNEXKit"),
            ],
            path: "Sources/OPNEXMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OPNEXIPCTests",
            dependencies: [
                "OPNEXIPC",
                "OPNEX",
                "OPNEXDiscovery",
                .product(name: "OPNEXProtocol", package: "OPNEXKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
