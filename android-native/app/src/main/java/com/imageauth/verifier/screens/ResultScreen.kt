package com.imageauth.verifier.screens

import androidx.compose.runtime.Composable
import androidx.navigation.NavController

@Composable
fun ResultScreen(navController: NavController) {
    val scan = SharedScanResult.currentScan

    if (scan == null) {
        ResultUncertainScreen(navController)
        return
    }

    when (scan.status.lowercase()) {
        "verified" -> ResultAuthenticScreen(navController)
        "flagged" -> ResultFakeScreen(navController)
        else -> ResultUncertainScreen(navController)
    }
}
