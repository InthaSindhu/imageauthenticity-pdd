package com.imageauth.verifier.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.ChangePasswordRequest
import com.imageauth.verifier.models.UpdateProfileRequest
import com.imageauth.verifier.models.User
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

// ─── Profile Screen ───────────────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var user by remember { mutableStateOf<User?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var showLogoutDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        scope.launch {
            try { user = RetrofitClient.getService().getProfile() }
            catch (_: Exception) {}
            finally { isLoading = false }
        }
    }

    if (showLogoutDialog) {
        LogoutConfirmationDialog(
            onConfirm = {
                RetrofitClient.clearToken()
                navController.navigate("login") { popUpTo("home") { inclusive = true } }
            },
            onDismiss = { showLogoutDialog = false }
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        // Header gradient banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .background(Brush.verticalGradient(listOf(PrimaryAccent, DarkBg)))
        ) {
            IconButton(
                onClick = { navController.navigate("home") },
                modifier = Modifier.align(Alignment.TopStart).padding(12.dp)
            ) {
                Icon(Icons.Default.ArrowBack, null, tint = Color.White)
            }
            Row(
                modifier = Modifier.align(Alignment.TopEnd).padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(0.dp)
            ) {
                IconButton(onClick = { navController.navigate("settings") }) {
                    Icon(Icons.Default.Settings, null, tint = Color.White.copy(0.8f))
                }
                IconButton(onClick = { showLogoutDialog = true }) {
                    Icon(Icons.Default.Logout, null, tint = Color.White.copy(0.8f))
                }
            }
            Column(modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(Color.White.copy(0.2f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        user?.name?.firstOrNull()?.uppercaseChar()?.toString() ?: "U",
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(Modifier.height(10.dp))
                Text(user?.name ?: "Loading...", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text(user?.email ?: "", color = Color.White.copy(0.75f), fontSize = 13.sp)
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            if (isLoading) {
                Box(Modifier.fillMaxWidth().padding(top = 32.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = PrimaryAccent)
                }
            } else {
                // Stats
                val stats = user?.stats
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    listOf(
                        Triple("Scans", "${stats?.totalScans ?: 0}", TextMain),
                        Triple("Verified", "${stats?.verified ?: 0}", GreenAuthentic),
                        Triple("Flagged", "${stats?.flagged ?: 0}", RedFake),
                        Triple("Accuracy", "${stats?.accuracy ?: 100}%", PrimaryAccent),
                    ).forEach { (label, value, color) ->
                        Card(
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(containerColor = CardBg)
                        ) {
                            Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(value, color = color, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                Text(label, color = TextMuted, fontSize = 10.sp)
                            }
                        }
                    }
                }

                // Account Actions
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg)) {
                    Column {
                        ProfileMenuItem(Icons.Default.Edit, BlueInfo, "Edit Profile", "Update name & email") {
                            navController.navigate("edit_profile")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.Lock, OrangeUncertain, "Change Password", "Update your password") {
                            navController.navigate("change_password")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.Settings, TextMuted, "Settings", "Notifications & preferences") {
                            navController.navigate("settings")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.History, GreenAuthentic, "Scan History", "View all past scans") {
                            navController.navigate("history")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.Notifications, PrimaryAccent, "Notifications", "Manage alerts") {
                            navController.navigate("notifications")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.HelpOutline, SecondaryAccent, "Help & FAQ", "Get support") {
                            navController.navigate("help_faq")
                        }
                        HorizontalDivider(color = DividerColor)
                        ProfileMenuItem(Icons.Default.Feedback, OrangeUncertain, "Send Feedback", "Rate & report issues") {
                            navController.navigate("feedback")
                        }
                    }
                }

                // Sign Out
                Button(
                    onClick = { showLogoutDialog = true },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = RedFake.copy(0.12f)),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Default.Logout, null, tint = RedFake, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Sign Out", color = RedFake, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                Spacer(Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun ProfileMenuItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(iconTint.copy(0.12f), RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = iconTint, modifier = Modifier.size(20.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
            Text(subtitle, color = TextMuted, fontSize = 12.sp)
        }
        Icon(Icons.Default.ChevronRight, null, tint = TextDim, modifier = Modifier.size(18.dp))
    }
}

// ─── Edit Profile Screen (Real Backend Network Integration) ───────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(true) }
    var saving by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    var successMessage by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                val user = RetrofitClient.getService().getProfile()
                name = user.name
                email = user.email
            } catch (e: Exception) {
                error = "Failed to load user profile"
            } finally {
                isLoading = false
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Edit Profile", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimaryAccent)
            }
        } else {
            Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)) {

                if (successMessage.isNotEmpty()) {
                    Surface(color = GreenAuthentic.copy(0.12f), shape = RoundedCornerShape(12.dp)) {
                        Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.CheckCircle, null, tint = GreenAuthentic, modifier = Modifier.size(18.dp))
                            Text(successMessage, color = GreenAuthentic, fontSize = 14.sp)
                        }
                    }
                }
                if (error.isNotEmpty()) {
                    Surface(color = RedFake.copy(0.12f), shape = RoundedCornerShape(12.dp)) {
                        Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.Error, null, tint = RedFake, modifier = Modifier.size(18.dp))
                            Text(error, color = RedFake, fontSize = 14.sp)
                        }
                    }
                }

                // Avatar display
                Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Box(
                        modifier = Modifier.size(80.dp).background(PrimaryAccent.copy(0.15f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(name.firstOrNull()?.uppercaseChar()?.toString() ?: "U",
                            color = PrimaryAccent, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Name
                ProfileTextField("Full Name", name, Icons.Default.Person) {
                    name = it
                    error = ""
                    successMessage = ""
                }

                // Email
                ProfileTextField("Email Address", email, Icons.Default.Email) {
                    email = it
                    error = ""
                    successMessage = ""
                }

                Button(
                    onClick = {
                        if (name.isBlank() || email.isBlank()) {
                            error = "Name and email cannot be empty"
                            return@Button
                        }
                        saving = true
                        error = ""
                        successMessage = ""
                        scope.launch {
                            try {
                                val updatedUser = RetrofitClient.getService().updateProfile(UpdateProfileRequest(name, email))
                                name = updatedUser.name
                                email = updatedUser.email
                                successMessage = "Profile updated successfully!"
                            } catch (e: Exception) {
                                error = e.message ?: "Failed to update profile"
                            } finally {
                                saving = false
                            }
                        }
                    },
                    enabled = !saving,
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    if (saving) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                    } else {
                        Text("Save Changes", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProfileTextField(
    label: String,
    value: String,
    leadingIcon: androidx.compose.ui.graphics.vector.ImageVector,
    readOnly: Boolean = false,
    onChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label, color = TextMuted) },
        leadingIcon = { Icon(leadingIcon, null, tint = TextMuted) },
        readOnly = readOnly,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = PrimaryAccent,
            unfocusedBorderColor = CardBgLight,
            focusedTextColor = TextMain,
            unfocusedTextColor = TextMain,
            disabledTextColor = TextDim
        )
    )
}

// ─── Change Password Screen (Real Backend Network Integration) ───────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangePasswordScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var showCurrent by remember { mutableStateOf(false) }
    var showNew by remember { mutableStateOf(false) }
    var showConfirm by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    var successMessage by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Change Password", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)) {

            if (successMessage.isNotEmpty()) {
                Surface(color = GreenAuthentic.copy(0.12f), shape = RoundedCornerShape(12.dp)) {
                    Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.CheckCircle, null, tint = GreenAuthentic, modifier = Modifier.size(18.dp))
                        Text(successMessage, color = GreenAuthentic, fontSize = 14.sp)
                    }
                }
            }
            if (error.isNotEmpty()) {
                Surface(color = RedFake.copy(0.12f), shape = RoundedCornerShape(12.dp)) {
                    Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Error, null, tint = RedFake, modifier = Modifier.size(18.dp))
                        Text(error, color = RedFake, fontSize = 14.sp)
                    }
                }
            }

            PasswordField("Current Password", currentPassword, showCurrent, { showCurrent = it }) { currentPassword = it }
            PasswordField("New Password", newPassword, showNew, { showNew = it }) { newPassword = it }
            PasswordField("Confirm New Password", confirmPassword, showConfirm, { showConfirm = it }) { confirmPassword = it }

            // Password strength
            if (newPassword.isNotEmpty()) {
                val strength = when {
                    newPassword.length >= 12 && newPassword.any { it.isDigit() } && newPassword.any { !it.isLetterOrDigit() } -> "Strong"
                    newPassword.length >= 8 -> "Medium"
                    else -> "Weak"
                }
                val (strengthColor, strengthPct) = when (strength) {
                    "Strong" -> GreenAuthentic to 1f
                    "Medium" -> OrangeUncertain to 0.6f
                    else -> RedFake to 0.25f
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    LinearProgressIndicator(
                        progress = { strengthPct },
                        modifier = Modifier.weight(1f).height(6.dp),
                        color = strengthColor,
                        trackColor = CardBgLight
                    )
                    Text(strength, color = strengthColor, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Button(
                onClick = {
                    error = ""
                    successMessage = ""
                    when {
                        currentPassword.isBlank() || newPassword.isBlank() || confirmPassword.isBlank() ->
                            error = "All fields are required"
                        newPassword != confirmPassword ->
                            error = "New passwords don't match"
                        newPassword.length < 6 ->
                            error = "Password must be at least 6 characters"
                        else -> {
                            isLoading = true
                            scope.launch {
                                try {
                                    val res = RetrofitClient.getService().changePassword(
                                        ChangePasswordRequest(currentPassword, newPassword)
                                    )
                                    successMessage = res.message ?: "Password updated successfully!"
                                    currentPassword = ""
                                    newPassword = ""
                                    confirmPassword = ""
                                } catch (e: Exception) {
                                    error = e.message ?: "Incorrect current password or server error"
                                } finally {
                                    isLoading = false
                                }
                            }
                        }
                    }
                },
                enabled = !isLoading,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                } else {
                    Text("Update Password", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PasswordField(
    label: String,
    value: String,
    visible: Boolean,
    onVisibilityChange: (Boolean) -> Unit,
    onChange: (String) -> Unit
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label, color = TextMuted) },
        leadingIcon = { Icon(Icons.Default.Lock, null, tint = TextMuted) },
        trailingIcon = {
            IconButton(onClick = { onVisibilityChange(!visible) }) {
                Icon(
                    if (visible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                    null,
                    tint = TextMuted
                )
            }
        },
        visualTransformation = if (visible) VisualTransformation.None else PasswordVisualTransformation(),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = PrimaryAccent,
            unfocusedBorderColor = CardBgLight,
            focusedTextColor = TextMain,
            unfocusedTextColor = TextMain
        )
    )
}

// ─── Settings Screen (Persistent Local Preferences) ───────────────────────────
@Composable
fun SettingsScreen(navController: NavController) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("app_settings", Context.MODE_PRIVATE) }

    var pushNotifications by remember { mutableStateOf(prefs.getBoolean("push_notifications", true)) }
    var emailNotifications by remember { mutableStateOf(prefs.getBoolean("email_notifications", true)) }
    var verificationAlerts by remember { mutableStateOf(prefs.getBoolean("verification_alerts", true)) }
    var darkMode by remember { mutableStateOf(prefs.getBoolean("dark_mode", true)) }
    var biometricAuth by remember { mutableStateOf(prefs.getBoolean("biometric_auth", false)) }
    var vibration by remember { mutableStateOf(prefs.getBoolean("vibration", true)) }

    fun updatePref(key: String, value: Boolean) {
        prefs.edit().putBoolean(key, value).apply()
    }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, null, tint = TextMain)
            }
            Text("Settings", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)) {

            // Notifications
            SettingsCard("Notifications", Icons.Default.Notifications, BlueInfo) {
                SettingsToggleRow("Push Notifications", "Receive alerts on your device", pushNotifications) {
                    pushNotifications = it
                    updatePref("push_notifications", it)
                }
                HorizontalDivider(color = DividerColor)
                SettingsToggleRow("Email Notifications", "Get updates via email", emailNotifications) {
                    emailNotifications = it
                    updatePref("email_notifications", it)
                }
                HorizontalDivider(color = DividerColor)
                SettingsToggleRow("Verification Alerts", "Alerts when scan completes", verificationAlerts) {
                    verificationAlerts = it
                    updatePref("verification_alerts", it)
                }
            }

            // Appearance
            SettingsCard("Appearance", Icons.Default.DarkMode, SecondaryAccent) {
                SettingsToggleRow("Dark Mode", "Use dark theme", darkMode) {
                    darkMode = it
                    updatePref("dark_mode", it)
                }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Language", "English (US)", Icons.Default.Language) { }
            }

            // Security
            SettingsCard("Security & Privacy", Icons.Default.Security, GreenAuthentic) {
                SettingsToggleRow("Biometric Auth", "Use Face ID or fingerprint", biometricAuth) {
                    biometricAuth = it
                    updatePref("biometric_auth", it)
                }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Two-Factor Auth", "Not enabled") { }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Privacy Settings", "Manage your data") { }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("App Permissions", "Camera, storage, and more") { navController.navigate("permissions") }
            }

            // Preferences
            SettingsCard("Preferences", Icons.Default.Tune, OrangeUncertain) {
                SettingsToggleRow("Vibration", "Haptic feedback", vibration) {
                    vibration = it
                    updatePref("vibration", it)
                }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Auto-Delete History", "After 90 days") { }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Data Usage", "Download over WiFi only") { }
            }

            // Support
            SettingsCard("Support", Icons.Default.Support, PrimaryAccent) {
                SettingsNavRow("Help & Support", "FAQs and contact us") { navController.navigate("help_faq") }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Terms & Privacy", "Legal information") { }
                HorizontalDivider(color = DividerColor)
                SettingsNavRow("Send Feedback", "Help us improve") { navController.navigate("feedback") }
            }

            Text("Version 1.0.0", color = TextDim, fontSize = 12.sp,
                modifier = Modifier.fillMaxWidth(), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
            Text("© 2026 VerifyImage. All rights reserved.", color = TextDim, fontSize = 11.sp,
                modifier = Modifier.fillMaxWidth(), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun SettingsCard(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg)
    ) {
        Column {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier.size(38.dp).background(iconTint.copy(0.12f), RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, null, tint = iconTint, modifier = Modifier.size(20.dp))
                }
                Text(title, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            }
            HorizontalDivider(color = DividerColor)
            content()
        }
    }
}

@Composable
private fun SettingsToggleRow(title: String, subtitle: String, value: Boolean, onToggle: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.Medium)
            Text(subtitle, color = TextMuted, fontSize = 12.sp)
        }
        Switch(
            checked = value,
            onCheckedChange = onToggle,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = PrimaryAccent,
                uncheckedThumbColor = TextMuted,
                uncheckedTrackColor = CardBgLight
            )
        )
    }
}

@Composable
private fun SettingsNavRow(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector? = null,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().clickable { onClick() }.padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            if (icon != null) {
                Icon(icon, null, tint = TextMuted, modifier = Modifier.size(20.dp))
            }
            Column {
                Text(title, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                Text(subtitle, color = TextMuted, fontSize = 12.sp)
            }
        }
        Icon(Icons.Default.ChevronRight, null, tint = TextDim, modifier = Modifier.size(18.dp))
    }
}
