import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import paystack from "react-paystack";
import transactionModel from "../models/transactionModel.js";
import axios from "axios";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ sucess: false, message: "Missing Details" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ sucess: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ sucess: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        sucess: true,
        token,
        user: { name: user.name },
      });
    } else {
      return res.json({ sucess: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({
      sucess: true,
      credits: user.creditBalance,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: error.message });
  }
};

// const axios = require("axios");
const paymentPaystack = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 3;
        amount = 1000;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 2;
        amount = 1500;
        break;
      case "Business":
        plan = "Business";
        credits = 1;
        amount = 2500;
        break;
      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    date = Date.now();

    // Create transaction in your DB
    const newTransaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date,
    });

    
    // Initialize payment with Paystack
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userData.email,
        amount: amount * 100, 
        metadata: {
          transactionId: newTransaction._id,
          userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_KEY_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url } = paystackResponse.data.data;

    
    console.log('newTransaction')
    // console.log(user)
    console.log(newTransaction)
    console.log(newTransaction?.credits)
    // Update the user's credit balance
    userData.creditBalance += newTransaction?.credits;
    await userData.save(); 

    res.json({
      success: true,
      message: `${newTransaction?.credits} has been credited to your balance`, 
      credits: newTransaction?.credits,
      url: authorization_url,
    });
  } catch (error) {
    console.log(error.response?.data || error);
    res.json({ success: false, message: error.message });
  }
};

// const paymentSuccess = async (req, res) => {
//   try {
    
//     console.log('entering into the function')
//     const { transactionId } = req.body; // ID of the transaction after Paystack confirmation

//     // Find the transaction in the database
//     const transaction = await transactionModel.findById(transactionId);
//     if (!transaction) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Transaction not found!" });
//     }

//     // Check if the transaction is already processed
//     if (transaction.paymentStatus === true) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Transaction already processed!" });
//     }

//     // Find the user based on the transaction's userId
//     const user = await userModel.findById(transaction.userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found!" });
//     }
//     console.log('user')
//     console.log(user)
//     // Update the user's credit balance
//     user.creditBalance += transaction.credits; // Add the credits from the transaction
//     await user.save(); // Save the updated user model

//     // Mark the transaction as successful
//     transaction.paymentStatus = true; // Update payment status
//     await transaction.save(); // Save the updated transaction

//     // Return a success message
//     res
//       .status(200)
//       .json({ success: true, message: "Credits added successfully!" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export {
  registerUser,
  loginUser,
  userCredits,
  paymentPaystack,
  // paymentSuccess,
};
