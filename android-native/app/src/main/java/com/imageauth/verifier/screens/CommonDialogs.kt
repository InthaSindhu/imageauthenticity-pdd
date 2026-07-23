package com.imageauth.verifier.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

// ─── Generic Error Alert ──────────────────────────────────────────────────────
@Composable
fun ErrorAlertDialog(
    title: String = "Error",
    message: String,
    confirmLabel: String = "OK",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit = onConfirm
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(CardBg, RoundedCornerShape(24.dp))
                .padding(28.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .background(RedFake.copy(alpha = 0.15f), RoundedCornerShape(50))
                        .padding(14.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = null,
                        tint = RedFake,
                        modifier = Modifier.size(32.dp)
                    )
                }
                Spacer(Modifier.height(16.dp))
                Text(
                    text = title,
                    color = TextMain,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = message,
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = onConfirm,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = RedFake),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(confirmLabel, color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────
@Composable
fun DeleteConfirmationDialog(
    itemName: String = "this scan",
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(CardBg, RoundedCornerShape(24.dp))
                .padding(28.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Delete $itemName?",
                    color = TextMain,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = "This action cannot be undone. The scan record will be permanently removed.",
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextMuted),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBgLight)
                    ) {
                        Text("Cancel", color = TextMuted)
                    }
                    Button(
                        onClick = onConfirm,
                        modifier = Modifier.weight(1f).height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = RedFake),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Delete", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ─── Logout Confirmation ──────────────────────────────────────────────────────
@Composable
fun LogoutConfirmationDialog(
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(CardBg, RoundedCornerShape(24.dp))
                .padding(28.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Log Out?",
                    color = TextMain,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = "You'll need to sign in again to access your account and history.",
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBgLight)
                    ) {
                        Text("Cancel", color = TextMuted)
                    }
                    Button(
                        onClick = onConfirm,
                        modifier = Modifier.weight(1f).height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = RedFake),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Log Out", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// ─── Clear History Confirmation ───────────────────────────────────────────────
@Composable
fun ClearHistoryConfirmationDialog(
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .background(CardBg, RoundedCornerShape(24.dp))
                .padding(28.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Clear All History?",
                    color = TextMain,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = "All scan records will be permanently deleted. This cannot be undone.",
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBgLight)
                    ) {
                        Text("Cancel", color = TextMuted)
                    }
                    Button(
                        onClick = onConfirm,
                        modifier = Modifier.weight(1f).height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = RedFake),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Clear All", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
