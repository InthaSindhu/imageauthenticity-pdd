package com.imageauth.verifier.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.Notification
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

// ─── Notification Center Screen ───────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationCenterScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var notifications by remember { mutableStateOf<List<Notification>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var markingRead by remember { mutableStateOf(false) }

    fun load() {
        scope.launch {
            loading = true
            try {
                notifications = RetrofitClient.getService().getNotifications()
            } catch (e: Exception) {
                // silently fail
            } finally {
                loading = false
            }
        }
    }

    LaunchedEffect(Unit) { load() }

    val unreadCount = notifications.count { !it.read }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        // Top Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            IconButton(
                onClick = { navController.popBackStack() },
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain)
            }
            Column(modifier = Modifier.align(Alignment.Center)) {
                Text("Notifications", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                if (unreadCount > 0) {
                    Text(
                        "$unreadCount unread",
                        color = PrimaryAccent,
                        fontSize = 12.sp,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                }
            }
            Row(
                modifier = Modifier.align(Alignment.CenterEnd),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                IconButton(onClick = { load() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = TextMuted)
                }
                if (unreadCount > 0) {
                    TextButton(
                        onClick = {
                            scope.launch {
                                markingRead = true
                                try {
                                    RetrofitClient.getService().markNotificationsRead()
                                    notifications = notifications.map { it.copy(read = true) }
                                } catch (_: Exception) {}
                                markingRead = false
                            }
                        },
                        enabled = !markingRead
                    ) {
                        Text(
                            "Mark All",
                            color = PrimaryAccent,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        if (loading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimaryAccent)
            }
        } else if (notifications.isEmpty()) {
            // Empty State
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                        modifier = Modifier
                            .size(96.dp)
                            .background(CardBg, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.Notifications,
                            contentDescription = null,
                            tint = TextMuted,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                    Spacer(Modifier.height(20.dp))
                    Text("No Notifications", color = TextMain, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "You're all caught up! Notifications\nappear here after each scan.",
                        color = TextMuted,
                        fontSize = 14.sp,
                        lineHeight = 22.sp,
                        modifier = Modifier.padding(horizontal = 32.dp)
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(notifications, key = { it.id }) { notification ->
                    NotificationCard(notification)
                }
            }
        }
    }
}

@Composable
private fun NotificationCard(notification: Notification) {
    val (iconVec, iconBg, iconTint) = when (notification.type) {
        "success" -> Triple(Icons.Default.CheckCircle, GreenAuthentic.copy(0.15f), GreenAuthentic)
        "warning" -> Triple(Icons.Default.Warning, OrangeUncertain.copy(0.15f), OrangeUncertain)
        "error"   -> Triple(Icons.Default.Cancel, RedFake.copy(0.15f), RedFake)
        else      -> Triple(Icons.Default.Info, BlueInfo.copy(0.15f), BlueInfo)
    }

    val cardBorder = if (!notification.read) PrimaryAccent.copy(0.4f) else CardBgLight
    val cardBg     = if (!notification.read) CardBg.copy(alpha = 0.9f) else CardBg

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = cardBg),
        border = androidx.compose.foundation.BorderStroke(1.dp, cardBorder)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(iconBg, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(iconVec, contentDescription = null, tint = iconTint, modifier = Modifier.size(24.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        notification.title,
                        color = TextMain,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.weight(1f)
                    )
                    if (!notification.read) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(BlueInfo, CircleShape)
                        )
                    }
                }
                Spacer(Modifier.height(4.dp))
                Text(notification.description, color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp)
                Spacer(Modifier.height(6.dp))
                Text(notification.time, color = TextDim, fontSize = 11.sp)
            }
        }
    }
}

// ─── Scan Completed Notification (full-screen card) ──────────────────────────
@Composable
fun ScanCompletedNotificationScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardBg)
        ) {
            Column(
                modifier = Modifier.padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(GreenAuthentic.copy(0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = GreenAuthentic,
                        modifier = Modifier.size(40.dp)
                    )
                }
                Spacer(Modifier.height(16.dp))
                Text("Scan Completed", color = TextMain, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Your image has been successfully analyzed. Tap below to view the full report.",
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(24.dp))
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = GreenAuthentic.copy(0.1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Result", color = TextMuted, fontSize = 14.sp)
                        Text("Authentic", color = GreenAuthentic, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(Modifier.height(8.dp))
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = GreenAuthentic.copy(0.1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Confidence", color = TextMuted, fontSize = 14.sp)
                        Text("94%", color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = { navController.navigate("result") },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GreenAuthentic),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("View Result", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Spacer(Modifier.height(12.dp))
                TextButton(onClick = { navController.popBackStack() }) {
                    Text("Dismiss", color = TextMuted)
                }
            }
        }
    }
}

// ─── Scan Warning Notification (full-screen card) ────────────────────────────
@Composable
fun ScanWarningNotificationScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = CardBg)
        ) {
            Column(
                modifier = Modifier.padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(OrangeUncertain.copy(0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Warning,
                        contentDescription = null,
                        tint = OrangeUncertain,
                        modifier = Modifier.size(40.dp)
                    )
                }
                Spacer(Modifier.height(16.dp))
                Text("Suspicious Image Detected", color = TextMain, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Our AI system has detected potential manipulation indicators in your uploaded image.",
                    color = TextMuted,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(Modifier.height(16.dp))
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = OrangeUncertain.copy(0.1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("Warning Indicators", color = OrangeUncertain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        Spacer(Modifier.height(8.dp))
                        listOf("Metadata inconsistency detected", "Compression artifacts found").forEach { indicator ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(vertical = 3.dp)
                            ) {
                                Box(Modifier.size(6.dp).background(OrangeUncertain, CircleShape))
                                Spacer(Modifier.width(8.dp))
                                Text(indicator, color = TextMuted, fontSize = 13.sp)
                            }
                        }
                    }
                }
                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = { navController.navigate("result") },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = OrangeUncertain),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Review Result", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Spacer(Modifier.height(12.dp))
                TextButton(onClick = { navController.popBackStack() }) {
                    Text("Dismiss", color = TextMuted)
                }
            }
        }
    }
}
