package com.imageauth.verifier.network

import android.content.Context
import android.content.SharedPreferences
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private const val PREFS_NAME = "image_auth_prefs"
    private const val KEY_TOKEN = "auth_token"
    private const val KEY_IP = "server_ip"

    // Default to Android Emulator loopback. Can be overridden in UI settings.
    private const val DEFAULT_IP = "10.0.2.2" 

    private var retrofit: Retrofit? = null
    private var apiService: ApiService? = null
    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        buildRetrofit()
    }

    fun getIpAddress(): String {
        return prefs.getString(KEY_IP, DEFAULT_IP) ?: DEFAULT_IP
    }

    fun setIpAddress(ip: String) {
        prefs.edit().putString(KEY_IP, ip).apply()
        buildRetrofit() // Rebuild retrofit client with new IP
    }

    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }

    fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }

    fun clearToken() {
        prefs.edit().remove(KEY_TOKEN).apply()
    }

    private fun buildRetrofit() {
        val ip = getIpAddress()
        val baseUrl = "http://$ip:5000/"

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val authInterceptor = object : Interceptor {
            override fun intercept(chain: Interceptor.Chain): Response {
                val requestBuilder = chain.request().newBuilder()
                getToken()?.let {
                    requestBuilder.addHeader("Authorization", "Bearer $it")
                }
                return chain.proceed(requestBuilder.build())
            }
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()

        retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        apiService = retrofit?.create(ApiService::class.java)
    }

    fun getService(): ApiService {
        if (apiService == null) {
            throw IllegalStateException("RetrofitClient not initialized. Call init(context) first.")
        }
        return apiService!!
    }
}
