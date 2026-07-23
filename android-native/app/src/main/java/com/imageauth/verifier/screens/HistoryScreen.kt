package com.imageauth.verifier.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.imageauth.verifier.models.Scan
import com.imageauth.verifier.network.RetrofitClient
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var scans by remember { mutableStateOf<List<Scan>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf("") }

    fun fetchHistory() {
        isLoading = true
        scope.launch {
            try {
                scans = RetrofitClient.getService().getHistory()
            } catch (e: Exception) {
                errorMessage = e.message ?: "Failed to fetch history"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        fetchHistory()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Scan History", color = TextMain) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain)
                    }
                },
                actions = {
                    if (scans.isNotEmpty()) {
                        IconButton(onClick = {
                            scope.launch {
                                try {
                                    RetrofitClient.getService().clearHistory()
                                    fetchHistory()
                                } catch (e: Exception) {
                                    errorMessage = "Clear failed"
                                }
                            }
                        }) {
                            Icon(Icons.Default.Delete, contentDescription = "Clear All", tint = Color.Red)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBg)
            )
        },
        containerColor = DarkBg
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
                if (isLoading) {
                CircularProgressIndicator(
                    color = PrimaryAccent,
                    modifier = Modifier.align(Alignment.Center)
                )
            } else if (errorMessage.isNotEmpty()) {
                Text(
                    text = errorMessage,
                    color = Color.Red,
                    fontSize = 15.sp,
                    modifier = Modifier.align(Alignment.Center)
                )
            } else if (scans.isEmpty()) {
                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("No scans found.", color = TextMuted, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Any images you verify will appear here.", color = TextMuted.copy(alpha = 0.7f), fontSize = 13.sp)
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(scans) { scan ->
                        val statusColor = when (scan.status.lowercase()) {
                            "verified" -> Color(0xFF10B981) // Green
                            "flagged" -> Color(0xFFEF4444) // Red
                            else -> Color(0xFFF59E0B) // Yellow
                        }

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    SharedScanResult.currentScan = scan
                                    navController.navigate("result")
                                },
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = CardBg)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AsyncImage(
                                    model = scan.imageUrl,
                                    contentDescription = "Scan thumbnail",
                                    modifier = Modifier
                                        .size(64.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .border(1.dp, DarkBg, RoundedCornerShape(8.dp)),
                                    contentScale = ContentScale.Crop
                                )

                                Spacer(modifier = Modifier.width(16.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = scan.fileName,
                                        color = TextMain,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .background(statusColor.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = scan.prediction,
                                                color = statusColor,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "${scan.date} | ${scan.time}",
                                            color = TextMuted,
                                            fontSize = 11.sp
                                        )
                                    }
                                }

                                IconButton(
                                    onClick = {
                                        scope.launch {
                                            try {
                                                RetrofitClient.getService().deleteScan(scan.id)
                                                fetchHistory()
                                            } catch (e: Exception) {
                                                errorMessage = "Deletion failed"
                                            }
                                        }
                                    }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Delete item",
                                        tint = TextMuted
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─── History Empty Screen ─────────────────────────────────────────────────────
@Composable
fun HistoryEmptyScreen(navController: NavController) {
    Box(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(32.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .background(CardBg, androidx.compose.foundation.shape.CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    androidx.compose.material.icons.Icons.Default.History,
                    null, tint = TextMuted, modifier = Modifier.size(50.dp)
                )
            }
            Spacer(Modifier.height(24.dp))
            Text("No Scan History", color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text(
                "Your verification history is empty. Start by scanning an image to see results here.",
                color = TextMuted, fontSize = 14.sp, lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 8.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(Modifier.height(32.dp))
            Button(
                onClick = { navController.navigate("upload") },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryAccent),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("Verify First Image", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        }
    }
}

// ─── History Loading Screen ───────────────────────────────────────────────────
@Composable
fun HistoryLoadingScreen(navController: NavController) {
    Column(
        modifier = Modifier.fillMaxSize().background(DarkBg)
    ) {
        Box(
            modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, contentDescription = null, tint = TextMain)
            }
            Text("Scan History", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }
        // Shimmer placeholders
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(6) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg)
                ) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Box(Modifier.size(64.dp).background(CardBgLight, RoundedCornerShape(8.dp)))
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(Modifier.width(160.dp).height(14.dp).background(CardBgLight, RoundedCornerShape(4.dp)))
                            Box(Modifier.width(100.dp).height(10.dp).background(CardBgLight, RoundedCornerShape(4.dp)))
                        }
                    }
                }
            }
        }
    }
}

// ─── Search & Filter Screen ───────────────────────────────────────────────────
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchFilterScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var query by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("All") }
    var allScans by remember { mutableStateOf<List<Scan>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        scope.launch {
            try { allScans = RetrofitClient.getService().getHistory() }
            catch (_: Exception) {}
            finally { isLoading = false }
        }
    }

    val filters = listOf("All", "Authentic", "Fake", "Uncertain")
    val filtered = allScans.filter { scan ->
        val matchesQuery = query.isEmpty() || scan.fileName.contains(query, ignoreCase = true)
        val matchesFilter = when (selectedFilter) {
            "Authentic" -> scan.status == "verified"
            "Fake" -> scan.status == "flagged"
            "Uncertain" -> scan.status == "uncertain"
            else -> true
        }
        matchesQuery && matchesFilter
    }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Box(modifier = Modifier.fillMaxWidth().background(CardBg).padding(horizontal = 16.dp, vertical = 14.dp)) {
            IconButton(onClick = { navController.popBackStack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, contentDescription = null, tint = TextMain)
            }
            Text("Search & Filter", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center))
        }

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            // Search bar
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                placeholder = { Text("Search by file name...", color = TextDim) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextMuted) },
                trailingIcon = {
                    if (query.isNotEmpty()) {
                        IconButton(onClick = { query = "" }) {
                            Icon(Icons.Default.Clear, contentDescription = null, tint = TextMuted)
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryAccent,
                    unfocusedBorderColor = CardBgLight,
                    focusedTextColor = TextMain,
                    unfocusedTextColor = TextMain
                ),
                singleLine = true
            )

            Spacer(Modifier.height(12.dp))

            // Filter chips
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                filters.forEach { filter ->
                    FilterChip(
                        selected = selectedFilter == filter,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = PrimaryAccent,
                            selectedLabelColor = Color.White,
                            containerColor = CardBg,
                            labelColor = TextMuted
                        )
                    )
                }
            }

            Spacer(Modifier.height(12.dp))
            Text("${filtered.size} result${if (filtered.size != 1) "s" else ""}", color = TextMuted, fontSize = 13.sp)
            Spacer(Modifier.height(8.dp))

            if (isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = PrimaryAccent)
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(filtered) { scan ->
                        val statusColor = when (scan.status) {
                            "verified" -> GreenAuthentic; "flagged" -> RedFake; else -> OrangeUncertain
                        }
                        Card(
                            modifier = Modifier.fillMaxWidth().clickable {
                                SharedScanResult.currentScan = scan
                                navController.navigate("result")
                            },
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = CardBg)
                        ) {
                            Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Box(
                                    modifier = Modifier.size(48.dp)
                                        .background(statusColor.copy(0.12f), RoundedCornerShape(10.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        when (scan.status) {
                                            "verified" -> Icons.Default.CheckCircle
                                            "flagged" -> Icons.Default.Cancel
                                            else -> Icons.Default.Help
                                        },
                                        contentDescription = null, tint = statusColor, modifier = Modifier.size(24.dp)
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(scan.fileName, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, maxLines = 1)
                                    Text("${scan.prediction} • ${scan.confidence}%", color = statusColor, fontSize = 12.sp)
                                    Text("${scan.date} ${scan.time}", color = TextDim, fontSize = 11.sp)
                                }
                                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = TextDim, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

