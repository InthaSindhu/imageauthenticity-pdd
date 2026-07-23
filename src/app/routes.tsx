import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { LoginErrorScreen } from "./components/LoginErrorScreen";
import { SignupScreen } from "./components/SignupScreen";
import { SignupErrorScreen } from "./components/SignupErrorScreen";
import { HomeScreen } from "./components/HomeScreen";
import { UploadScreen } from "./components/UploadScreen";
import { UploadingScreen } from "./components/UploadingScreen";
import { UploadErrorScreen } from "./components/UploadErrorScreen";
import { UploadDragOverScreen } from "./components/UploadDragOverScreen";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { ResultScreen } from "./components/ResultScreen";
import { ResultFakeScreen } from "./components/ResultFakeScreen";
import { ResultUncertainScreen } from "./components/ResultUncertainScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { HistoryEmptyScreen } from "./components/HistoryEmptyScreen";
import { HistoryLoadingScreen } from "./components/HistoryLoadingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { EditProfileScreen } from "./components/EditProfileScreen";
import { ChangePasswordScreen } from "./components/ChangePasswordScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { CameraPermissionScreen } from "./components/CameraPermissionScreen";
import { StoragePermissionScreen } from "./components/StoragePermissionScreen";
import { CameraPermissionDeniedScreen } from "./components/CameraPermissionDeniedScreen";
import { StoragePermissionDeniedScreen } from "./components/StoragePermissionDeniedScreen";
import { PermissionsOverviewScreen } from "./components/PermissionsOverviewScreen";
import { OnboardingPermissionsScreen } from "./components/OnboardingPermissionsScreen";
import { NoInternetScreen } from "./components/NoInternetScreen";
import { NetworkErrorScreen } from "./components/NetworkErrorScreen";
import { ServerErrorScreen } from "./components/ServerErrorScreen";
import { TimeoutErrorScreen } from "./components/TimeoutErrorScreen";
import { GeneralErrorScreen } from "./components/GeneralErrorScreen";
import { ServiceUnavailableScreen } from "./components/ServiceUnavailableScreen";
import { ScanCompletedNotification } from "./components/ScanCompletedNotification";
import { ScanWarningNotification } from "./components/ScanWarningNotification";
import { ErrorAlertDialog } from "./components/ErrorAlertDialog";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { LogoutConfirmationDialog } from "./components/LogoutConfirmationDialog";
import { NotificationCenterScreen } from "./components/NotificationCenterScreen";
import { ClearHistoryConfirmationDialog } from "./components/ClearHistoryConfirmationDialog";
import { AppUpdateScreen } from "./components/AppUpdateScreen";
import { HelpFAQScreen } from "./components/HelpFAQScreen";
import { DemoNavigationScreen } from "./components/DemoNavigationScreen";
import { ImageComparisonScreen } from "./components/ImageComparisonScreen";
import { DetailedAnalysisReport } from "./components/DetailedAnalysisReport";
import { AIConfidenceBreakdown } from "./components/AIConfidenceBreakdown";
import { ImageMetadataViewer } from "./components/ImageMetadataViewer";
import { RecentActivityDashboard } from "./components/RecentActivityDashboard";
import { SearchFilterScreen } from "./components/SearchFilterScreen";
import { ShareResultScreen } from "./components/ShareResultScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { TutorialOnboardingScreen } from "./components/TutorialOnboardingScreen";
import { DarkModeHomeScreen } from "./components/DarkModeHomeScreen";
import { ResultAuthenticScreen } from "./components/ResultAuthenticScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/demo",
    Component: DemoNavigationScreen,
  },
  {
    path: "/login",
    Component: LoginScreen,
  },
  {
    path: "/login-error",
    Component: LoginErrorScreen,
  },
  {
    path: "/signup",
    Component: SignupScreen,
  },
  {
    path: "/signup-error",
    Component: SignupErrorScreen,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/upload",
    Component: UploadScreen,
  },
  {
    path: "/uploading",
    Component: UploadingScreen,
  },
  {
    path: "/upload-error",
    Component: UploadErrorScreen,
  },
  {
    path: "/upload-drag",
    Component: UploadDragOverScreen,
  },
  {
    path: "/processing",
    Component: ProcessingScreen,
  },
  {
    path: "/result",
    Component: ResultScreen,
  },
  {
    path: "/result-fake",
    Component: ResultFakeScreen,
  },
  {
    path: "/result-uncertain",
    Component: ResultUncertainScreen,
  },
  {
    path: "/history",
    Component: HistoryScreen,
  },
  {
    path: "/history-empty",
    Component: HistoryEmptyScreen,
  },
  {
    path: "/history-loading",
    Component: HistoryLoadingScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
  {
    path: "/edit-profile",
    Component: EditProfileScreen,
  },
  {
    path: "/change-password",
    Component: ChangePasswordScreen,
  },
  {
    path: "/settings",
    Component: SettingsScreen,
  },
  {
    path: "/camera-permission",
    Component: CameraPermissionScreen,
  },
  {
    path: "/storage-permission",
    Component: StoragePermissionScreen,
  },
  {
    path: "/camera-permission-denied",
    Component: CameraPermissionDeniedScreen,
  },
  {
    path: "/storage-permission-denied",
    Component: StoragePermissionDeniedScreen,
  },
  {
    path: "/permissions",
    Component: PermissionsOverviewScreen,
  },
  {
    path: "/onboarding-permissions",
    Component: OnboardingPermissionsScreen,
  },
  {
    path: "/error-no-internet",
    Component: NoInternetScreen,
  },
  {
    path: "/error-network",
    Component: NetworkErrorScreen,
  },
  {
    path: "/error-server",
    Component: ServerErrorScreen,
  },
  {
    path: "/error-timeout",
    Component: TimeoutErrorScreen,
  },
  {
    path: "/error-general",
    Component: GeneralErrorScreen,
  },
  {
    path: "/error-service-unavailable",
    Component: ServiceUnavailableScreen,
  },
  {
    path: "/notification-scan-completed",
    Component: ScanCompletedNotification,
  },
  {
    path: "/notification-scan-warning",
    Component: ScanWarningNotification,
  },
  {
    path: "/alert-error",
    Component: ErrorAlertDialog,
  },
  {
    path: "/alert-delete-confirmation",
    Component: DeleteConfirmationDialog,
  },
  {
    path: "/alert-logout-confirmation",
    Component: LogoutConfirmationDialog,
  },
  {
    path: "/notifications",
    Component: NotificationCenterScreen,
  },
  {
    path: "/alert-clear-history",
    Component: ClearHistoryConfirmationDialog,
  },
  {
    path: "/app-update",
    Component: AppUpdateScreen,
  },
  {
    path: "/help-faq",
    Component: HelpFAQScreen,
  },
  {
    path: "/result-authentic",
    Component: ResultAuthenticScreen,
  },
  {
    path: "/comparison",
    Component: ImageComparisonScreen,
  },
  {
    path: "/analysis",
    Component: DetailedAnalysisReport,
  },
  {
    path: "/confidence",
    Component: AIConfidenceBreakdown,
  },
  {
    path: "/metadata",
    Component: ImageMetadataViewer,
  },
  {
    path: "/activity",
    Component: RecentActivityDashboard,
  },
  {
    path: "/search",
    Component: SearchFilterScreen,
  },
  {
    path: "/share",
    Component: ShareResultScreen,
  },
  {
    path: "/feedback",
    Component: FeedbackScreen,
  },
  {
    path: "/tutorial",
    Component: TutorialOnboardingScreen,
  },
  {
    path: "/dark-mode",
    Component: DarkModeHomeScreen,
  },
]);
