import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../context/AppContext"; // Adjust the import path if needed

const PaymentSuccess = () => {
  const { backendUrl, token, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get("reference");

      if (!reference) {
        toast.error("No payment reference found.");
        navigate("/"); 
        return;
      }

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/verify-paystack`,
          { reference },
          {
            headers: {
              token,
            },
          }
        );

        if (data.success) {
          toast.success("Payment verified successfully!");
          loadCreditsData(); // Optional: if you want to reload user credits/subscription
          navigate("/"); // Redirect to dashboard or anywhere
        } else {
          toast.error(data.message || "Payment verification failed.");
          navigate("/"); // Or you can show retry payment
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Error verifying payment."
        );
        navigate("/");
      }
    };

    verifyPayment();
  }, [backendUrl, token, loadCreditsData, location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Verifying Payment...
      </h1>
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">
        Please wait while we confirm your payment.
      </p>
    </div>
  );
};

export default PaymentSuccess;


