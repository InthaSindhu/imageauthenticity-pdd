package com.imageauth.verifier.screens

import android.Manifest
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

// ─── Camera Permission Screen ─────────────────────────────────────────────────
@Composable
fun CameraPermissionScreen(navController: NavController) {
    val context = LocalContext.current
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) navController.navigate("upload") { popUpTo("camera_permission") { inclusive = true } }
        else navController.navigate("camera_denied")
    }

    PermissionLayout(
        icon = Icons.Default.CameraAlt,
        iconBg = BlueInfo.copy(0.15f),
        iconTint = BlueInfo,
        title = "Camera Access",
        description = "VerifyImage needs access to your camera to let you take and verify photos directly within the app.",
        benefits = listOf(
            "Take photos instantly for verification",
            "Capture high-resolution images",
            "Quick live scan capability"
        ),
        primaryLabel = "Allow Camera",
        onPrimary = { launcher.launch(Manifest.permission.CAMERA) },
        secondaryLabel = "Not Now",
        onSecondary = { navController.popBackStack() }
    )
}

// ─── Camera Permission Denied Screen ─────────────────────────────────────────
@Composable
fun CameraPermissionDeniedScreen(navController: NavController) {
    val context = LocalContext.current
    PermissionDeniedLayout(
        icon = Icons.Default.NoPhotography,
        iconBg = RedFake.copy(0.12f),
        iconTint = RedFake,
        title = "Camera Permission Denied",
        description = "Camera access was denied. Without it, you can still verify images from your gallery.",
        steps = listOf(
            "Open your device Settings",
            "Navigate to Apps > VerifyImage",
            "Tap Permissions > Camera",
            "Select 'Allow'"
        ),
        primaryLabel = "Open Settings",
        onPrimary = {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.fromParts("package", context.packageName, null)
            }
            context.startActivity(intent)
        },
        secondaryLabel = "Use Gallery Instead",
        onSecondary = { navController.navigate("upload") { popUpTo("camera_denied") { inclusive = true } } }
    )
}

// ─── Storage Permission Screen ────────────────────────────────────────────────
@Composable
fun StoragePermissionScreen(navController: NavController) {
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) navController.navigate("upload") { popUpTo("storage_permission") { inclusive = true } }
        else navController.navigate("storage_denied")
    }

    PermissionLayout(
        icon = Icons.Default.FolderOpen,
        iconBg = GreenAuthentic.copy(0.12f),
        iconTint = GreenAuthentic,
        title = "Gallery Access",
        description = "VerifyImage needs access to your gallery to let you select and verify existing photos.",
        benefits = listOf(
            "Select any image from your gallery",
            "Verify existing photos without re-uploading",
            "Access recent images quickly"
        ),
        primaryLabel = "Allow Gallery Access",
        onPrimary = { launcher.launch(Manifest.permission.READ_MEDIA_IMAGES) },
        secondaryLabel = "Not Now",
        onSecondary = { navController.popBackStack() }
    )
}

// ─── Storage Permission Denied Screen ────────────────────────────────────────
@Composable
fun StoragePermissionDeniedScreen(navController: NavController) {
    val context = LocalContext.current
    PermissionDeniedLayout(
        icon = Icons.Default.FolderOff,
        iconBg = RedFake.copy(0.12f),
        iconTint = RedFake,
        title = "Gallery Permission Denied",
        description = "Gallery access was denied. You can still verify by using the URL upload feature.",
        steps = listOf(
            "Open your device Settings",
            "Navigate to Apps > VerifyImage",
            "Tap Permissions > Photos and Media",
            "Select 'Allow'"
        ),
        primaryLabel = "Open Settings",
        onPrimary = {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.fromParts("package", context.packageName, null)
            }
            context.startActivity(intent)
        },
        secondaryLabel = "Continue Without Access",
        onSecondary = { navController.navigate("home") }
    )
}

// ─── Permissions Overview Screen ──────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PermissionsOverviewScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
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
            Text(
                "App Permissions",
                color = TextMain,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                "VerifyImage requires the following permissions to deliver full functionality:",
                color = TextMuted,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            PermissionCard(
                icon = Icons.Default.CameraAlt,
                iconBg = BlueInfo.copy(0.15f),
                iconTint = BlueInfo,
                title = "Camera",
                description = "Capture photos directly for instant verification.",
                status = "Recommended",
                statusColor = BlueInfo,
                onRequest = { navController.navigate("camera_permission") }
            )

            PermissionCard(
                icon = Icons.Default.FolderOpen,
                iconBg = GreenAuthentic.copy(0.12f),
                iconTint = GreenAuthentic,
                title = "Photo Library",
                description = "Select and verify existing images from your gallery.",
                status = "Required",
                statusColor = RedFake,
                onRequest = { navController.navigate("storage_permission") }
            )

            PermissionCard(
                icon = Icons.Default.Notifications,
                iconBg = PrimaryAccent.copy(0.12f),
                iconTint = PrimaryAccent,
                title = "Notifications",
                description = "Receive alerts when your scan results are ready.",
                status = "Recommended",
                statusColor = OrangeUncertain,
                onRequest = { /* system notification permission */ }
            )
        }
    }
}

@Composable
private fun PermissionCard(
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    description: String,
    status: String,
    statusColor: Color,
    onRequest: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(iconBg, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(24.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(title, color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                    Surface(color = statusColor.copy(0.15f), shape = RoundedCornerShape(20.dp)) {
                        Text(status, color = statusColor, fontSize = 11.sp, fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                    }
                }
                Spacer(Modifier.height(4.dp))
                Text(description, color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp)
                Spacer(Modifier.height(10.dp))
                Button(
                    onClick = onRequest,
                    modifier = Modifier.height(36.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp)
                ) {
                    Text("Request", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

// ─── Onboarding Permissions Screen ────────────────────────────────────────────
@Composable
fun OnboardingPermissionsScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep)))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(40.dp))
        Box(
            modifier = Modifier
                .size(88.dp)
                .background(PrimaryAccent.copy(0.15f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Security, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(44.dp))
        }
        Spacer(Modifier.height(24.dp))
        Text("Quick Setup", color = TextMain, fontSize = 26.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))
        Text(
            "Grant these permissions to unlock the full potential of VerifyImage.",
            color = TextMuted,
            fontSize = 15.sp,
            lineHeight = 22.sp,
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(32.dp))

        listOf(
            Triple(Icons.Default.CameraAlt, "Camera", "Take photos for instant verification"),
            Triple(Icons.Default.PhotoLibrary, "Gallery", "Select existing images"),
            Triple(Icons.Default.Notifications, "Notifications", "Get scan result alerts")
        ).forEach { (icon, label, desc) ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .background(PrimaryAccent.copy(0.12f), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(24.dp))
                }
                Column {
                    Text(label, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                    Text(desc, color = TextMuted, fontSize = 13.sp)
                }
            }
        }

        Spacer(Modifier.weight(1f))
        Button(
            onClick = { navController.navigate("camera_permission") },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("Set Up Permissions", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
        Spacer(Modifier.height(12.dp))
        TextButton(onClick = { navController.navigate("home") }) {
            Text("Skip for Now", color = TextMuted, fontSize = 14.sp)
        }
        Spacer(Modifier.height(16.dp))
    }
}

// ─── Tutorial Onboarding Screen ───────────────────────────────────────────────
@Composable
fun TutorialOnboardingScreen(navController: NavController) {
    var currentPage by remember { mutableStateOf(0) }
    val pages = listOf(
        Triple(Icons.Default.Shield, "Verify Any Image", "Upload a photo from your camera or gallery to instantly check if it's authentic or manipulated."),
        Triple(Icons.Default.Psychology, "AI-Powered Detection", "Our advanced AI analyzes EXIF data, compression artifacts, and deepfake indicators with up to 98% accuracy."),
        Triple(Icons.Default.History, "Track Your History", "All your verification results are saved. Search, filter, and review past scans at any time."),
        Triple(Icons.Default.Share, "Share Results", "Share your verification report via email, messaging apps, or a direct link.")
    )
    val (icon, title, desc) = pages[currentPage]

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep)))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(60.dp))
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .background(PrimaryAccent.copy(0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(60.dp))
            }
            Spacer(Modifier.height(32.dp))
            Text(title, color = TextMain, fontSize = 26.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(Modifier.height(16.dp))
            Text(desc, color = TextMuted, fontSize = 15.sp, lineHeight = 24.sp, textAlign = TextAlign.Center)
            Spacer(Modifier.height(32.dp))
            // Page indicators
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                repeat(pages.size) { index ->
                    val width = if (index == currentPage) 24.dp else 8.dp
                    Box(
                        modifier = Modifier
                            .width(width)
                            .height(8.dp)
                            .background(
                                if (index == currentPage) PrimaryAccent else CardBgLight,
                                RoundedCornerShape(4.dp)
                            )
                    )
                }
            }
            Spacer(Modifier.weight(1f))
            if (currentPage < pages.size - 1) {
                Button(
                    onClick = { currentPage++ },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Next", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Spacer(Modifier.height(12.dp))
                TextButton(onClick = { navController.navigate("home") { popUpTo("tutorial") { inclusive = true } } }) {
                    Text("Skip Tutorial", color = TextMuted)
                }
            } else {
                Button(
                    onClick = { navController.navigate("home") { popUpTo("tutorial") { inclusive = true } } },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Get Started", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── Private helpers ──────────────────────────────────────────────────────────
@Composable
private fun PermissionLayout(
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    description: String,
    benefits: List<String>,
    primaryLabel: String,
    onPrimary: () -> Unit,
    secondaryLabel: String,
    onSecondary: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep))),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(28.dp),
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
            Text(title, color = TextMain, fontSize = 24.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(Modifier.height(12.dp))
            Text(description, color = TextMuted, fontSize = 15.sp, lineHeight = 22.sp, textAlign = TextAlign.Center)
            Spacer(Modifier.height(24.dp))
            benefits.forEach { benefit ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .background(iconTint.copy(0.15f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = iconTint, modifier = Modifier.size(14.dp))
                    }
                    Text(benefit, color = TextMuted, fontSize = 14.sp)
                }
            }
            Spacer(Modifier.height(36.dp))
            Button(
                onClick = onPrimary,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(primaryLabel, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onSecondary) {
                Text(secondaryLabel, color = TextMuted)
            }
        }
    }
}

@Composable
private fun PermissionDeniedLayout(
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    description: String,
    steps: List<String>,
    primaryLabel: String,
    onPrimary: () -> Unit,
    secondaryLabel: String,
    onSecondary: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(DarkBg, DarkBgDeep))),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(28.dp),
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
            Spacer(Modifier.height(20.dp))
            Text(title, color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Spacer(Modifier.height(8.dp))
            Text(description, color = TextMuted, fontSize = 14.sp, lineHeight = 20.sp, textAlign = TextAlign.Center)
            Spacer(Modifier.height(24.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("How to enable:", color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(12.dp))
                    steps.forEachIndexed { i, step ->
                        Row(
                            verticalAlignment = Alignment.Top,
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.padding(vertical = 4.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .background(PrimaryAccent.copy(0.15f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("${i + 1}", color = PrimaryAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                            Text(step, color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp, modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
            Spacer(Modifier.height(28.dp))
            Button(
                onClick = onPrimary,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(primaryLabel, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onSecondary) {
                Text(secondaryLabel, color = TextMuted)
            }
        }
    }
}
