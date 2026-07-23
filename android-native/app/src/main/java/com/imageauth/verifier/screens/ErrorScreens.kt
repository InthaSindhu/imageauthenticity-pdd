package com.imageauth.verifier.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

// ─── Reusable Error Screen Layout ─────────────────────────────────────────────
@Composable
private fun ErrorLayout(
    icon: ImageVector,
    iconTint: Color,
    iconBg: Color,
    title: String,
    description: String,
    primaryLabel: String,
    onPrimary: () -> Unit,
    secondaryLabel: String? = null,
    onSecondary: (() -> Unit)? = null
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep))),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(96.dp)
                    .background(iconBg, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(48.dp))
            }
            Spacer(Modifier.height(24.dp))
            Text(title, color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(Modifier.height(12.dp))
            Text(description, color = TextMuted, fontSize = 15.sp, lineHeight = 22.sp, textAlign = TextAlign.Center)
            Spacer(Modifier.height(36.dp))
            Button(
                onClick = onPrimary,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(primaryLabel, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            if (secondaryLabel != null && onSecondary != null) {
                Spacer(Modifier.height(12.dp))
                TextButton(onClick = onSecondary) {
                    Text(secondaryLabel, color = TextMuted, fontSize = 14.sp)
                }
            }
        }
    }
}

// ─── No Internet Screen ───────────────────────────────────────────────────────
@Composable
fun NoInternetScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.WifiOff,
        iconTint = OrangeUncertain,
        iconBg = OrangeUncertain.copy(0.12f),
        title = "No Internet Connection",
        description = "Please check your Wi-Fi or mobile data connection and try again.",
        primaryLabel = "Try Again",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") { launchSingleTop = true } }
    )
}

// ─── Network Error Screen ─────────────────────────────────────────────────────
@Composable
fun NetworkErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.SignalWifiOff,
        iconTint = RedFake,
        iconBg = RedFake.copy(0.12f),
        title = "Network Error",
        description = "A network error occurred while communicating with the server. Please check your connection.",
        primaryLabel = "Retry",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── Server Error Screen ──────────────────────────────────────────────────────
@Composable
fun ServerErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.Cloud,
        iconTint = RedFake,
        iconBg = RedFake.copy(0.12f),
        title = "Server Error",
        description = "Our servers are having trouble processing your request (500). The team has been notified.",
        primaryLabel = "Try Again",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── Timeout Error Screen ─────────────────────────────────────────────────────
@Composable
fun TimeoutErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.Timer,
        iconTint = OrangeUncertain,
        iconBg = OrangeUncertain.copy(0.12f),
        title = "Request Timed Out",
        description = "The request took too long to complete. This might be due to a slow connection.",
        primaryLabel = "Try Again",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── General Error Screen ─────────────────────────────────────────────────────
@Composable
fun GeneralErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.BugReport,
        iconTint = RedFake,
        iconBg = RedFake.copy(0.12f),
        title = "Something Went Wrong",
        description = "An unexpected error occurred. Please try again, or contact support if the issue persists.",
        primaryLabel = "Go Back",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── Service Unavailable Screen ───────────────────────────────────────────────
@Composable
fun ServiceUnavailableScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.CloudOff,
        iconTint = TextMuted,
        iconBg = TextMuted.copy(0.12f),
        title = "Service Unavailable",
        description = "The image verification service is temporarily offline for maintenance. Please try again shortly.",
        primaryLabel = "Refresh",
        onPrimary = { navController.popBackStack() },
        secondaryLabel = "Go Home",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── App Update Screen ────────────────────────────────────────────────────────
@Composable
fun AppUpdateScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep))),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(96.dp)
                    .background(PrimaryAccent.copy(0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.SystemUpdate, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(48.dp))
            }
            Spacer(Modifier.height(24.dp))
            Text("Update Available", color = TextMain, fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Surface(
                color = PrimaryAccent.copy(0.12f),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text("Version 2.0.0", color = PrimaryAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp))
            }
            Spacer(Modifier.height(16.dp))
            Text(
                "A new version of VerifyImage is available with enhanced AI detection and performance improvements.",
                color = TextMuted,
                fontSize = 15.sp,
                lineHeight = 22.sp,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(32.dp))
            // Update highlights
            listOf(
                "Improved AI deepfake detection accuracy",
                "Faster image processing engine",
                "New EXIF metadata viewer",
                "Bug fixes and stability improvements"
            ).forEach { feature ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .background(GreenAuthentic.copy(0.15f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = GreenAuthentic, modifier = Modifier.size(14.dp))
                    }
                    Text(feature, color = TextMuted, fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(36.dp))
            Button(
                onClick = { /* Link to Play Store */ },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(Icons.Default.SystemUpdate, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("Update Now", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = { navController.navigate("home") }) {
                Text("Maybe Later", color = TextMuted, fontSize = 14.sp)
            }
        }
    }
}

// ─── Login Error Screen ───────────────────────────────────────────────────────
@Composable
fun LoginErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.LockOpen,
        iconTint = RedFake,
        iconBg = RedFake.copy(0.12f),
        title = "Authentication Failed",
        description = "Your email or password is incorrect. Please double-check your credentials and try again.",
        primaryLabel = "Try Again",
        onPrimary = { navController.navigate("login") { popUpTo("login") { inclusive = true } } },
        secondaryLabel = "Create Account",
        onSecondary = { navController.navigate("signup") }
    )
}

// ─── Signup Error Screen ──────────────────────────────────────────────────────
@Composable
fun SignupErrorScreen(navController: NavController) {
    ErrorLayout(
        icon = Icons.Default.PersonOff,
        iconTint = RedFake,
        iconBg = RedFake.copy(0.12f),
        title = "Account Creation Failed",
        description = "We couldn't create your account. This email may already be in use, or there was a server error.",
        primaryLabel = "Try Again",
        onPrimary = { navController.navigate("signup") { popUpTo("signup") { inclusive = true } } },
        secondaryLabel = "Sign In Instead",
        onSecondary = { navController.navigate("login") }
    )
}
