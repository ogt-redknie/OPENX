// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "OPNEXKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "OPNEXProtocol", targets: ["OPNEXProtocol"]),
        .library(name: "OPNEXKit", targets: ["OPNEXKit"]),
        .library(name: "OPNEXChatUI", targets: ["OPNEXChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.1"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "OPNEXProtocol",
            path: "Sources/OPNEXProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OPNEXKit",
            dependencies: [
                "OPNEXProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/OPNEXKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OPNEXChatUI",
            dependencies: [
                "OPNEXKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/OPNEXChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OPNEXKitTests",
            dependencies: ["OPNEXKit", "OPNEXChatUI"],
            path: "Tests/OPNEXKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
