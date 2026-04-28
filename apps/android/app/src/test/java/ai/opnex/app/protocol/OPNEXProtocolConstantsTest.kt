package ai.opnex.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class OPNEXProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", OPNEXCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", OPNEXCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", OPNEXCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", OPNEXCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", OPNEXCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", OPNEXCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", OPNEXCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", OPNEXCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", OPNEXCapability.Canvas.rawValue)
    assertEquals("camera", OPNEXCapability.Camera.rawValue)
    assertEquals("voiceWake", OPNEXCapability.VoiceWake.rawValue)
    assertEquals("location", OPNEXCapability.Location.rawValue)
    assertEquals("sms", OPNEXCapability.Sms.rawValue)
    assertEquals("device", OPNEXCapability.Device.rawValue)
    assertEquals("notifications", OPNEXCapability.Notifications.rawValue)
    assertEquals("system", OPNEXCapability.System.rawValue)
    assertEquals("photos", OPNEXCapability.Photos.rawValue)
    assertEquals("contacts", OPNEXCapability.Contacts.rawValue)
    assertEquals("calendar", OPNEXCapability.Calendar.rawValue)
    assertEquals("motion", OPNEXCapability.Motion.rawValue)
    assertEquals("callLog", OPNEXCapability.CallLog.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", OPNEXCameraCommand.List.rawValue)
    assertEquals("camera.snap", OPNEXCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", OPNEXCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", OPNEXNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", OPNEXNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", OPNEXDeviceCommand.Status.rawValue)
    assertEquals("device.info", OPNEXDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", OPNEXDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", OPNEXDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", OPNEXSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", OPNEXPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", OPNEXContactsCommand.Search.rawValue)
    assertEquals("contacts.add", OPNEXContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", OPNEXCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", OPNEXCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", OPNEXMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", OPNEXMotionCommand.Pedometer.rawValue)
  }

  @Test
  fun smsCommandsUseStableStrings() {
    assertEquals("sms.send", OPNEXSmsCommand.Send.rawValue)
    assertEquals("sms.search", OPNEXSmsCommand.Search.rawValue)
  }

  @Test
  fun callLogCommandsUseStableStrings() {
    assertEquals("callLog.search", OPNEXCallLogCommand.Search.rawValue)
  }
}
