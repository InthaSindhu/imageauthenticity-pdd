package com.imageauth.verifier.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

// ─── Splash Screen ────────────────────────────────────────────────────────────
@Composable
fun SplashScreen(navController: NavController) {
    val infiniteTransition = rememberInfiniteTransition(label = "splash_anim")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(2000)
        navController.navigate("login") {
            popUpTo("splash") { inclusive = true }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(listOf(DarkBg, DarkBgDeep))
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(
                        Brush.radialGradient(listOf(PrimaryAccent.copy(0.3f), Color.Transparent)),
                        CircleShape
                    )
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Shield,
                    contentDescription = null,
                    tint = PrimaryAccent,
                    modifier = Modifier.size(52.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Text(
                "VerifyImage",
                color = TextMain,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(Modifier.height(8.dp))
            Text("Image Authenticity Verification", color = TextMuted, fontSize = 14.sp)
            Spacer(Modifier.height(48.dp))
            CircularProgressIndicator(
                modifier = Modifier.size(32.dp).rotate(rotation),
                color = PrimaryAccent,
                strokeWidth = 3.dp
            )
        }
    }
}

// ─── Demo Navigation Screen (index of all screens) ───────────────────────────
private data class DemoItem(val label: String, val route: String, val icon: ImageVector, val category: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DemoNavigationScreen(navController: NavController) {
    val items = listOf(
        // Auth
        DemoItem("Login", "login", Icons.Default.Login, "Auth"),
        DemoItem("Signup", "signup", Icons.Default.PersonAdd, "Auth"),
        DemoItem("Login Error", "login_error", Icons.Default.ErrorOutline, "Auth"),
        DemoItem("Signup Error", "signup_error", Icons.Default.ErrorOutline, "Auth"),
        // Core
        DemoItem("Home", "home", Icons.Default.Home, "Core"),
        DemoItem("Upload", "upload", Icons.Default.Upload, "Core"),
        DemoItem("Uploading", "uploading", Icons.Default.HourglassEmpty, "Core"),
        DemoItem("Upload Error", "upload_error", Icons.Default.ErrorOutline, "Core"),
        DemoItem("Upload Drag-Over", "upload_drag", Icons.Default.DragHandle, "Core"),
        DemoItem("Processing", "processing", Icons.Default.Analytics, "Core"),
        // Results
        DemoItem("Result (Generic)", "result", Icons.Default.Verified, "Results"),
        DemoItem("Result – Authentic", "result_authentic", Icons.Default.CheckCircle, "Results"),
        DemoItem("Result – Fake", "result_fake", Icons.Default.Cancel, "Results"),
        DemoItem("Result – Uncertain", "result_uncertain", Icons.Default.Help, "Results"),
        DemoItem("Share Result", "share", Icons.Default.Share, "Results"),
        DemoItem("Detailed Analysis", "analysis", Icons.Default.Assessment, "Results"),
        DemoItem("AI Confidence", "confidence", Icons.Default.Psychology, "Results"),
        DemoItem("Image Metadata", "metadata", Icons.Default.DataObject, "Results"),
        DemoItem("Image Comparison", "comparison", Icons.Default.Compare, "Results"),
        // History
        DemoItem("History", "history", Icons.Default.History, "History"),
        DemoItem("History – Empty", "history_empty", Icons.Default.Inbox, "History"),
        DemoItem("History – Loading", "history_loading", Icons.Default.HourglassEmpty, "History"),
        DemoItem("Search & Filter", "search", Icons.Default.Search, "History"),
        DemoItem("Recent Activity", "activity", Icons.Default.Timeline, "History"),
        // Profile & Settings
        DemoItem("Profile", "profile", Icons.Default.Person, "Profile"),
        DemoItem("Edit Profile", "edit_profile", Icons.Default.Edit, "Profile"),
        DemoItem("Change Password", "change_password", Icons.Default.Lock, "Profile"),
        DemoItem("Settings", "settings", Icons.Default.Settings, "Profile"),
        // Permissions
        DemoItem("Camera Permission", "camera_permission", Icons.Default.CameraAlt, "Permissions"),
        DemoItem("Camera Denied", "camera_denied", Icons.Default.NoPhotography, "Permissions"),
        DemoItem("Storage Permission", "storage_permission", Icons.Default.FolderOpen, "Permissions"),
        DemoItem("Storage Denied", "storage_denied", Icons.Default.FolderOff, "Permissions"),
        DemoItem("Permissions Overview", "permissions", Icons.Default.Security, "Permissions"),
        DemoItem("Onboarding Permissions", "onboarding_permissions", Icons.Default.Tune, "Permissions"),
        DemoItem("Tutorial Onboarding", "tutorial", Icons.Default.School, "Permissions"),
        // Notifications
        DemoItem("Notifications", "notifications", Icons.Default.Notifications, "Notifications"),
        DemoItem("Scan Completed Notif.", "notif_scan_completed", Icons.Default.CheckCircle, "Notifications"),
        DemoItem("Scan Warning Notif.", "notif_scan_warning", Icons.Default.Warning, "Notifications"),
        // Dialogs
        DemoItem("Error Alert Dialog", "demo_error_dialog", Icons.Default.ErrorOutline, "Dialogs"),
        DemoItem("Delete Confirm Dialog", "demo_delete_dialog", Icons.Default.DeleteForever, "Dialogs"),
        DemoItem("Logout Confirm Dialog", "demo_logout_dialog", Icons.Default.Logout, "Dialogs"),
        DemoItem("Clear History Dialog", "demo_clear_dialog", Icons.Default.ClearAll, "Dialogs"),
        // Errors
        DemoItem("No Internet", "error_no_internet", Icons.Default.WifiOff, "Errors"),
        DemoItem("Network Error", "error_network", Icons.Default.SignalWifiOff, "Errors"),
        DemoItem("Server Error", "error_server", Icons.Default.Cloud, "Errors"),
        DemoItem("Timeout Error", "error_timeout", Icons.Default.Timer, "Errors"),
        DemoItem("General Error", "error_general", Icons.Default.BugReport, "Errors"),
        DemoItem("Service Unavailable", "error_service", Icons.Default.CloudOff, "Errors"),
        DemoItem("App Update", "app_update", Icons.Default.SystemUpdate, "Errors"),
        // Dashboard
        DemoItem("Dark Mode Home", "dark_mode_home", Icons.Default.DarkMode, "Dashboard"),
        DemoItem("Recent Activity Dashboard", "activity", Icons.Default.Dashboard, "Dashboard"),
        DemoItem("Help & FAQ", "help_faq", Icons.Default.HelpOutline, "Dashboard"),
        DemoItem("Feedback", "feedback", Icons.Default.Feedback, "Dashboard"),
    )

    val grouped = items.groupBy { it.category }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        // Top bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            Text(
                "Screen Navigator",
                color = TextMain,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = PrimaryAccent.copy(0.08f)
        ) {
            Text(
                "All ${items.size} Screens",
                color = TextMuted,
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(8.dp)
            )
        }

        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            grouped.forEach { (category, screenItems) ->
                item {
                    Text(
                        category.uppercase(),
                        color = PrimaryAccent,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp,
                        modifier = Modifier.padding(top = 12.dp, bottom = 4.dp)
                    )
                }
                items(screenItems) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { navController.navigate(item.route) },
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = CardBg)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .background(PrimaryAccent.copy(0.12f), RoundedCornerShape(10.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(item.icon, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(20.dp))
                            }
                            Text(item.label, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Medium)
                            Spacer(Modifier.weight(1f))
                            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = TextDim, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}
