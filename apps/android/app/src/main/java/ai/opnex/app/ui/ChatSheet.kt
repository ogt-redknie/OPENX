package ai.opnex.app.ui

import ai.opnex.app.MainViewModel
import ai.opnex.app.ui.chat.ChatSheetContent
import androidx.compose.runtime.Composable

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
