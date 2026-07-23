package com.imageauth.verifier.models

data class UserStats(
    val totalScans: Int,
    val verified: Int,
    val flagged: Int,
    val accuracy: Int
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val stats: UserStats?
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class SignupRequest(
    val name: String,
    val email: String,
    val password: String
)

data class VerifyRequest(
    val image: String, // Base64 data string
    val fileName: String,
    val metadata: ClientMetadata? = null
)

data class ClientMetadata(
    val resolution: String,
    val fileSize: String,
    val format: String
)

data class ScanMetadata(
    val format: String?,
    val colorSpace: String?,
    val compression: String?,
    val dpi: String?,
    val bitDepth: String?,
    val orientation: String?,
    val cameraMake: String?,
    val cameraModel: String?,
    val lens: String?,
    val focalLength: String?,
    val aperture: String?,
    val iso: Int?,
    val shutterSpeed: String?,
    val flash: String?,
    val gpsCoordinates: String?,
    val location: String?,
    val software: String?,
    val processing: String?,
    val colorProfile: String?,
    val statusText: String?
)

data class Scan(
    val id: String,
    val userId: String,
    val date: String,
    val time: String,
    val status: String, // "verified", "flagged", "uncertain"
    val prediction: String, // "Real", "Fake", "Suspicious"
    val verdict: String? = null,
    val is_real: Boolean? = null,
    val confidence: Double = 0.0,
    val authenticity_score: Double? = null,
    val fake_probability: Double? = null,
    val confidenceTier: String = "High",
    val manipulationType: String = "None",
    val explanation: String = "",
    val fileName: String = "",
    val fileSize: String = "",
    val resolution: String = "",
    val imageUrl: String = "",
    val metadata: ScanMetadata? = null,
    val indicators: List<String>? = null,
    val aiModel: String? = null,
    val aiAccuracy: String? = null
)

data class Notification(
    val id: String,
    val userId: String,
    val title: String,
    val description: String,
    val type: String,
    val time: String,
    val read: Boolean
)

data class FeedbackRequest(
    val rating: Float,
    val message: String,
    val type: String = "General"
)

data class SimpleMessageResponse(
    val message: String
)

data class UpdateProfileRequest(
    val name: String,
    val email: String
)

data class ChangePasswordRequest(
    val oldPassword: String,
    val newPassword: String
)

