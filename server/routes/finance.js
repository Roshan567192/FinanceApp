const express = require("express");
const FinancialInput = require("../models/financialinput");
const { authMiddleware } = require("../middleware/auth"); // destructure here
const router = express.Router();

router.post("/submit", authMiddleware, async (req, res) => {
  const { inputData } = req.body;

  // your calculation logic here
  const calculatedResult = performCalculations(inputData);

  try {
    const record = await FinancialInput.create({
      userId: req.user.id,
      inputData,
      calculatedResult,
    });
    res.json({ calculatedResult });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

function performCalculations(data) {
  const totalRevenue = data.unitsSold * data.pricePerUnit;
  const profit = totalRevenue - data.cost;
  return { totalRevenue, profit };
}

module.exports = router;
