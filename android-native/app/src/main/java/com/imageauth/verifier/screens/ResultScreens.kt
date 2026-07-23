package com.imageauth.verifier.screens

import android.content.Intent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.imageauth.verifier.models.Scan

// ─── Shared Header Banner for Verdict Screens ─────────────────────────────────
@Composable
private fun ResultVerdictHeader(
    scan: Scan?,
    gradientColors: List<Color>,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    predictionLabel: String,
    titleText: String,
    subtitleText: String,
    isInconclusive: Boolean = false,
    navController: NavController
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.linearGradient(gradientColors),
                shape = RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp)
            )
            .padding(horizontal = 20.dp)
            .padding(top = 20.dp, bottom = 48.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // Top Nav Row inside Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { navController.popBackStack() },
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White.copy(0.2f), CircleShape)
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = { navController.navigate("history") },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.White.copy(0.2f), CircleShape)
                    ) {
                        Icon(Icons.Default.History, contentDescription = "History", tint = Color.White)
                    }
                    IconButton(
                        onClick = {
                            val scanId = scan?.id ?: ""
                            navController.navigate("share?id=$scanId")
                        },
                        modifier = Modifier
                            .size(40.dp)
                            .background(Color.White.copy(0.2f), CircleShape)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = "Share", tint = Color.White)
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // Large Circular Icon
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .background(Color.White.copy(0.2f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = Color.White, modifier = Modifier.size(44.dp))
            }

            Spacer(Modifier.height(12.dp))

            // Prediction Pill Badge
            Surface(
                color = Color.White.copy(0.2f),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text(
                    text = predictionLabel.uppercase(),
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 5.dp)
                )
            }

            Spacer(Modifier.height(8.dp))
            Text(titleText, color = Color.White, fontSize = 26.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Text(subtitleText, color = Color.White.copy(0.85f), fontSize = 13.sp)

            Spacer(Modifier.height(20.dp))

            // Glassmorphism Confidence Score Tile
            Surface(
                color = Color.White.copy(0.15f),
                shape = RoundedCornerShape(20.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("${scan?.confidence ?: 55}%", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                        Text("Confidence Score", color = Color.White.copy(0.85f), fontSize = 11.sp)
                    }
                    Box(Modifier.width(1.dp).height(44.dp).background(Color.White.copy(0.3f)))
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(scan?.confidenceTier ?: "Low", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text("Confidence Tier", color = Color.White.copy(0.85f), fontSize = 11.sp)
                    }
                    if (isInconclusive) {
                        Box(Modifier.width(1.dp).height(44.dp).background(Color.White.copy(0.3f)))
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.ErrorOutline, null, tint = Color.White, modifier = Modifier.size(24.dp))
                            Text("Inconclusive", color = Color.White.copy(0.85f), fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

// ─── Result Uncertain Screen ──────────────────────────────────────────────────
@Composable
fun ResultUncertainScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // Hero Amber Gradient Header Banner
        ResultVerdictHeader(
            scan = scan,
            gradientColors = listOf(Color(0xFFF59E0B), Color(0xFFF97316)),
            icon = Icons.Default.HelpOutline,
            predictionLabel = "? Prediction: ${scan?.prediction ?: "Uncertain"}",
            titleText = "Uncertain Result",
            subtitleText = "Unable to determine authenticity with high confidence",
            isInconclusive = true,
            navController = navController
        )

        Column(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Floating Analyzed Image Card
            Box(
                modifier = Modifier
                    .offset(y = (-28).dp)
                    .fillMaxWidth()
                    .shadow(elevation = 6.dp, shape = RoundedCornerShape(24.dp))
                    .background(CardBackground, RoundedCornerShape(24.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(bottom = 12.dp)
                    ) {
                        Icon(Icons.Default.Visibility, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(20.dp))
                        Text("Analyzed Image", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFFFFBEB)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (!scan?.imageUrl.isNullOrEmpty()) {
                            AsyncImage(
                                model = scan!!.imageUrl,
                                contentDescription = "Analyzed image",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Fit
                            )
                        } else {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🖼️", fontSize = 36.sp)
                                Text(scan?.fileName ?: "captured.jpg", color = Color(0xFFD97706), fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            }
                        }
                    }

                    Spacer(Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = TextMuted, modifier = Modifier.size(16.dp))
                            Text(scan?.fileName ?: "photo.jpg", color = TextMuted, fontSize = 13.sp)
                        }
                        Text(scan?.fileSize ?: "1.2 MB", color = TextMuted, fontSize = 13.sp)
                    }
                }
            }

            Spacer(Modifier.height((-16).dp))

            // Why This Result Box
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFBEB)),
                border = BorderStroke(1.dp, Color(0xFFFDE68A))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFFB45309), modifier = Modifier.size(20.dp))
                        Text("Why this result?", color = Color(0xFF78350F), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(6.dp))
                    Text(
                        scan?.explanation ?: "Insufficient forensic evidence. Image may be compressed, scanned, or metadata may be unavailable. The system is unable to determine authenticity with high confidence. Please use a higher-quality image.",
                        color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp
                    )
                }
            }

            // Detection Indicators Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Detection Indicators", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    val items = scan?.indicators ?: listOf(
                        "EXIF Status: Absent (informational only)",
                        "Entropy Contribution: +5% to confidence",
                        "Quality Check: Low resolution or high compression",
                        "Image Quality: Low resolution or high compression"
                    )

                    items.forEach { ind ->
                        val parts = ind.split(":", limit = 2)
                        val label = parts.getOrNull(0)?.trim() ?: ind
                        val value = parts.getOrNull(1)?.trim() ?: "?"

                        Card(
                            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFBEB)),
                            border = BorderStroke(1.dp, Color(0xFFFDE68A))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(18.dp))
                                    Text(label, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                }
                                Text(value, color = Color(0xFFB45309), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // 3 Quick Metrics Cards
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("Confidence", "${scan?.confidence ?: 55}%", Color(0xFFD97706), Modifier.weight(1f))
                MetricCard("Resolution", scan?.resolution ?: "640×480 px", Color(0xFFD97706), Modifier.weight(1f))
                MetricCard("File Size", scan?.fileSize ?: "1.2 MB", Color(0xFFD97706), Modifier.weight(1f))
            }

            // Recommendations Box
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFEFF6FF)),
                border = BorderStroke(1.dp, Color(0xFFBFDBFE))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.HelpOutline, contentDescription = null, tint = Color(0xFF2563EB), modifier = Modifier.size(20.dp))
                        Text("Recommendations", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(10.dp))
                    listOf(
                        "Upload the original, uncompressed image if available (JPEG from camera or RAW format)",
                        "Verify the source of the image through the original device or sender",
                        "Use caution when relying on this image for important or legal decisions",
                        "Avoid sharing this image without proper source verification"
                    ).forEach { rec ->
                        Row(modifier = Modifier.padding(vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("•", color = Color(0xFF3B82F6), fontWeight = FontWeight.Bold)
                            Text(rec, color = TextMuted, fontSize = 12.sp, lineHeight = 16.sp)
                        }
                    }
                }
            }

            // More Information Links
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("More Information", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    LinkRow(Icons.Default.Description, Color(0xFF2563EB), "View Metadata", "EXIF & Technical Data →") {
                        navController.navigate("metadata")
                    }
                    HorizontalDivider(color = DividerColor, modifier = Modifier.padding(vertical = 8.dp))
                    LinkRow(Icons.Default.TrendingUp, Color(0xFF7E22CE), "Detailed Analysis Report", "Full Report →") {
                        navController.navigate("analysis")
                    }
                }
            }

            // Action Buttons
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(
                    onClick = { navController.navigate("upload") },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, DividerColor)
                ) {
                    Icon(Icons.Default.Upload, contentDescription = null, tint = TextMain, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Try Better Quality", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }

                OutlinedButton(
                    onClick = { navController.navigate("home") { popUpTo("home") { inclusive = true } } },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, DividerColor)
                ) {
                    Icon(Icons.Default.Home, contentDescription = null, tint = TextMain, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Back to Home", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            // Main Share Results Button
            Button(
                onClick = { navController.navigate("share") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(bottom = 16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF97316)),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.Share, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Share Results", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }
        }
    }
}

// ─── Result Authentic Screen ──────────────────────────────────────────────────
@Composable
fun ResultAuthenticScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // Hero Green Gradient Header Banner
        ResultVerdictHeader(
            scan = scan,
            gradientColors = listOf(Color(0xFF10B981), Color(0xFF059669)),
            icon = Icons.Default.Shield,
            predictionLabel = "✓ Prediction: ${scan?.prediction ?: "Real"} Image",
            titleText = "Authentic Image",
            subtitleText = "This image appears to be genuine and unmodified",
            isInconclusive = false,
            navController = navController
        )

        Column(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Floating Analyzed Image Card
            Box(
                modifier = Modifier
                    .offset(y = (-28).dp)
                    .fillMaxWidth()
                    .shadow(elevation = 6.dp, shape = RoundedCornerShape(24.dp))
                    .background(CardBackground, RoundedCornerShape(24.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(bottom = 12.dp)
                    ) {
                        Icon(Icons.Default.Visibility, contentDescription = null, tint = GreenAuthentic, modifier = Modifier.size(20.dp))
                        Text("Analyzed Image", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFF0FDF4)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (!scan?.imageUrl.isNullOrEmpty()) {
                            AsyncImage(
                                model = scan!!.imageUrl,
                                contentDescription = "Analyzed image",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Fit
                            )
                        } else {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🖼️", fontSize = 36.sp)
                                Text(scan?.fileName ?: "photo.jpg", color = GreenAuthentic, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            }
                        }
                    }

                    Spacer(Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = TextMuted, modifier = Modifier.size(16.dp))
                            Text(scan?.fileName ?: "photo.jpg", color = TextMuted, fontSize = 13.sp)
                        }
                        Text(scan?.fileSize ?: "3.6 MB", color = TextMuted, fontSize = 13.sp)
                    }
                }
            }

            Spacer(Modifier.height((-16).dp))

            // Why This Result Box
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                border = BorderStroke(1.dp, Color(0xFFBBF7D0))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF15803D), modifier = Modifier.size(20.dp))
                        Text("Why this result?", color = Color(0xFF14532D), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(6.dp))
                    Text(
                        scan?.explanation ?: "No significant evidence of digital manipulation detected. EXIF metadata is intact.",
                        color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp
                    )
                }
            }

            // Detection Indicators Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Detection Indicators", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    val items = scan?.indicators ?: listOf(
                        "EXIF Metadata: Valid & Complete",
                        "Camera Hardware: Verified",
                        "Noise Pattern: Natural",
                        "AI Detection: Negative",
                        "Compression: Consistent"
                    )

                    items.forEach { ind ->
                        val parts = ind.split(":", limit = 2)
                        val label = parts.getOrNull(0)?.trim() ?: ind
                        val value = parts.getOrNull(1)?.trim() ?: "✓"

                        Card(
                            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                            border = BorderStroke(1.dp, Color(0xFFBBF7D0))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = GreenAuthentic, modifier = Modifier.size(18.dp))
                                    Text(label, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                }
                                Text(value, color = Color(0xFF15803D), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // 3 Quick Metrics Cards
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("Confidence", "${scan?.confidence ?: 96}%", GreenAuthentic, Modifier.weight(1f))
                MetricCard("Resolution", scan?.resolution ?: "4032×3024", GreenAuthentic, Modifier.weight(1f))
                MetricCard("File Size", scan?.fileSize ?: "3.6 MB", GreenAuthentic, Modifier.weight(1f))
            }

            // Real Classification Criteria
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = GreenAuthentic, modifier = Modifier.size(20.dp))
                        Text("Authentic Classification Criteria", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(10.dp))
                    listOf(
                        "Captured directly by a camera — verified EXIF structures present",
                        "No objects have been added or removed",
                        "No regions have been copied and pasted",
                        "Lighting, shadows, and textures appear natural and consistent"
                    ).forEach { crit ->
                        Row(modifier = Modifier.padding(vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("✓", color = GreenAuthentic, fontWeight = FontWeight.Bold)
                            Text(crit, color = TextMuted, fontSize = 12.sp, lineHeight = 16.sp)
                        }
                    }
                }
            }

            // More Information Links
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("More Information", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    LinkRow(Icons.Default.Description, Color(0xFF2563EB), "View Metadata", "EXIF & Technical Data →") {
                        navController.navigate("metadata")
                    }
                    HorizontalDivider(color = DividerColor, modifier = Modifier.padding(vertical = 8.dp))
                    LinkRow(Icons.Default.TrendingUp, Color(0xFF7E22CE), "Detailed Analysis Report", "Full Report →") {
                        navController.navigate("analysis")
                    }
                }
            }

            // Action Buttons
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(
                    onClick = { navController.navigate("upload") },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, DividerColor)
                ) {
                    Text("Scan Another", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }

                Button(
                    onClick = { navController.navigate("home") { popUpTo("home") { inclusive = true } } },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GreenAuthentic)
                ) {
                    Text("Back to Home", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── Result Fake Screen ───────────────────────────────────────────────────────
@Composable
fun ResultFakeScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // Hero Red Gradient Header Banner
        ResultVerdictHeader(
            scan = scan,
            gradientColors = listOf(Color(0xFFEF4444), Color(0xFFE11D48)),
            icon = Icons.Default.Cancel,
            predictionLabel = "✕ Prediction: ${scan?.prediction ?: "Fake"} Image",
            titleText = "Image Flagged",
            subtitleText = "Manipulation Detected: ${scan?.manipulationType ?: "AI Generated"}",
            isInconclusive = false,
            navController = navController
        )

        Column(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Floating Analyzed Image Card
            Box(
                modifier = Modifier
                    .offset(y = (-28).dp)
                    .fillMaxWidth()
                    .shadow(elevation = 6.dp, shape = RoundedCornerShape(24.dp))
                    .background(CardBackground, RoundedCornerShape(24.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(bottom = 12.dp)
                    ) {
                        Icon(Icons.Default.Visibility, contentDescription = null, tint = RedFake, modifier = Modifier.size(20.dp))
                        Text("Analyzed Image", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color(0xFFFEF2F2)),
                        contentAlignment = Alignment.Center
                    ) {
                        if (!scan?.imageUrl.isNullOrEmpty()) {
                            AsyncImage(
                                model = scan!!.imageUrl,
                                contentDescription = "Analyzed image",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Fit
                            )
                        } else {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🖼️", fontSize = 36.sp)
                                Text(scan?.fileName ?: "photo.jpg", color = RedFake, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            }
                        }
                    }

                    Spacer(Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null, tint = TextMuted, modifier = Modifier.size(16.dp))
                            Text(scan?.fileName ?: "photo.jpg", color = TextMuted, fontSize = 13.sp)
                        }
                        Text(scan?.fileSize ?: "2.4 MB", color = TextMuted, fontSize = 13.sp)
                    }
                }
            }

            Spacer(Modifier.height((-16).dp))

            // Why This Result Box
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                border = BorderStroke(1.dp, Color(0xFFFCA5A5))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFB91C1C), modifier = Modifier.size(20.dp))
                        Text("Why this result?", color = Color(0xFF991B1B), fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(6.dp))
                    Text(
                        scan?.explanation ?: "Digital manipulation signatures detected. Image content contains inconsistencies.",
                        color = TextMuted, fontSize = 13.sp, lineHeight = 18.sp
                    )
                }
            }

            // Detection Indicators Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Detection Indicators", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    val items = scan?.indicators ?: listOf(
                        "Forensic Signal: Generative AI signature detected",
                        "EXIF Status: Absent",
                        "Quality Check: Inconsistent noise variance"
                    )

                    items.forEach { ind ->
                        val parts = ind.split(":", limit = 2)
                        val label = parts.getOrNull(0)?.trim() ?: ind
                        val value = parts.getOrNull(1)?.trim() ?: "Failed"

                        Card(
                            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                            border = BorderStroke(1.dp, Color(0xFFFCA5A5))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Icon(Icons.Default.Cancel, contentDescription = null, tint = RedFake, modifier = Modifier.size(18.dp))
                                    Text(label, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                }
                                Text(value, color = Color(0xFFB91C1C), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // 3 Quick Metrics Cards
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("Confidence", "${scan?.confidence ?: 88}%", RedFake, Modifier.weight(1f))
                MetricCard("Resolution", scan?.resolution ?: "1920×1080", RedFake, Modifier.weight(1f))
                MetricCard("File Size", scan?.fileSize ?: "2.4 MB", RedFake, Modifier.weight(1f))
            }

            // More Information Links
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("More Information", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))

                    LinkRow(Icons.Default.Description, Color(0xFF2563EB), "View Metadata", "EXIF & Technical Data →") {
                        navController.navigate("metadata")
                    }
                    HorizontalDivider(color = DividerColor, modifier = Modifier.padding(vertical = 8.dp))
                    LinkRow(Icons.Default.TrendingUp, Color(0xFF7E22CE), "Detailed Analysis Report", "Full Report →") {
                        navController.navigate("analysis")
                    }
                }
            }

            // Action Buttons
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(
                    onClick = { navController.navigate("upload") },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, DividerColor)
                ) {
                    Text("Scan Another", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }

                Button(
                    onClick = { navController.navigate("home") { popUpTo("home") { inclusive = true } } },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent)
                ) {
                    Text("Back to Home", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── Shared Metric Card ───────────────────────────────────────────────────────
@Composable
private fun MetricCard(label: String, value: String, valueColor: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(vertical = 14.dp, horizontal = 10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, color = valueColor, fontSize = 16.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Default)
            Spacer(Modifier.height(2.dp))
            Text(label, color = TextMuted, fontSize = 11.sp, fontFamily = FontFamily.Default)
        }
    }
}

// ─── Shared Link Row ──────────────────────────────────────────────────────────
@Composable
private fun LinkRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    title: String,
    actionText: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(20.dp))
            Text(title, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Default)
        }
        Text(actionText, color = TextMuted, fontSize = 12.sp, fontFamily = FontFamily.Default)
    }
}

// ─── Share Result Screen ──────────────────────────────────────────────────────
@Composable
fun ShareResultScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan
    val context = LocalContext.current
    var copied by remember { mutableStateOf(false) }

    val prediction    = scan?.prediction    ?: "Authentic"
    val confidence    = scan?.confidence    ?: 94
    val confTier      = scan?.confidenceTier ?: "High"
    val fileName      = scan?.fileName      ?: "image.jpg"
    val fileSize      = scan?.fileSize      ?: "—"
    val resolution    = scan?.resolution    ?: "—"
    val explanation   = scan?.explanation   ?: "No significant manipulation artifacts detected."
    val status        = scan?.status        ?: "verified"
    val scanId        = scan?.id?.takeLast(8)?.uppercase() ?: "N/A"
    val dateStr       = scan?.date          ?: java.text.SimpleDateFormat("dd MMM yyyy", java.util.Locale.getDefault()).format(java.util.Date())
    val timeStr       = scan?.time          ?: java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
    val indicators    = scan?.indicators    ?: listOf(
        "EXIF Metadata: Valid & Complete",
        "AI Detection: Negative",
        "Manipulation Check: Clear",
        "Compression: Consistent"
    )

    val isAuthentic = status == "verified"
    val isFake      = status == "flagged"
    val verdictLabel = if (isAuthentic) "AUTHENTIC" else if (isFake) "FLAGGED" else "UNCERTAIN"
    val verdictColor = if (isAuthentic) GreenAuthentic else if (isFake) RedFake else OrangeUncertain
    val verdictIcon  = if (isAuthentic) Icons.Default.CheckCircle
                       else if (isFake) Icons.Default.Cancel
                       else Icons.Default.Help

    // Rich report text for sharing
    val reportText = buildString {
        appendLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        appendLine("📋 IMAGE VERIFICATION REPORT")
        appendLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        appendLine()
        appendLine("🔍 Verdict: $verdictLabel")
        appendLine("📊 Confidence Score: $confidence%")
        appendLine("⚡ Confidence Tier: $confTier")
        appendLine("🏷️ Prediction: $prediction Image")
        appendLine()
        appendLine("📁 FILE DETAILS")
        appendLine("• File Name: $fileName")
        appendLine("• Resolution: $resolution")
        appendLine("• File Size: $fileSize")
        appendLine()
        appendLine("📅 VERIFICATION DATE")
        appendLine("• Date: $dateStr")
        appendLine("• Time: $timeStr")
        appendLine("• Scan ID: #$scanId")
        appendLine()
        appendLine("🔬 ANALYSIS SUMMARY")
        appendLine(explanation)
        appendLine()
        appendLine("✅ DETECTION INDICATORS")
        indicators.forEach { appendLine("• $it") }
        appendLine()
        appendLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        appendLine("Verified using VerifyImage™")
        append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    }

    Column(modifier = Modifier.fillMaxSize().background(AppBackground)) {
        // ── Top Bar ──
        Box(modifier = Modifier.fillMaxWidth().background(CardBackground)
            .padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() },
                modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Share Results", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())
            .padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {

            // ── Report Preview Card ──
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground)) {
                Column {
                    // Verdict Header
                    Box(
                        modifier = Modifier.fillMaxWidth()
                            .background(Brush.verticalGradient(listOf(verdictColor, verdictColor.copy(0.8f))))
                            .padding(vertical = 24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Box(modifier = Modifier.size(60.dp).background(Color.White.copy(0.2f), CircleShape),
                                contentAlignment = Alignment.Center) {
                                Icon(verdictIcon, null, tint = Color.White, modifier = Modifier.size(32.dp))
                            }
                            Surface(color = Color.White.copy(0.2f), shape = RoundedCornerShape(50.dp)) {
                                Text(verdictLabel, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold,
                                    letterSpacing = 2.sp, modifier = Modifier.padding(horizontal = 14.dp, vertical = 5.dp))
                            }
                            Text(
                                if (isAuthentic) "Authentic Image" else if (isFake) "Image Flagged" else "Uncertain Result",
                                color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold
                            )
                            // Confidence Row
                            Row(horizontalArrangement = Arrangement.spacedBy(20.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.background(Color.White.copy(0.15f), RoundedCornerShape(14.dp))
                                    .padding(horizontal = 20.dp, vertical = 12.dp)) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("$confidence%", color = Color.White, fontSize = 30.sp, fontWeight = FontWeight.Black)
                                    Text("Confidence", color = Color.White.copy(0.75f), fontSize = 11.sp)
                                }
                                Box(modifier = Modifier.width(1.dp).height(36.dp).background(Color.White.copy(0.35f)))
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(confTier, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                    Text("Tier", color = Color.White.copy(0.75f), fontSize = 11.sp)
                                }
                                Box(modifier = Modifier.width(1.dp).height(36.dp).background(Color.White.copy(0.35f)))
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(prediction, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    Text("Prediction", color = Color.White.copy(0.75f), fontSize = 11.sp)
                                }
                            }
                        }
                    }

                    // Body
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {

                        // Image preview if available
                        if (scan?.imageUrl != null) {
                            Column {
                                Text("ANALYZED IMAGE", color = TextMuted, fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                                Spacer(Modifier.height(8.dp))
                                AsyncImage(
                                    model = scan.imageUrl,
                                    contentDescription = fileName,
                                    contentScale = ContentScale.Fit,
                                    modifier = Modifier.fillMaxWidth().height(180.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(AppBackground)
                                )
                                Spacer(Modifier.height(6.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text(fileName, color = TextMuted, fontSize = 12.sp, modifier = Modifier.weight(1f))
                                    Text(resolution, color = TextMuted, fontSize = 12.sp)
                                    Text(fileSize, color = TextMuted, fontSize = 12.sp)
                                }
                            }
                            Divider(color = AppBackground, thickness = 1.dp)
                        }

                        // File Details
                        Text("FILE DETAILS", color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            ReportInfoCard("File Name", fileName, Modifier.weight(1f))
                            ReportInfoCard("File Size", fileSize, Modifier.weight(1f))
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            ReportInfoCard("Resolution", resolution, Modifier.weight(1f))
                            ReportInfoCard("Scan ID", "#$scanId", Modifier.weight(1f))
                        }

                        Divider(color = AppBackground, thickness = 1.dp)

                        // Date & Time
                        Text("VERIFICATION DATE", color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            ReportInfoCard("Date", dateStr, Modifier.weight(1f))
                            ReportInfoCard("Time", timeStr, Modifier.weight(1f))
                        }

                        Divider(color = AppBackground, thickness = 1.dp)

                        // Analysis Summary
                        Text("ANALYSIS SUMMARY", color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Surface(
                            color = verdictColor.copy(0.08f),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, verdictColor.copy(0.25f))
                        ) {
                            Text(explanation, color = TextMain, fontSize = 13.sp, lineHeight = 20.sp,
                                modifier = Modifier.padding(12.dp))
                        }

                        Divider(color = AppBackground, thickness = 1.dp)

                        // Indicators
                        Text("DETECTION INDICATORS", color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        indicators.forEach { ind ->
                            val parts = ind.split(":").map { it.trim() }
                            val label = parts.getOrNull(0) ?: ind
                            val value = parts.getOrNull(1)
                            Row(modifier = Modifier.fillMaxWidth()
                                .background(verdictColor.copy(0.07f), RoundedCornerShape(8.dp))
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Box(modifier = Modifier.size(7.dp).background(verdictColor, CircleShape))
                                Text(label, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
                                if (value != null) Text(value, color = verdictColor, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Spacer(Modifier.height(4.dp))
                        }

                        // Footer brand
                        Divider(color = AppBackground, thickness = 1.dp)
                        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                            Text("VerifyImage™", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text("Image Authenticity Verification Platform", color = TextMuted, fontSize = 11.sp)
                            Text("Scan ID: #$scanId", color = TextDim, fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }

            // ── Share Via ──
            Text("Share Report Via", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)

            ShareOptionRow(
                iconBg = Color(0xFFEFF6FF), iconTint = Color(0xFF2563EB), icon = Icons.Default.Email,
                title = "Email", subtitle = "Send full report via email"
            ) {
                val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
                    data = android.net.Uri.parse("mailto:")
                    putExtra(Intent.EXTRA_SUBJECT, "Image Verification Report — $verdictLabel ($confidence%)")
                    putExtra(Intent.EXTRA_TEXT, reportText)
                }
                context.startActivity(Intent.createChooser(emailIntent, "Send Email"))
            }

            ShareOptionRow(
                iconBg = Color(0xFFF0FDF4), iconTint = GreenAuthentic, icon = Icons.Default.Message,
                title = "WhatsApp / Messaging", subtitle = "Share full report to any app"
            ) {
                val intent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, reportText)
                }
                context.startActivity(Intent.createChooser(intent, "Share Report via"))
            }

            ShareOptionRow(
                iconBg = Color(0xFFF3E8FF), iconTint = Color(0xFF7E22CE),
                icon = if (copied) Icons.Default.CheckCircle else Icons.Default.Link,
                title = if (copied) "Copied!" else "Copy Report",
                subtitle = if (copied) "Full report copied to clipboard" else "Copy formatted report to clipboard"
            ) {
                val clipboard = context.getSystemService(android.content.Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
                clipboard.setPrimaryClip(android.content.ClipData.newPlainText("Verification Report", reportText))
                copied = true
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun ReportInfoCard(label: String, value: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier.background(AppBackground, RoundedCornerShape(10.dp)).padding(10.dp)) {
        Text(label.uppercase(), color = TextDim, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.8.sp)
        Spacer(Modifier.height(3.dp))
        Text(value, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold,
            maxLines = 1, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
    }
}

@Composable
private fun ShareOptionRow(
    iconBg: Color, iconTint: Color,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String, subtitle: String, onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            Box(modifier = Modifier.size(48.dp).background(iconBg, CircleShape), contentAlignment = Alignment.Center) {
                Icon(icon, null, tint = iconTint, modifier = Modifier.size(24.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(title, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                Text(subtitle, color = TextMuted, fontSize = 13.sp)
            }
            Icon(Icons.Default.ChevronRight, null, tint = TextDim, modifier = Modifier.size(18.dp))
        }
    }
}

// ─── Detailed Analysis Report Screen ─────────────────────────────────────────
@Composable
fun DetailedAnalysisReportScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    Column(modifier = Modifier.fillMaxSize().background(AppBackground)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBackground).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Detailed Analysis", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)) {

            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground)) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Verification Summary", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(12.dp))
                    listOf(
                        "Status" to (scan?.status?.replaceFirstChar { it.uppercase() } ?: "—"),
                        "Prediction" to (scan?.prediction ?: "—"),
                        "Confidence" to "${scan?.confidence ?: "—"}%",
                        "Confidence Tier" to (scan?.confidenceTier ?: "—"),
                        "Manipulation Type" to (scan?.manipulationType ?: "—"),
                        "AI Model" to (scan?.aiModel ?: "VerifyAI v2"),
                        "AI Accuracy" to (scan?.aiAccuracy ?: "94.2%"),
                        "File Name" to (scan?.fileName ?: "—"),
                        "File Size" to (scan?.fileSize ?: "—"),
                        "Resolution" to (scan?.resolution ?: "—"),
                        "Scan Date" to "${scan?.date ?: "—"} ${scan?.time ?: ""}",
                    ).forEach { (label, value) ->
                        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                            horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(label, color = TextMuted, fontSize = 13.sp)
                            Text(value, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        }
                        HorizontalDivider(color = DividerColor, thickness = 0.5.dp)
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── AI Confidence Breakdown Screen ──────────────────────────────────────────
@Composable
fun AIConfidenceBreakdownScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan
    val confidenceVal = scan?.confidence ?: 94.0
    val confidenceFloat = confidenceVal.toFloat()
    val confidenceDisplay = confidenceVal.toInt()

    Column(modifier = Modifier.fillMaxSize().background(AppBackground)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBackground).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("AI Confidence Breakdown", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)) {

            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBackground)) {
                Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Overall Confidence Score", color = TextMuted, fontSize = 13.sp)
                    Spacer(Modifier.height(8.dp))
                    Text("$confidenceDisplay%", color = PrimaryAccent, fontSize = 48.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { confidenceFloat / 100f },
                        modifier = Modifier.fillMaxWidth().height(10.dp),
                        color = PrimaryAccent,
                        trackColor = CardBgLight
                    )
                    Spacer(Modifier.height(6.dp))
                    Text(scan?.confidenceTier ?: "High", color = TextMuted, fontSize = 13.sp)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── Image Metadata Viewer Screen ─────────────────────────────────────────────
@Composable
fun ImageMetadataViewerScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan
    val meta = scan?.metadata

    Column(modifier = Modifier.fillMaxSize().background(AppBackground)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBackground).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Image Metadata", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)) {

            if (meta == null) {
                Box(Modifier.fillMaxWidth().padding(top = 64.dp), contentAlignment = Alignment.Center) {
                    Text("No metadata available.", color = TextMuted, fontSize = 15.sp)
                }
            } else {
                MetaSection("File Information", listOf(
                    "Format" to meta.format, "File Size" to scan?.fileSize, "Resolution" to scan?.resolution,
                    "Color Space" to meta.colorSpace, "Bit Depth" to meta.bitDepth, "Compression" to meta.compression,
                    "DPI" to meta.dpi, "Orientation" to meta.orientation, "Color Profile" to meta.colorProfile
                ))

                MetaSection("Camera & Optics", listOf(
                    "Camera Make" to meta.cameraMake, "Camera Model" to meta.cameraModel,
                    "Lens" to meta.lens, "Focal Length" to meta.focalLength, "Aperture" to meta.aperture,
                    "ISO" to meta.iso?.toString(), "Shutter Speed" to meta.shutterSpeed, "Flash" to meta.flash
                ))
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun MetaSection(title: String, items: List<Pair<String, String?>>) {
    val filtered = items.filter { !it.second.isNullOrEmpty() && it.second != "None" }
    if (filtered.isEmpty()) return
    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, color = PrimaryAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Spacer(Modifier.height(12.dp))
            filtered.forEach { (label, value) ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                    horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(label, color = TextMuted, fontSize = 13.sp, modifier = Modifier.weight(1f))
                    Text(value!!, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                }
                HorizontalDivider(color = DividerColor, thickness = 0.5.dp)
            }
        }
    }
}

// ─── Image Comparison Screen ──────────────────────────────────────────────────
@Composable
fun ImageComparisonScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    Column(modifier = Modifier.fillMaxSize().background(AppBackground)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBackground).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Image Comparison", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)) {

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground)) {
                    Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Original", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Box(modifier = Modifier.height(140.dp), contentAlignment = Alignment.Center) {
                            if (!scan?.imageUrl.isNullOrEmpty()) {
                                AsyncImage(model = scan!!.imageUrl, contentDescription = null, modifier = Modifier.fillMaxSize())
                            }
                        }
                    }
                }
                Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBackground)) {
                    Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Forensic Map", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Box(modifier = Modifier.height(140.dp), contentAlignment = Alignment.Center) {
                            Text("Heatmap", color = TextMuted, fontSize = 12.sp)
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}
