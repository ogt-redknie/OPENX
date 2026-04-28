package ai.opnex.app.node

import ai.opnex.app.protocol.OPNEXCalendarCommand
import ai.opnex.app.protocol.OPNEXCallLogCommand
import ai.opnex.app.protocol.OPNEXCameraCommand
import ai.opnex.app.protocol.OPNEXCapability
import ai.opnex.app.protocol.OPNEXContactsCommand
import ai.opnex.app.protocol.OPNEXDeviceCommand
import ai.opnex.app.protocol.OPNEXLocationCommand
import ai.opnex.app.protocol.OPNEXMotionCommand
import ai.opnex.app.protocol.OPNEXNotificationsCommand
import ai.opnex.app.protocol.OPNEXPhotosCommand
import ai.opnex.app.protocol.OPNEXSmsCommand
import ai.opnex.app.protocol.OPNEXSystemCommand
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      OPNEXCapability.Canvas.rawValue,
      OPNEXCapability.Device.rawValue,
      OPNEXCapability.Notifications.rawValue,
      OPNEXCapability.System.rawValue,
      OPNEXCapability.Photos.rawValue,
      OPNEXCapability.Contacts.rawValue,
      OPNEXCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      OPNEXCapability.Camera.rawValue,
      OPNEXCapability.Location.rawValue,
      OPNEXCapability.Sms.rawValue,
      OPNEXCapability.CallLog.rawValue,
      OPNEXCapability.VoiceWake.rawValue,
      OPNEXCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      OPNEXDeviceCommand.Status.rawValue,
      OPNEXDeviceCommand.Info.rawValue,
      OPNEXDeviceCommand.Permissions.rawValue,
      OPNEXDeviceCommand.Health.rawValue,
      OPNEXNotificationsCommand.List.rawValue,
      OPNEXNotificationsCommand.Actions.rawValue,
      OPNEXSystemCommand.Notify.rawValue,
      OPNEXPhotosCommand.Latest.rawValue,
      OPNEXContactsCommand.Search.rawValue,
      OPNEXContactsCommand.Add.rawValue,
      OPNEXCalendarCommand.Events.rawValue,
      OPNEXCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      OPNEXCameraCommand.Snap.rawValue,
      OPNEXCameraCommand.Clip.rawValue,
      OPNEXCameraCommand.List.rawValue,
      OPNEXLocationCommand.Get.rawValue,
      OPNEXMotionCommand.Activity.rawValue,
      OPNEXMotionCommand.Pedometer.rawValue,
      OPNEXSmsCommand.Send.rawValue,
      OPNEXSmsCommand.Search.rawValue,
      OPNEXCallLogCommand.Search.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          smsSearchPossible = true,
          callLogAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          smsSearchPossible = true,
          callLogAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          sendSmsAvailable = false,
          readSmsAvailable = false,
          smsSearchPossible = false,
          callLogAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(OPNEXMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(OPNEXMotionCommand.Pedometer.rawValue))
  }

  @Test
  fun advertisedCommands_splitsSmsSendAndSearchAvailability() {
    val readOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(readSmsAvailable = true, smsSearchPossible = true),
      )
    val sendOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(sendSmsAvailable = true),
      )
    val requestableSearchCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(smsSearchPossible = true),
      )

    assertTrue(readOnlyCommands.contains(OPNEXSmsCommand.Search.rawValue))
    assertFalse(readOnlyCommands.contains(OPNEXSmsCommand.Send.rawValue))
    assertTrue(sendOnlyCommands.contains(OPNEXSmsCommand.Send.rawValue))
    assertFalse(sendOnlyCommands.contains(OPNEXSmsCommand.Search.rawValue))
    assertTrue(requestableSearchCommands.contains(OPNEXSmsCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_includeSmsWhenEitherSmsPathIsAvailable() {
    val readOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(sendSmsAvailable = true),
      )
    val requestableSearchCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(smsSearchPossible = true),
      )

    assertTrue(readOnlyCapabilities.contains(OPNEXCapability.Sms.rawValue))
    assertTrue(sendOnlyCapabilities.contains(OPNEXCapability.Sms.rawValue))
    assertFalse(requestableSearchCapabilities.contains(OPNEXCapability.Sms.rawValue))
  }

  @Test
  fun advertisedCommands_excludesCallLogWhenUnavailable() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(callLogAvailable = false))

    assertFalse(commands.contains(OPNEXCallLogCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_excludesCallLogWhenUnavailable() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(callLogAvailable = false))

    assertFalse(capabilities.contains(OPNEXCapability.CallLog.rawValue))
  }

  @Test
  fun advertisedCapabilities_includesVoiceWakeWithoutAdvertisingCommands() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(voiceWakeEnabled = true))
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(voiceWakeEnabled = true))

    assertTrue(capabilities.contains(OPNEXCapability.VoiceWake.rawValue))
    assertFalse(commands.any { it.contains("voice", ignoreCase = true) })
  }

  @Test
  fun find_returnsForegroundMetadataForCameraCommands() {
    val list = InvokeCommandRegistry.find(OPNEXCameraCommand.List.rawValue)
    val location = InvokeCommandRegistry.find(OPNEXLocationCommand.Get.rawValue)

    assertNotNull(list)
    assertEquals(true, list?.requiresForeground)
    assertNotNull(location)
    assertEquals(false, location?.requiresForeground)
  }

  @Test
  fun find_returnsNullForUnknownCommand() {
    assertNull(InvokeCommandRegistry.find("not.real"))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    sendSmsAvailable: Boolean = false,
    readSmsAvailable: Boolean = false,
    smsSearchPossible: Boolean = false,
    callLogAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      sendSmsAvailable = sendSmsAvailable,
      readSmsAvailable = readSmsAvailable,
      smsSearchPossible = smsSearchPossible,
      callLogAvailable = callLogAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(
    actual: List<String>,
    expected: Set<String>,
  ) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(
    actual: List<String>,
    forbidden: Set<String>,
  ) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
