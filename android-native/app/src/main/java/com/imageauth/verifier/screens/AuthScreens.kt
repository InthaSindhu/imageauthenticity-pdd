package com.imageauth.verifier.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.LoginRequest
import com.imageauth.verifier.models.SignupRequest
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var serverIp by remember { mutableStateOf(RetrofitClient.getIpAddress()) }
    var errorMessage by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(DarkBg, Color(0xFF020617))
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Server IP Config (Collapsible or visible for network setup)
            OutlinedTextField(
                value = serverIp,
                onValueChange = {
                    serverIp = it
                    RetrofitClient.setIpAddress(it)
                },
                label = { Text("Server IP Address", color = TextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                shape = RoundedCornerShape(12.dp)
            )

            Text(
                text = "Image Authenticity",
                color = TextMain,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 4.dp)
            )
            Text(
                text = "Sign in to verify your files",
                color = TextMuted,
                fontSize = 15.sp,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            if (errorMessage.isNotEmpty()) {
                Text(
                    text = errorMessage,
                    color = Color.Red,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email", color = TextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password", color = TextMuted) },
                visualTransformation = PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = {
                    if (email.isBlank() || password.isBlank()) {
                        errorMessage = "Please enter email and password"
                        return@Button
                    }
                    isLoading = true
                    errorMessage = ""
                    scope.launch {
                        try {
                            val response = RetrofitClient.getService().login(LoginRequest(email, password))
                            RetrofitClient.saveToken(response.token)
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        } catch (e: Exception) {
                            errorMessage = e.message ?: "Authentication failed"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Sign In", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.clickable { navController.navigate("signup") }
            ) {
                Text("New user? ", color = TextMuted)
                Text("Create an account", color = PrimaryAccent, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(navController: NavController) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(DarkBg, Color(0xFF020617))
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "Create Account",
                color = TextMain,
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 4.dp)
            )
            Text(
                text = "Join our secure authenticity platform",
                color = TextMuted,
                fontSize = 15.sp,
                modifier = Modifier.padding(bottom = 32.dp)
            )

            if (errorMessage.isNotEmpty()) {
                Text(
                    text = errorMessage,
                    color = Color.Red,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
            }

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Name", color = TextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email", color = TextMuted) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password", color = TextMuted) },
                visualTransformation = PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBg,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
            )

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = {
                    if (name.isBlank() || email.isBlank() || password.isBlank()) {
                        errorMessage = "Please fill all details"
                        return@Button
                    }
                    isLoading = true
                    errorMessage = ""
                    scope.launch {
                        try {
                            val response = RetrofitClient.getService().signup(SignupRequest(name, email, password))
                            RetrofitClient.saveToken(response.token)
                            navController.navigate("home") {
                                popUpTo("login") { inclusive = true }
                            }
                        } catch (e: Exception) {
                            errorMessage = e.message ?: "Signup failed"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                enabled = !isLoading,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("Register", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.clickable { navController.navigate("login") }
            ) {
                Text("Already registered? ", color = TextMuted)
                Text("Sign In", color = PrimaryAccent, fontWeight = FontWeight.Bold)
            }
        }
    }
}
