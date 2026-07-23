package com.imageauth.verifier.network

import com.imageauth.verifier.models.*
import retrofit2.http.*

interface ApiService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("api/auth/signup")
    suspend fun signup(@Body request: SignupRequest): LoginResponse

    @GET("api/auth/me")
    suspend fun getProfile(): User

    @POST("api/verify")
    suspend fun verifyImage(@Body request: VerifyRequest): Scan

    @GET("api/history")
    suspend fun getHistory(): List<Scan>

    @DELETE("api/history/{id}")
    suspend fun deleteScan(@Path("id") id: String): SimpleMessageResponse

    @POST("api/history/clear")
    suspend fun clearHistory(): SimpleMessageResponse

    @GET("api/notifications")
    suspend fun getNotifications(): List<Notification>

    @POST("api/notifications/read-all")
    suspend fun markNotificationsRead(): SimpleMessageResponse

    @POST("api/feedback")
    suspend fun sendFeedback(@Body request: FeedbackRequest): SimpleMessageResponse

    @PUT("api/auth/profile")
    suspend fun updateProfile(@Body request: UpdateProfileRequest): User

    @PUT("api/auth/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): SimpleMessageResponse
}

