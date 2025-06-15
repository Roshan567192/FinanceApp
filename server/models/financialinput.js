const mongoose = require('mongoose');

const financialInputSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inputData: Object,
  calculatedResult: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FinancialInput', financialInputSchema);
