const jwt = require("jsonwebtoken");

// Mock user data
const users = [
  { id: "1", username: "manager", password: "123456", role: "manager" },
];

// Login Controller
exports.login = (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบ username และ password
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // สร้าง JWT
  const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({ accessToken, refreshToken });
};

// Refresh Token Controller
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // สร้าง access token ใหม่
    const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};