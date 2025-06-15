const express = require("express");
const User = require("../models/User");
const FinancialInput = require("../models/financialinput");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const router = express.Router();

// Get all users (admin only)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role input
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent revoking the last admin
    if (user.role === "admin" && role === "user") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(403).json({ message: "Cannot revoke last admin" });
      }
    }

    // Update user role directly with updateOne
    await User.updateOne({ _id: id }, { $set: { role } });

    // Fetch updated user without password to return
    const updatedUser = await User.findById(id).select("-password");

    return res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user role:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Prevent changing role through this route (optional)
  if (updates.role) {
    return res.status(400).json({ message: "Use the role-change route to update role" });
  }

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update allowed fields
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save();
    const updatedUser = await User.findById(id).select("-password");

    return res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete a user (admin only)
router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(403).json({ message: "Cannot delete the last admin" });
      }
    }

    await User.deleteOne({ _id: id });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/finance/financial-inputs", authMiddleware, isAdmin, async (req, res) => {
  try {
    // Fetch all financial input records, populate user email for reference
    const financialRecords = await FinancialInput.find()
      .populate("userId", "email name") // populate user email and name fields
      .exec();

    res.json({ financialRecords });
  } catch (error) {
    console.error("Failed to fetch financial inputs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/finance/financial-inputs/:id", authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedRecord = await FinancialInput.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // return the updated document
    ).populate("userId", "email name");

    if (!updatedRecord) {
      return res.status(404).json({ error: "Financial input not found" });
    }

    res.json({ message: "Financial input updated successfully", updatedRecord });
  } catch (error) {
    console.error("Failed to update financial input:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/finance/financial-inputs/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const deleted = await FinancialInput.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;