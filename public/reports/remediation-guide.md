# 🛠️ Security Remediation & Hardening Guide

## 1. Fix Mock JWT Authentication (SEC-001)

### Install `jsonwebtoken`:
```bash
npm install jsonwebtoken bcryptjs helmet express-rate-limit
```

### Update `server/server.cjs`:
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Enable security headers
app.use(helmet());

// Enable Rate Limiting (100 reqs / 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// Verify Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}
```

---

## 2. Password Hashing (SEC-002)

### Hash password on signup:
```javascript
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    stats: { totalScans: 0, verified: 0, flagged: 0, accuracy: 100 }
  };
  // Save user...
});
```
