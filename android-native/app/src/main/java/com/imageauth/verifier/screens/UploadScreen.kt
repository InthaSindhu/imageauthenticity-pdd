package com.imageauth.verifier.screens

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.launch
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.imageauth.verifier.models.ClientMetadata
import com.imageauth.verifier.models.Scan
import com.imageauth.verifier.models.VerifyRequest
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.compose.animation.core.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.io.File
import androidx.core.content.FileProvider

// Shared state object to hold verification result so it can be viewed in ResultScreen
object SharedScanResult {
    var currentScan: Scan? = null
}

@Composable
fun UploadScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    
    var bitmap by remember { mutableStateOf<Bitmap?>(null) }
    var fileName by remember { mutableStateOf("selected_photo.jpg") }
    var fileSizeText by remember { mutableStateOf("0 KB") }
    var resolutionText by remember { mutableStateOf("Unknown") }
    
    var isUploading by remember { mutableStateOf(false) }
    var uploadProgressText by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf("") }

    // Launcher for picking image from gallery
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            try {
                val inputStream: InputStream? = context.contentResolver.openInputStream(uri)
                val selectedBitmap = BitmapFactory.decodeStream(inputStream)
                
                // Get meta info
                val lengthBytes = context.contentResolver.openAssetFileDescriptor(uri, "r")?.use { 
                    it.length
                } ?: 0L
                fileSizeText = String.format("%.2f MB", lengthBytes.toFloat() / (1024 * 1024))
                
                bitmap = selectedBitmap
                resolutionText = "${selectedBitmap.width} × ${selectedBitmap.height} px"
                fileName = getFileNameFromUri(context, uri) ?: "gallery_photo.jpg"
            } catch (e: Exception) {
                errorMessage = "Failed to load image: ${e.message}"
            }
        }
    }

    var tempPhotoFile by remember { mutableStateOf<File?>(null) }

    // Launcher for capturing full-resolution image from camera
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture()
    ) { success: Boolean ->
        if (success && tempPhotoFile != null) {
            try {
                val selectedBitmap = BitmapFactory.decodeFile(tempPhotoFile!!.absolutePath)
                bitmap = selectedBitmap
                resolutionText = "${selectedBitmap.width} × ${selectedBitmap.height} px"
                fileName = "captured_photo.jpg"
                fileSizeText = String.format("%.2f MB", tempPhotoFile!!.length().toFloat() / (1024 * 1024))
            } catch (e: Exception) {
                errorMessage = "Failed to load camera image: ${e.message}"
            }
        }
    }

    // Helper to start camera capture
    val launchCamera = {
        try {
            val file = File.createTempFile("photo_", ".jpg", context.cacheDir)
            tempPhotoFile = file
            val uri = FileProvider.getUriForFile(
                context,
                "com.imageauth.verifier.fileprovider",
                file
            )
            cameraLauncher.launch(uri)
        } catch (e: Exception) {
            errorMessage = "Camera initialization failed: ${e.message}"
        }
    }

    // Launcher for camera permission request
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            launchCamera()
        } else {
            errorMessage = "Camera permission is required to take photos."
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .padding(24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Header
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Verify Authenticity",
                    color = TextMain,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 16.dp)
                )
                Text(
                    text = "Select or take a photo to initiate forensics scan",
                    color = TextMuted,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
                )
            }

            // Image Preview area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .border(1.dp, CardBg, RoundedCornerShape(16.dp))
                    .background(CardBg.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                if (bitmap != null) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Image(
                            bitmap = bitmap!!.asImageBitmap(),
                            contentDescription = "Selected image preview",
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentScale = ContentScale.Fit
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = fileName, color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "$resolutionText | $fileSizeText", color = TextMuted, fontSize = 11.sp)
                    }
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("No Image Selected", color = TextMuted, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Pick a file or snap a new one to begin.", color = TextMuted.copy(alpha = 0.7f), fontSize = 12.sp)
                    }
                }
            }

            if (errorMessage.isNotEmpty()) {
                Text(text = errorMessage, color = Color.Red, fontSize = 14.sp, modifier = Modifier.padding(vertical = 8.dp))
            }

            // Buttons
            Column(modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)) {
                if (isUploading) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp)
                    ) {
                        CircularProgressIndicator(color = PrimaryAccent)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(uploadProgressText, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    }
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Button(
                            onClick = { galleryLauncher.launch("image/*") },
                            modifier = Modifier.weight(1f).height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = CardBg)
                        ) {
                            Text("Open Gallery", color = TextMain)
                        }

                        Button(
                             onClick = {
                                 val hasCamPerm = androidx.core.content.ContextCompat.checkSelfPermission(
                                     context,
                                     android.Manifest.permission.CAMERA
                                 ) == android.content.pm.PackageManager.PERMISSION_GRANTED
                                 if (hasCamPerm) {
                                     launchCamera()
                                 } else {
                                     permissionLauncher.launch(android.Manifest.permission.CAMERA)
                                 }
                             },
                            modifier = Modifier.weight(1f).height(50.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = CardBg)
                        ) {
                            Text("Take Photo", color = TextMain)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            val selectedBitmap = bitmap
                            if (selectedBitmap == null) {
                                errorMessage = "Please select an image first"
                                return@Button
                            }
                            isUploading = true
                            uploadProgressText = "Encoding file..."
                            errorMessage = ""
                            
                            scope.launch {
                                try {
                                    uploadProgressText = "Preparing payload..."
                                    val base64String = convertBitmapToBase64(selectedBitmap)
                                    val fileExt = fileName.substringAfterLast('.', "jpg").uppercase()
                                    
                                    val meta = ClientMetadata(
                                        resolution = resolutionText,
                                        fileSize = fileSizeText,
                                        format = fileExt
                                    )
                                    
                                    uploadProgressText = "Uploading & running forensic scans..."
                                    val scanResult = RetrofitClient.getService().verifyImage(
                                        VerifyRequest(
                                            image = "data:image/jpeg;base64,$base64String",
                                            fileName = fileName,
                                            metadata = meta
                                        )
                                    )
                                    SharedScanResult.currentScan = scanResult
                                    navController.navigate("result") {
                                        popUpTo("upload") { inclusive = true }
                                    }
                                } catch (e: Exception) {
                                    errorMessage = e.message ?: "Verification failed"
                                } finally {
                                    isUploading = false
                                }
                            }
                        },
                        enabled = bitmap != null,
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent)
                    ) {
                        Text("Initiate Scan", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                }
            }
        }
    }
}

// Helpers
private fun convertBitmapToBase64(bitmap: Bitmap): String {
    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
    val bytes = outputStream.toByteArray()
    return Base64.encodeToString(bytes, Base64.NO_WRAP)
}

private fun getFileNameFromUri(context: Context, uri: Uri): String? {
    var result: String? = null
    if (uri.scheme == "content") {
        val cursor = context.contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val index = it.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME)
                if (index != -1) {
                    result = it.getString(index)
                }
            }
        }
    }
    if (result == null) {
        result = uri.path
        val cut = result?.lastIndexOf('/') ?: -1
        if (cut != -1) {
            result = result?.substring(cut + 1)
        }
    }
    return result
}

// ─── Uploading State Screen ────────────────────────────────────────────────────
@Composable
fun UploadingScreen(navController: NavController) {
    val infiniteTransition = androidx.compose.animation.core.rememberInfiniteTransition(label = "upload_anim")
    val progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(1800),
            repeatMode = androidx.compose.animation.core.RepeatMode.Restart
        ),
        label = "progress"
    )

    Box(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Box(
                modifier = Modifier.size(100.dp)
                    .background(PrimaryAccent.copy(0.12f), androidx.compose.foundation.shape.CircleShape),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    progress = { progress },
                    color = PrimaryAccent,
                    strokeWidth = 5.dp,
                    modifier = Modifier.size(64.dp)
                )
                androidx.compose.material3.Icon(
                    androidx.compose.material.icons.Icons.Default.Upload,
                    null,
                    tint = PrimaryAccent,
                    modifier = Modifier.size(28.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Text("Uploading Image", color = TextMain, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Transferring file to secure servers...", color = TextMuted, fontSize = 14.sp)
            Spacer(Modifier.height(32.dp))
            androidx.compose.material3.LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = PrimaryAccent,
                trackColor = CardBg
            )
            Spacer(Modifier.height(12.dp))
            Text("${(progress * 100).toInt()}%", color = TextMuted, fontSize = 13.sp)
        }
    }
}

// ─── Upload Error Screen ───────────────────────────────────────────────────────
@Composable
fun UploadErrorScreen(navController: NavController) {
    Box(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Box(
                modifier = Modifier.size(96.dp)
                    .background(RedFake.copy(0.12f), androidx.compose.foundation.shape.CircleShape),
                contentAlignment = Alignment.Center
            ) {
                androidx.compose.material3.Icon(
                    androidx.compose.material.icons.Icons.Default.ErrorOutline,
                    null, tint = RedFake, modifier = Modifier.size(48.dp)
                )
            }
            Spacer(Modifier.height(20.dp))
            Text("Upload Failed", color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text(
                "The image could not be uploaded. Please check your connection or try a smaller file.",
                color = TextMuted, fontSize = 14.sp, lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 8.dp)
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { navController.navigate("upload") { popUpTo("upload_error") { inclusive = true } } },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("Try Again", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = { navController.navigate("home") }) {
                Text("Go Home", color = TextMuted)
            }
        }
    }
}

// ─── Upload Drag-Over Highlight Screen ────────────────────────────────────────
@Composable
fun UploadDragOverScreen(navController: NavController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(PrimaryAccent.copy(0.08f)),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .background(PrimaryAccent.copy(0.15f), RoundedCornerShape(24.dp))
                    .border(3.dp, PrimaryAccent, RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                androidx.compose.material3.Icon(
                    androidx.compose.material.icons.Icons.Default.DragHandle,
                    null, tint = PrimaryAccent, modifier = Modifier.size(60.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Text("Drop Image Here", color = PrimaryAccent, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Release to upload and verify", color = TextMuted, fontSize = 15.sp)
        }
    }
}

// ─── Processing Screen (after upload, AI running) ─────────────────────────────
@Composable
fun ProcessingScreen(navController: NavController) {
    val infiniteTransition = androidx.compose.animation.core.rememberInfiniteTransition(label = "processing_anim")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = androidx.compose.animation.core.infiniteRepeatable(
            animation = androidx.compose.animation.core.tween(1500, easing = androidx.compose.animation.core.LinearEasing),
            repeatMode = androidx.compose.animation.core.RepeatMode.Restart
        ),
        label = "rotation"
    )

    val steps = listOf("Extracting EXIF metadata", "Running compression analysis", "Checking AI/GAN signatures", "Calculating confidence score")
    var currentStep by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(0) }

    androidx.compose.runtime.LaunchedEffect(Unit) {
        repeat(steps.size) { i ->
            kotlinx.coroutines.delay(1200)
            currentStep = i + 1
        }
    }

    Box(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(32.dp)) {
            Box(
                modifier = Modifier.size(100.dp)
                    .background(PrimaryAccent.copy(0.10f), androidx.compose.foundation.shape.CircleShape),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = PrimaryAccent,
                    strokeWidth = 5.dp,
                    modifier = Modifier.size(72.dp)
                )
                Icon(
                    Icons.Default.Psychology,
                    contentDescription = null, tint = PrimaryAccent, modifier = Modifier.size(32.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Text("Analyzing Image", color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("AI forensic engine running...", color = TextMuted, fontSize = 14.sp)
            Spacer(Modifier.height(28.dp))
            steps.forEachIndexed { index, step ->
                val done = currentStep > index
                val active = currentStep == index
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier.size(24.dp)
                            .background(
                                when {
                                    done -> GreenAuthentic.copy(0.15f)
                                    active -> PrimaryAccent.copy(0.15f)
                                    else -> CardBg
                                },
                                androidx.compose.foundation.shape.CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        if (done) {
                            Icon(
                                Icons.Default.Check,
                                contentDescription = null, tint = GreenAuthentic, modifier = Modifier.size(14.dp)
                            )
                        } else if (active) {
                            CircularProgressIndicator(color = PrimaryAccent, strokeWidth = 2.dp, modifier = Modifier.size(14.dp))
                        } else {
                            Box(Modifier.size(6.dp).background(TextDim, androidx.compose.foundation.shape.CircleShape))
                        }
                    }
                    Text(
                        step,
                        color = if (done) GreenAuthentic else if (active) TextMain else TextDim,
                        fontSize = 14.sp,
                        fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal
                    )
                }
            }
        }
    }
}

