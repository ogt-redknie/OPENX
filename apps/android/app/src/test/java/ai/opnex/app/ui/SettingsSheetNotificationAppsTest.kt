package ai.opnex.app.ui

import org.junit.Assert.assertEquals
import org.junit.Test

class SettingsSheetNotificationAppsTest {
  @Test
  fun resolveNotificationCandidatePackages_keepsConfiguredPackagesVisible() {
    val packages =
      resolveNotificationCandidatePackages(
        launcherPackages = setOf("com.example.launcher"),
        recentPackages = listOf("com.example.recent", "com.example.launcher"),
        configuredPackages = setOf("com.example.configured"),
        appPackageName = "ai.opnex.app",
      )

    assertEquals(
      setOf("com.example.launcher", "com.example.recent", "com.example.configured"),
      packages,
    )
  }

  @Test
  fun resolveNotificationCandidatePackages_filtersBlankAndSelfPackages() {
    val packages =
      resolveNotificationCandidatePackages(
        launcherPackages = setOf(" ", "ai.opnex.app"),
        recentPackages = listOf("com.example.recent", "  "),
        configuredPackages = setOf("ai.opnex.app", "com.example.configured"),
        appPackageName = "ai.opnex.app",
      )

    assertEquals(setOf("com.example.recent", "com.example.configured"), packages)
  }
}
