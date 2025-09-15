const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin invite endpoint
router.post("/invite", authMiddleware("admin"), async (req, res) => {
  try {
    const { email, role = "member" } = req.body;

    // check duplicate
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      email,
      password: "password", // default password
      role,
      tenantId: req.user.tenantId,
    });

    res.status(201).json({
      message: "User invited successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
