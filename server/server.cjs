const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let cachedDB = null;
let lastReadTime = 0;

// Helper to read database with in-memory caching
function readDB() {
  const now = Date.now();
  if (cachedDB && (now - lastReadTime < 5000)) {
    return cachedDB;
  }
  try {
    if (!fs.existsSync(DB_FILE)) {
      cachedDB = { users: [], scans: [], notifications: [], feedback: [] };
    } else {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      cachedDB = JSON.parse(data);
    }
    lastReadTime = now;
    return cachedDB;
  } catch (error) {
    console.error('Error reading database:', error);
    return cachedDB || { users: [], scans: [], notifications: [], feedback: [] };
  }
}

// Helper to write database
function writeDB(data) {
  try {
    cachedDB = data;
    lastReadTime = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database:', error);
  }
}


// Auth API - Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = `mock-jwt-token-for-${user.id}`;
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({ token, user: userWithoutPassword });
});

// Auth API - Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDB();
  const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    stats: {
      totalScans: 0,
      verified: 0,
      flagged: 0,
      accuracy: 100
    }
  };

  db.users.push(newUser);
  writeDB(db);

  const token = `mock-jwt-token-for-${newUser.id}`;
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({ token, user: userWithoutPassword });
});

// Auth API - Get Profile
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userScans = db.scans.filter(s => s.userId === userId);
  const totalScans = userScans.length;
  const verified = userScans.filter(s => s.status === 'verified').length;
  const flagged = userScans.filter(s => s.status === 'flagged').length;
  const accuracy = totalScans > 0 ? Math.round((verified / totalScans) * 100) : 100;

  user.stats = { totalScans, verified, flagged, accuracy };
  writeDB(db);

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Auth API - Update Profile
app.put('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const emailExists = db.users.some(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ error: 'Email is already taken' });
  }

  db.users[userIndex].name = name;
  db.users[userIndex].email = email;
  writeDB(db);

  const { password: _, ...userWithoutPassword } = db.users[userIndex];
  res.json(userWithoutPassword);
});

// Auth API - Change Password
app.put('/api/auth/change-password', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (db.users[userIndex].password !== oldPassword) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }

  db.users[userIndex].password = newPassword;
  writeDB(db);

  res.json({ message: 'Password updated successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Image Verification API — calls Python Forensic AI Service (port 5001)
// NO rule-based fallback. If AI service is down, returns 503 with clear error.
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { image, fileName, metadata } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image content is required' });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate & parse image
  let base64Data;
  try {
    base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    if (!base64Data || base64Data.length < 100) {
      return res.status(400).json({ error: 'Corrupted or unsupported image file.' });
    }
  } catch (e) {
    return res.status(400).json({ error: 'Failed to parse image data.' });
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
  const isPNG  = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWEBP = buffer.length > 12 && buffer.slice(8, 12).toString('ascii') === 'WEBP';

  if (!isJPEG && !isPNG && !isWEBP) {
    return res.status(400).json({ error: 'Unsupported image format. Please upload a JPEG, PNG, or WebP image.' });
  }
  if (buffer.length < 2048) {
    return res.status(400).json({ error: 'Image is too small or corrupted.' });
  }

  // ── Call Python Forensic AI Service (REQUIRED — no fallback) ─────────────
  let analysisResult;
  try {
    const payload = JSON.stringify({
      image_b64: image,
      file_name: fileName || 'captured_photo.jpg',
      metadata:  metadata || {}
    });

    analysisResult = await new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };
      const httpReq = http.request(options, (httpRes) => {
        let data = '';
        httpRes.on('data', chunk => { data += chunk; });
        httpRes.on('end', () => {
          if (httpRes.statusCode >= 400) {
            return reject(new Error(`FastAPI returned HTTP ${httpRes.statusCode}: ${data}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON from AI service: ${data.slice(0, 200)}`));
          }
        });
      });
      httpReq.on('error', (e) => reject(new Error(`Cannot reach AI service: ${e.message}`)));
      httpReq.setTimeout(120000, () => {
        httpReq.destroy();
        reject(new Error('AI service timeout after 120s'));
      });
      httpReq.write(payload);
      httpReq.end();
    });

    // ── Log the binary AI classification response in terminal ──
    console.log("RESPONSE:", analysisResult);
    console.log('='.repeat(60));
    console.log('[Express] FastAPI Response:', JSON.stringify({
      verdict:        analysisResult.verdict,
      is_real:        analysisResult.is_real,
      confidence:     analysisResult.confidence,
      status:         analysisResult.status,
      prediction:     analysisResult.prediction
    }, null, 2));
    console.log('='.repeat(60));

  } catch (aiErr) {
    // NO FALLBACK — surface the real error
    console.error(`[Express] AI service FAILED: ${aiErr.message}`);
    return res.status(503).json({
      error: 'AI analysis service unavailable. Please ensure the Python service is running on port 5001.',
      details: aiErr.message
    });
  }

  // ── Build & Store Scan ────────────────────────────────────────────────────
  const now     = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  const scanId  = `scan_${Date.now()}`;

  const newScan = {
    id:               scanId,
    userId,
    date:             dateStr,
    time:             timeStr,
    verdict:          analysisResult.verdict || (analysisResult.status === 'verified' ? 'Real' : 'Fake'),
    is_real:          analysisResult.is_real !== undefined ? analysisResult.is_real : (analysisResult.status === 'verified'),
    status:           analysisResult.status,
    prediction:       analysisResult.prediction,
    confidence:       analysisResult.confidence,
    confidenceTier:   analysisResult.confidenceTier,
    manipulationType: analysisResult.manipulationType,
    explanation:      Array.isArray(analysisResult.explanation)
                        ? analysisResult.explanation.join(' | ')
                        : (analysisResult.explanation || ''),
    fileName:         analysisResult.fileName || fileName || 'captured_photo.jpg',
    fileSize:         analysisResult.fileSize  || `${(buffer.length / 1048576).toFixed(1)} MB`,
    resolution:       analysisResult.resolution || (metadata && metadata.resolution) || '—',
    imageUrl:         image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
    metadata:         analysisResult.metadata  || {},
    indicators:       analysisResult.indicators || [],
    heatmap:          analysisResult.heatmap   || null,
    forensicDetails:  analysisResult.forensicDetails || null,
    aiModel:          analysisResult.aiModel   || 'EfficientNet-B3 Multi-Stage Forensic Engine v4.0',
    aiAccuracy:       analysisResult.aiAccuracy || '96.54% Test Accuracy — 3-Class: Deepfake / Real / Tempered'
  };

  db.scans.unshift(newScan);
  db.notifications.unshift({
    id:          `notif_${Date.now()}`,
    userId,
    title:       newScan.status === 'verified' ? 'Scan Complete — Authentic' :
                 newScan.status === 'flagged'  ? '⚠ Alert: Image Flagged'   : 'Scan Complete — Uncertain',
    description: `${newScan.fileName} analyzed: ${
                   newScan.status === 'verified' ? 'Verified Authentic' :
                   newScan.status === 'flagged'  ? 'Flagged as Manipulated' : 'Result Uncertain'
                 } (${newScan.confidence}% confidence).`,
    type:        newScan.status === 'verified' ? 'success' : newScan.status === 'flagged' ? 'warning' : 'info',
    time:        'Just now',
    read:        false
  });
  writeDB(db);

  res.status(201).json(newScan);
});

// NOTE: Rule-based fallback has been REMOVED.
// If the AI service (port 5001) is unavailable, the /api/verify route returns HTTP 503.
// This prevents silently returning hardcoded/inaccurate scores.


// History API - Get All Scans
app.get('/api/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  const userScans = db.scans
    .filter(s => s.userId === userId)
    .map(s => ({
      ...s,
      // Ensure explanation is always a String (old DB entries may have stored arrays)
      explanation: Array.isArray(s.explanation) ? s.explanation.join(' | ') : (s.explanation || '')
    }));

  res.json(userScans);
});

// History API - Get Single Scan
app.get('/api/history/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { id } = req.params;

  const db = readDB();
  const scan = db.scans.find(s => s.id === id && s.userId === userId);

  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  // Sanitize explanation: always return as String for Android Gson compatibility
  const sanitized = {
    ...scan,
    explanation: Array.isArray(scan.explanation) ? scan.explanation.join(' | ') : (scan.explanation || '')
  };

  res.json(sanitized);
});

// History API - Delete Single Scan
app.delete('/api/history/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { id } = req.params;

  const db = readDB();
  const scanIndex = db.scans.findIndex(s => s.id === id && s.userId === userId);

  if (scanIndex === -1) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  db.scans.splice(scanIndex, 1);
  writeDB(db);

  res.json({ message: 'Scan deleted successfully' });
});

// History API - Clear All
app.post('/api/history/clear', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  db.scans = db.scans.filter(s => s.userId !== userId);
  writeDB(db);

  res.json({ message: 'History cleared successfully' });
});

// Notifications API - Get All
app.get('/api/notifications', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  const userNotifications = db.notifications.filter(n => n.userId === userId);

  res.json(userNotifications);
});

// Notifications API - Mark All Read
app.post('/api/notifications/read-all', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  db.notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  writeDB(db);

  res.json({ message: 'Notifications marked as read' });
});

// Feedback API
app.post('/api/feedback', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');
  const { rating, message, type } = req.body;

  if (!rating) {
    return res.status(400).json({ error: 'Rating is required' });
  }

  const db = readDB();
  const feedbackItem = {
    id: `fb_${Date.now()}`,
    userId,
    rating,
    message: message || '',
    type: type || 'General',
    timestamp: new Date().toISOString()
  };

  db.feedback.push(feedbackItem);
  writeDB(db);

  res.status(201).json({ message: 'Feedback submitted successfully', feedback: feedbackItem });
});

// Start Server - bind to 0.0.0.0 so Android devices on the same Wi-Fi can connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Also accessible on your LAN at http://10.110.11.13:${PORT}`);
  console.log(`AI Forensic Service expected at http://localhost:5001`);
});
