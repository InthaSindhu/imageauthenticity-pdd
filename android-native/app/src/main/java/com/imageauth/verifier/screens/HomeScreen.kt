package com.imageauth.verifier.screens

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.User
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var user by remember { mutableStateOf<User?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                user = RetrofitClient.getService().getProfile()
            } catch (e: Exception) {
                RetrofitClient.clearToken()
                navController.navigate("login") {
                    popUpTo("home") { inclusive = true }
                }
            } finally {
                isLoading = false
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AppBackground)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                color = GradientBlueStart,
                modifier = Modifier.align(Alignment.Center)
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                // ─── 1. TOP GRADIENT BANNER ─────────────────────────────────────────
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(GradientBlueStart, GradientPurpleEnd)
                            ),
                            shape = RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp)
                        )
                        .padding(horizontal = 20.dp)
                        .padding(top = 24.dp, bottom = 48.dp)
                ) {
                    Column {
                        // Header Row (Welcome & Top Actions)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Welcome back, ${user?.name ?: "User"} !",
                                    color = Color.White,
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Default
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "Verify your images instantly",
                                    color = TextBlueLight,
                                    fontSize = 13.sp,
                                    fontFamily = FontFamily.Default
                                )
                            }

                            // Notification Bell & Profile Avatar Buttons
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Notification Bell Button with Red Badge
                                Box(
                                    modifier = Modifier.clickable { navController.navigate("notifications") }
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(44.dp)
                                            .background(Color.White.copy(alpha = 0.2f), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            Icons.Default.Notifications,
                                            contentDescription = "Notifications",
                                            tint = Color.White,
                                            modifier = Modifier.size(22.dp)
                                        )
                                    }
                                    // Notification Badge "2"
                                    Box(
                                        modifier = Modifier
                                            .offset(x = 28.dp, y = (-2).dp)
                                            .size(18.dp)
                                            .background(RedFake, CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "2",
                                            color = Color.White,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                // Profile Button
                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .background(Color.White.copy(alpha = 0.2f), CircleShape)
                                        .clickable { navController.navigate("profile") },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Person,
                                        contentDescription = "Profile",
                                        tint = Color.White,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        // Stats Dashboard Cards (Glassmorphism inside header)
                        val stats = user?.stats
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatGlassCard("Total Scans", "${stats?.totalScans ?: 11}", Modifier.weight(1f))
                            StatGlassCard("Verified", "${stats?.verified ?: 3}", Modifier.weight(1f))
                            StatGlassCard("Accuracy", "${stats?.accuracy ?: 27}%", Modifier.weight(1f))
                        }
                    }
                }

                // ─── 2. FLOATING UPLOAD CARD ─────────────────────────────────────────
                Column(
                    modifier = Modifier.padding(horizontal = 20.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .offset(y = (-28).dp)
                            .fillMaxWidth()
                            .shadow(elevation = 8.dp, shape = RoundedCornerShape(24.dp))
                            .background(CardBackground, RoundedCornerShape(24.dp))
                            .padding(16.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(76.dp)
                                .background(
                                    brush = Brush.horizontalGradient(
                                        colors = listOf(UploadBlueStart, UploadPurpleEnd)
                                    ),
                                    shape = RoundedCornerShape(16.dp)
                                )
                                .clickable { navController.navigate("upload") }
                                .padding(horizontal = 16.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(44.dp)
                                            .background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(12.dp)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            Icons.Default.Upload,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                    Column {
                                        Text(
                                            text = "Upload Image",
                                            color = Color.White,
                                            fontSize = 17.sp,
                                            fontWeight = FontWeight.Bold,
                                            fontFamily = FontFamily.Default
                                        )
                                        Text(
                                            text = "Verify authenticity now",
                                            color = TextBlueLight,
                                            fontSize = 12.sp,
                                            fontFamily = FontFamily.Default
                                        )
                                    }
                                }
                                Icon(
                                    Icons.Default.AutoAwesome,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height((-12).dp))

                    // ─── 3. QUICK ACTIONS SECTION ─────────────────────────────────────
                    Text(
                        text = "Quick Actions",
                        color = TextMain,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Default,
                        modifier = Modifier.padding(bottom = 14.dp)
                    )

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        QuickActionCard(
                            icon = Icons.Default.History,
                            iconBg = BlueBoxBg,
                            iconTint = BlueInfo,
                            title = "History",
                            subtitle = "View past scans",
                            modifier = Modifier.weight(1f)
                        ) {
                            navController.navigate("history")
                        }

                        QuickActionCard(
                            icon = Icons.Default.Schedule,
                            iconBg = PurpleBoxBg,
                            iconTint = UploadPurpleEnd,
                            title = "Recent",
                            subtitle = "Latest results",
                            modifier = Modifier.weight(1f)
                        ) {
                            navController.navigate("activity")
                        }
                    }

                    // Extra Quick Actions (Help, Profile, Settings, All Screens)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        QuickActionCard(
                            icon = Icons.Default.HelpOutline,
                            iconBg = Color(0xFFFEF3C7),
                            iconTint = OrangeUncertain,
                            title = "Help & FAQ",
                            subtitle = "Learn forensics",
                            modifier = Modifier.weight(1f)
                        ) {
                            navController.navigate("help_faq")
                        }

                        QuickActionCard(
                            icon = Icons.Default.Settings,
                            iconBg = Color(0xFFF3F4F6),
                            iconTint = TextMuted,
                            title = "Settings",
                            subtitle = "App preferences",
                            modifier = Modifier.weight(1f)
                        ) {
                            navController.navigate("settings")
                        }
                    }

                    // ─── 4. PRO TIP BANNER ──────────────────────────────────────────────
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 28.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = GreenSurface),
                        border = BorderStroke(1.dp, GreenBorder)
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.Top,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(GreenAuthentic, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Column {
                                Text(
                                    text = "Pro Tip",
                                    color = TextMain,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Default
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "For best results, upload high-quality images with good lighting and minimal compression.",
                                    color = TextMuted,
                                    fontSize = 12.sp,
                                    lineHeight = 16.sp,
                                    fontFamily = FontFamily.Default
                                )
                            }
                        }
                    }

                    // Sign Out Option
                    TextButton(
                        onClick = {
                            RetrofitClient.clearToken()
                            navController.navigate("login") {
                                popUpTo("home") { inclusive = true }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 24.dp)
                    ) {
                        Icon(Icons.Default.Logout, contentDescription = null, tint = RedFake, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Sign Out", color = RedFake, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun StatGlassCard(label: String, value: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .background(Color.White.copy(alpha = 0.15f), RoundedCornerShape(16.dp))
            .padding(vertical = 12.dp, horizontal = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = value,
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Default
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = label,
                color = TextBlueLight,
                fontSize = 11.sp,
                fontFamily = FontFamily.Default
            )
        }
    }
}

@Composable
private fun QuickActionCard(
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(115.dp)
            .shadow(elevation = 2.dp, shape = RoundedCornerShape(18.dp))
            .clickable { onClick() },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackground)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(iconBg, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(22.dp))
            }
            Column {
                Text(
                    text = title,
                    color = TextMain,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Default
                )
                Text(
                    text = subtitle,
                    color = TextMuted,
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Default
                )
            }
        }
    }
}
