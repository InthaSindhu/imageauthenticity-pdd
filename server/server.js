const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Python FastAPI AI service endpoint
const AI_SERVICE_URL = 'http://127.0.0.1:5001/analyze';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

/**
 * Forward image to the EfficientNet-B3 Python AI service.
 * Returns the full AI result object from FastAPI.
 */
async function callAIService(imageB64, fileName, metadata) {
  const body = JSON.stringify({ image_b64: imageB64, file_name: fileName, metadata: metadata || {} });

  return new Promise((resolve, reject) => {
    const url = new URL(AI_SERVICE_URL);
    const options = {
      hostname: url.hostname,
      port:     url.port || 5001,
      path:     url.pathname,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 120000,  // 120 s — model inference can take a moment
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            return reject(new Error(`AI service HTTP ${res.statusCode}: ${data}`));
          }
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`AI service returned invalid JSON: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error',   reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('AI service request timed out after 120s')); });
    req.write(body);
    req.end();
  });
}

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [], scans: [], notifications: [], feedback: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], scans: [], notifications: [], feedback: [] };
  }
}

// Helper to write database
function writeDB(data) {
  try {
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

  // Recalculate stats based on scans
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

  // Check if email already exists for another user
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

// Image Verification API — proxies to EfficientNet-B3 Python AI Service
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

  // ── Call EfficientNet-B3 Python AI Service ──────────────────────────────
  let aiResult;
  try {
    // Strip data URI prefix for the AI service
    const imageB64 = image.startsWith('data:') ? image.split(',')[1] : image;
    console.log(`[/api/verify] Forwarding '${fileName}' to Python AI service...`);
    aiResult = await callAIService(imageB64, fileName || 'image.jpg', metadata || {});
    console.log(
      `[/api/verify] AI result: verdict=${aiResult.verdict}, ` +
      `confidence=${aiResult.confidence}%, class_id=${aiResult.class_id}`
    );
  } catch (err) {
    console.error('[/api/verify] AI service error:', err.message);
    return res.status(502).json({
      error: 'AI analysis service unavailable. Ensure the Python FastAPI service is running on port 5001.',
      detail: err.message
    });
  }

  // ── Map AI verdict to scan status ──────────────────────────────────────
  // verdict: "Real" → verified, "Deepfake" | "Tempered" → flagged
  const verdict    = aiResult.verdict    || 'Unknown';
  const confidence = aiResult.confidence || 0;
  const status     = verdict === 'Real' ? 'verified' : 'flagged';

  // ── Build scan record ───────────────────────────────────────────────────
  const now     = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  const id      = `scan_${Date.now()}`;

  const nameLower  = (fileName || '').toLowerCase();
  const format     = (metadata && metadata.format) || (nameLower.endsWith('.png') ? 'PNG' : nameLower.endsWith('.webp') ? 'WEBP' : 'JPEG');
  const fileSize   = (metadata && metadata.fileSize) || aiResult.fileSize || '—';
  const resolution = (metadata && metadata.resolution) || aiResult.resolution || '—';

  const newScan = {
    id,
    userId,
    date:       dateStr,
    time:       timeStr,
    status,

    // ── EfficientNet-B3 authoritative fields ──
    verdict,
    confidence,
    class_id:      aiResult.class_id,
    probabilities: aiResult.probabilities || { Deepfake: 0, Real: 0, Tempered: 0 },
    prediction:    verdict,
    is_real:       verdict === 'Real',
    confidenceTier: aiResult.confidenceTier || (confidence >= 80 ? 'High' : confidence >= 60 ? 'Medium' : 'Low'),
    manipulationType: aiResult.manipulationType || 'Unknown',

    // ── Diagnostic fields from forensic modules ──
    analysis:    aiResult.analysis    || {},
    explanation: aiResult.explanation || '',
    indicators:  aiResult.indicators  || [],

    // ── File / image meta ──
    fileName:   fileName || 'captured_photo.jpg',
    fileSize,
    resolution,
    imageUrl:   image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
    metadata: {
      ...(aiResult.metadata || {}),
      format,
      colorSpace:  'sRGB',
      statusText:  aiResult.metadata?.statusText || `EfficientNet-B3: ${verdict} (${confidence}%)`,
    },

    // ── Model info ──
    aiModel:    aiResult.aiModel    || 'EfficientNet-B3 (CDFFAKE V2)',
    aiAccuracy: aiResult.aiAccuracy || '96.54%',
  };

  // Add scan to history
  db.scans.unshift(newScan);

  // Add a notification
  const notif = {
    id:          `notif_${Date.now()}`,
    userId,
    title:       status === 'verified' ? 'Scan Completed: Real Image' : `Alert: ${verdict} Detected`,
    description: `${newScan.fileName} → ${verdict} (${confidence}% confidence)`,
    type:        status === 'verified' ? 'success' : 'warning',
    time:        'Just now',
    read:        false,
  };
  db.notifications.unshift(notif);

  writeDB(db);

  res.status(201).json(newScan);
});

// History API - Get All Scans
app.get('/api/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-for-', '');

  const db = readDB();
  const userScans = db.scans.filter(s => s.userId === userId);

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

  res.json(scan);
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
});
