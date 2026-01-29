const authService = require("../services/authService");

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password || !targetRole) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await authService.registerUser(req.body);

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    if (err.message === "USER_EXISTS") {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password are required" });
    }

    const { token, user } = await authService.loginUser(req.body);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
      },
    });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
