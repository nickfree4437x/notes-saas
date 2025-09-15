const express = require("express");
const Tenant = require("../models/Tenant");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Upgrade tenant plan (Admin only, own tenant only)
router.post("/:slug/upgrade", authMiddleware("admin"), async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Admin can upgrade ONLY their own tenant
    if (tenant._id.toString() !== req.user.tenantId) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot upgrade another tenant" });
    }

    // Update plan to Pro
    tenant.plan = "pro";
    await tenant.save();

    res.json({
      message: "Tenant upgraded to Pro 🚀",
      tenant: { slug: tenant.slug, plan: tenant.plan },
    });
  } catch (err) {
    console.error("Upgrade Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in user's tenant info
router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({
      slug: tenant.slug,
      plan: tenant.plan,
    });
  } catch (err) {
    console.error("Tenant Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
