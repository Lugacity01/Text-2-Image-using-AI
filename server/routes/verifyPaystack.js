import express from "express";
import axios from "axios";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_KEY_SECRET;

router.post("/verify-paystack", async (req, res) => {
  const { reference } = req.body;

  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Reference is required" });
  }

  try {
    // 1. Verify with Paystack
    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = data.data;

    if (paymentData.status === "success") {
      // 2. Find transaction
      const transaction = await Transaction.findOne({
        userId: paymentData.metadata.userId,
        payment: false,
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found or already paid.",
        });
      }

      // 3. Update transaction as paid
      transaction.payment = true;
      await transaction.save();

      // 4. Update user credits
      const user = await User.findById(transaction.userId);
      if (user) {
        user.credits = (user.credits || 0) + transaction.credits;
        await user.save();
      }

      return res.json({
        success: true,
        message: "Payment verified and user updated.",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful." });
    }
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment." });
  }
});

export default router;
