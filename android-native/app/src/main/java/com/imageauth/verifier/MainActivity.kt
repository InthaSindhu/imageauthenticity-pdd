package com.imageauth.verifier

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.imageauth.verifier.network.RetrofitClient
import com.imageauth.verifier.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        RetrofitClient.init(applicationContext)

        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = PrimaryAccent,
                    secondary = SecondaryAccent,
                    background = AppBackground,
                    surface = CardBackground
                )
            ) {
                Surface(modifier = Modifier.fillMaxSize(), color = AppBackground) {
                    val navController = rememberNavController()
                    val startDestination = if (RetrofitClient.getToken() != null) "home" else "splash"

                    NavHost(navController = navController, startDestination = startDestination) {

                        // ── Demo & Splash ─────────────────────────────
                        composable("splash")   { SplashScreen(navController) }
                        composable("demo")     { DemoNavigationScreen(navController) }

                        // ── Authentication ────────────────────────────
                        composable("login")        { LoginScreen(navController) }
                        composable("signup")       { SignupScreen(navController) }
                        composable("login_error")  { LoginErrorScreen(navController) }
                        composable("signup_error") { SignupErrorScreen(navController) }

                        // ── Core Navigation ───────────────────────────
                        composable("home")    { HomeScreen(navController) }

                        // ── Upload Flow ───────────────────────────────
                        composable("upload")      { UploadScreen(navController) }
                        composable("uploading")   { UploadingScreen(navController) }
                        composable("upload_error"){ UploadErrorScreen(navController) }
                        composable("upload_drag") { UploadDragOverScreen(navController) }
                        composable("processing")  { ProcessingScreen(navController) }

                        // ── Results ───────────────────────────────────
                        composable("result")           { ResultScreen(navController) }
                        composable("result_authentic") { ResultAuthenticScreen(navController) }
                        composable("result_fake")      { ResultFakeScreen(navController) }
                        composable("result_uncertain") { ResultUncertainScreen(navController) }
                        composable("share")            { ShareResultScreen(navController) }
                        composable("analysis")         { DetailedAnalysisReportScreen(navController) }
                        composable("confidence")       { AIConfidenceBreakdownScreen(navController) }
                        composable("metadata")         { ImageMetadataViewerScreen(navController) }
                        composable("comparison")       { ImageComparisonScreen(navController) }

                        // ── History ───────────────────────────────────
                        composable("history")         { HistoryScreen(navController) }
                        composable("history_empty")   { HistoryEmptyScreen(navController) }
                        composable("history_loading") { HistoryLoadingScreen(navController) }
                        composable("search")          { SearchFilterScreen(navController) }
                        composable("activity")        { RecentActivityDashboard(navController) }

                        // ── Profile & Settings ─────────────────────────
                        composable("profile")         { ProfileScreen(navController) }
                        composable("edit_profile")    { EditProfileScreen(navController) }
                        composable("change_password") { ChangePasswordScreen(navController) }
                        composable("settings")        { SettingsScreen(navController) }

                        // ── Notifications ─────────────────────────────
                        composable("notifications")          { NotificationCenterScreen(navController) }
                        composable("notif_scan_completed")   { ScanCompletedNotificationScreen(navController) }
                        composable("notif_scan_warning")     { ScanWarningNotificationScreen(navController) }

                        // ── Dialogs (standalone demo pages) ───────────
                        composable("demo_error_dialog") {
                            var show by remember { mutableStateOf(true) }
                            if (show) ErrorAlertDialog(
                                message = "A sample error occurred.",
                                onConfirm = { show = false; navController.popBackStack() }
                            )
                        }
                        composable("demo_delete_dialog") {
                            var show by remember { mutableStateOf(true) }
                            if (show) DeleteConfirmationDialog(
                                onConfirm = { show = false; navController.popBackStack() },
                                onDismiss = { show = false; navController.popBackStack() }
                            )
                        }
                        composable("demo_logout_dialog") {
                            var show by remember { mutableStateOf(true) }
                            if (show) LogoutConfirmationDialog(
                                onConfirm = { show = false; RetrofitClient.clearToken(); navController.navigate("login") { popUpTo("home") { inclusive = true } } },
                                onDismiss = { show = false; navController.popBackStack() }
                            )
                        }
                        composable("demo_clear_dialog") {
                            var show by remember { mutableStateOf(true) }
                            if (show) ClearHistoryConfirmationDialog(
                                onConfirm = { show = false; navController.popBackStack() },
                                onDismiss = { show = false; navController.popBackStack() }
                            )
                        }

                        // ── Permissions ───────────────────────────────
                        composable("camera_permission")   { CameraPermissionScreen(navController) }
                        composable("camera_denied")       { CameraPermissionDeniedScreen(navController) }
                        composable("storage_permission")  { StoragePermissionScreen(navController) }
                        composable("storage_denied")      { StoragePermissionDeniedScreen(navController) }
                        composable("permissions")         { PermissionsOverviewScreen(navController) }
                        composable("onboarding_permissions") { OnboardingPermissionsScreen(navController) }
                        composable("tutorial")            { TutorialOnboardingScreen(navController) }

                        // ── Error Screens ─────────────────────────────
                        composable("error_no_internet") { NoInternetScreen(navController) }
                        composable("error_network")     { NetworkErrorScreen(navController) }
                        composable("error_server")      { ServerErrorScreen(navController) }
                        composable("error_timeout")     { TimeoutErrorScreen(navController) }
                        composable("error_general")     { GeneralErrorScreen(navController) }
                        composable("error_service")     { ServiceUnavailableScreen(navController) }
                        composable("app_update")        { AppUpdateScreen(navController) }

                        // ── Dashboard & Support ───────────────────────
                        composable("dark_mode_home")   { DarkModeHomeScreen(navController) }
                        composable("help_faq")         { HelpFAQScreen(navController) }
                        composable("feedback")         { FeedbackScreen(navController) }
                    }
                }
            }
        }
    }
}
