import React, { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import PaystackPop from "@paystack/inline-js";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "motion/react";
// import { useNavigate } from "react-router-dom";
import ReceiptPayment from "../components/ReceiptPayment";

const BuyCredit = () => {
  
  console.count("renderer: ")

  const [isOpen, setIsOpen] = useState(false)
  const [transaction, setTransaction] = useState()
  // const [credits, setCredits] = useState()
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);

  // const navigate = useNavigate();

  // const userEmail = user.email;

  // console.log('email addressese',userEmail);

  // Initialize Paystack payment
  const initPay = (order, credits) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_KEY_ID,
      email: user.email,
      amount: order.amount,
      currency: "NGN",
      ref: "" + Math.floor(Math.random() * 1000000000 + 1), // Generate random reference
      callback: function (response) {
        // Payment success callback
        toast.success("Payment successful!");
        setIsOpen(true)
        setTransaction({...response, credits: credits})
        console.log("Payment successful:", response);

        // Optionally, verify transaction from backend here
        loadCreditsData(); // Update credit balance
      },
      onClose: function () {
        toast.info("Transaction was cancelled.");
      },
    });

    handler.openIframe();
  };

  // Handle Paystack payment process
  const paymentPaystack = async (planId) => {
    console.log("Current User:", user);
    console.log("Current Token:", token);
    console.log("Plan Selected:", planId);

    // Find the selected plan from the plans array
    const selectedPlan = plans.find((plan) => plan.id === planId);

    if (!selectedPlan) {
      toast.error("Invalid plan selected.");
      return;
    }

    try {
      if (!user) {
        return setShowLogin(true);
      }

      // Send the planId to the backend and fetch order details
      const { data } = await axios.post(
        backendUrl + "/api/user/pay-paystack",
        { planId },
        { headers: { token } }
      );

      console.log("Confirm the data", data);

      // If the backend confirms the payment process
      if (data.success) {
        const order = {
          amount: selectedPlan.price * 100,
          credits: selectedPlan.credits,
          description: selectedPlan.desc,
          planId: selectedPlan.id,
        };
        // setCredits(data.credits)
        initPay(order, data.credits); // Trigger Paystack payment
        // navigate("/receipt-payment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border-gray-300 rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">{item.price} </span>/{" "}
              {item.credits} credits
            </p>
            <button
              onClick={() => paymentPaystack(item.id)} // Send selected planId to payment handler
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
      {
        isOpen
        &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ReceiptPayment data={transaction} />
        </div>
      }
    </motion.div>
  );
};

export default BuyCredit;
