package com.imageauth.verifier.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.FeedbackRequest
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

// ─── Dark Mode Home Screen ─────────────────────────────────────────────────────
@Composable
fun DarkModeHomeScreen(navController: NavController) {
    // This is a visual variant of HomeScreen demonstrating the dark theme explicitly
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Dark Mode Preview", color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("All screens use this theme", color = TextMuted, fontSize = 13.sp)
            }
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(PrimaryAccent.copy(0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.DarkMode, contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(22.dp))
            }
        }
        Spacer(Modifier.height(24.dp))
        // Color palette preview
        Text("Color Tokens", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        Spacer(Modifier.height(8.dp))
        listOf(
            "Primary Accent" to PrimaryAccent,
            "Secondary Accent" to SecondaryAccent,
            "Authentic Green" to GreenAuthentic,
            "Fake Red" to RedFake,
            "Uncertain Amber" to OrangeUncertain,
            "Card Background" to CardBg,
        ).forEach { (name, color) ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 5.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(color, RoundedCornerShape(8.dp))
                )
                Text(name, color = TextMain, fontSize = 14.sp)
            }
        }
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = { navController.navigate("home") },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("Return to Home", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

// ─── Help & FAQ Screen ────────────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HelpFAQScreen(navController: NavController) {
    val faqs = listOf(
        "How does image verification work?" to
            "Our AI analyzes multiple layers: EXIF metadata, compression patterns, frequency domain anomalies, and GAN signatures to determine authenticity.",
        "What types of manipulation can you detect?" to
            "We detect AI-generated images, deepfakes, face swaps, cloning, splicing, copy-move fraud, and digital retouching artifacts.",
        "How accurate is the detection?" to
            "Our model achieves 94–98% accuracy depending on the manipulation type. The confidence score shows the certainty level for each result.",
        "Are my images stored?" to
            "Scan metadata and results are stored to your history. Images are processed server-side and not retained after analysis.",
        "What image formats are supported?" to
            "JPEG, PNG, HEIC, WebP, BMP, and TIFF are fully supported. Files up to 50MB are accepted.",
        "Can I verify images from URLs?" to
            "Yes! You can paste an image URL in the upload screen and we'll fetch and analyze it automatically.",
        "How do I delete scan history?" to
            "Go to History → swipe left on a scan to delete it, or tap the trash icon at the top to clear all history.",
        "What does the confidence tier mean?" to
            "High (>85%), Medium (60-85%), and Low (<60%) indicate how certain our AI is about the result."
    )

    var expandedIndex by remember { mutableStateOf<Int?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(CardBg)
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain)
            }
            Text("Help & FAQ", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                "Frequently Asked Questions",
                color = TextMuted,
                fontSize = 13.sp,
                modifier = Modifier.padding(top = 4.dp, bottom = 8.dp)
            )

            faqs.forEachIndexed { index, (question, answer) ->
                Card(
                    modifier = Modifier.fillMaxWidth().clickable {
                        expandedIndex = if (expandedIndex == index) null else index
                    },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                question,
                                color = TextMain,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                if (expandedIndex == index) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                contentDescription = null,
                                tint = TextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        if (expandedIndex == index) {
                            Spacer(Modifier.height(10.dp))
                            Text(answer, color = TextMuted, fontSize = 14.sp, lineHeight = 20.sp)
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg)
            ) {
                Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Still need help?", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(6.dp))
                    Text("Contact our support team", color = TextMuted, fontSize = 14.sp)
                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = { navController.navigate("feedback") },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Email, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Send Feedback", color = Color.White, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }
    }
}

// ─── Feedback Screen ──────────────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedbackScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var rating by remember { mutableStateOf(4f) }
    var message by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var success by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }

    if (success) {
        Box(
            modifier = Modifier.fillMaxSize().background(DarkBg),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
                Box(
                    modifier = Modifier.size(80.dp).background(GreenAuthentic.copy(0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.CheckCircle, null, tint = GreenAuthentic, modifier = Modifier.size(40.dp))
                }
                Spacer(Modifier.height(20.dp))
                Text("Thank You!", color = TextMain, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                Text("Your feedback helps us improve VerifyImage for everyone.", color = TextMuted, fontSize = 15.sp,
                    lineHeight = 22.sp, textAlign = TextAlign.Center)
                Spacer(Modifier.height(32.dp))
                Button(
                    onClick = { navController.navigate("home") { popUpTo("feedback") { inclusive = true } } },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Back to Home", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        Box(
            modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Send Feedback", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Rating
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("How would you rate VerifyImage?", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        repeat(5) { star ->
                            IconButton(onClick = { rating = (star + 1).toFloat() }) {
                                Icon(
                                    if (star < rating.toInt()) Icons.Default.Star else Icons.Default.StarOutline,
                                    contentDescription = null,
                                    tint = if (star < rating.toInt()) OrangeUncertain else TextMuted,
                                    modifier = Modifier.size(36.dp)
                                )
                            }
                        }
                    }
                    Text(
                        when (rating.toInt()) {
                            1 -> "Poor"
                            2 -> "Fair"
                            3 -> "Good"
                            4 -> "Very Good"
                            else -> "Excellent!"
                        },
                        color = OrangeUncertain,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                }
            }

            // Message
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardBg)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Additional Comments", color = TextMain, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = message,
                        onValueChange = { message = it },
                        placeholder = { Text("Tell us what you think or report issues...", color = TextDim) },
                        modifier = Modifier.fillMaxWidth().height(140.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryAccent,
                            unfocusedBorderColor = CardBgLight,
                            focusedTextColor = TextMain,
                            unfocusedTextColor = TextMain
                        ),
                        shape = RoundedCornerShape(12.dp),
                        maxLines = 6
                    )
                }
            }

            if (error.isNotEmpty()) {
                Text(error, color = RedFake, fontSize = 14.sp, modifier = Modifier.padding(horizontal = 4.dp))
            }

            Button(
                onClick = {
                    scope.launch {
                        isLoading = true
                        error = ""
                        try {
                            RetrofitClient.getService().sendFeedback(FeedbackRequest(rating, message))
                            success = true
                        } catch (e: Exception) {
                            error = e.message ?: "Failed to send feedback"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading && message.isNotBlank(),
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                } else {
                    Icon(Icons.Default.Send, null, tint = Color.White, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Submit Feedback", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

// ─── Recent Activity Dashboard ────────────────────────────────────────────────
@Composable
fun RecentActivityDashboard(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        Box(
            modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Recent Activity", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Stats summary
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                listOf(
                    Triple("Today", "3", GreenAuthentic),
                    Triple("This Week", "14", PrimaryAccent),
                    Triple("Total", "47", SecondaryAccent)
                ).forEach { (label, value, color) ->
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = CardBg)
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(value, color = color, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                            Text(label, color = TextMuted, fontSize = 11.sp)
                        }
                    }
                }
            }

            Text("Recent Scans", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 8.dp))

            // Activity timeline
            listOf(
                Triple("landscape-2024.jpg", "Authentic • 94%", GreenAuthentic),
                Triple("photo-edit.png", "Fake Detected • 89%", RedFake),
                Triple("portrait-scan.jpg", "Uncertain • 62%", OrangeUncertain),
                Triple("family-photo.jpg", "Authentic • 97%", GreenAuthentic),
            ).forEachIndexed { index, (name, status, color) ->
                Card(
                    modifier = Modifier.fillMaxWidth().clickable { navController.navigate("result") },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .background(color.copy(0.12f), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                when {
                                    status.contains("Authentic") -> Icons.Default.CheckCircle
                                    status.contains("Fake") -> Icons.Default.Cancel
                                    else -> Icons.Default.Help
                                },
                                contentDescription = null,
                                tint = color,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(name, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                            Text(status, color = color, fontSize = 12.sp)
                            Text("${(index + 1) * 2}h ago", color = TextDim, fontSize = 11.sp)
                        }
                        Icon(Icons.Default.ChevronRight, null, tint = TextDim, modifier = Modifier.size(18.dp))
                    }
                }
            }

            Spacer(Modifier.height(8.dp))
            OutlinedButton(
                onClick = { navController.navigate("history") },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, PrimaryAccent)
            ) {
                Text("View Full History", color = PrimaryAccent, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}
