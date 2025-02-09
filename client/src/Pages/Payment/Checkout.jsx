import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layout/Layout";
import { BiRupee } from "react-icons/bi";
import {
  getRazorPayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/Slices/RazorpaySlice";
import toast from "react-hot-toast";
import { getUserData } from "../../Redux/Slices/AuthSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get data from Redux store
  const rzorpayKey = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);
  const userData = useSelector((state) => state?.auth?.data);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Initialize payment data
  useEffect(() => {
    async function initPayment() {
      try {
        await dispatch(getRazorPayId());
        await dispatch(purchaseCourseBundle());
      } catch (error) {
        console.error("Payment initialization error:", error);
        toast.error("Failed to initialize payment");
      }
    }
    initPayment();
  }, [dispatch]);

  async function handleSubscription(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Load Razorpay script if not already loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Validate required data
      if (!rzorpayKey || !subscription_id) {
        // console.error("Missing payment data:", { rzorpayKey, subscription_id });
        toast.error("Payment initialization failed");
        return;
      }

      if (!userData?.email || !userData?.fullName) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const options = {
        key: rzorpayKey,
        subscription_id: subscription_id,
        name: "Lyceum",
        description: "Subscription Bundle Purchase",
        theme: {
          color: "#F4BF1E",
        },
        prefill: {
          email: userData.email,
          name: userData.fullName,
        },
        handler: async function (response) {
          try {
            const paymentDetails = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              razorpay_subscription_id: response.razorpay_subscription_id,
            };

            const verificationResponse = await dispatch(
              verifyUserPayment(paymentDetails)
            ).unwrap();

            if (verificationResponse?.success) {
              await dispatch(getUserData());
              toast.success("Payment Successful!");
              navigate("/checkout/success");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
      });

      // console.log("Opening Razorpay modal with options:", {
      //   key: options.key,
      //   subscription_id: options.subscription_id,
      // });
      
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed to initialize");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <section className="flex flex-col gap-6 items-center py-8 px-3 min-h-[100vh]">
        <form
          onSubmit={handleSubscription}
          className="flex flex-col dark:bg-gray-800 bg-white gap-4 rounded-lg md:py-10 py-7 md:px-8 md:pt-3 px-3 md:w-[500px] w-full shadow-custom dark:shadow-xl transition duration-300"
        >
          <div>
            <h1 className="bg-yellow-500 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg text-white">
              Subscription Bundle
            </h1>
            <div className="px-4 space-y-7 text-center text-gray-600 dark:text-gray-300">
              <p className="text-lg mt-5">
                Unlock access to all available courses on our platform for{" "}
                <span className="text-yellow-500 font-bold">1 year</span>. This
                includes both existing and new courses.
              </p>

              <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                <BiRupee />
                <span>499</span>
              </p>

              <div className="text-xs">
                <p className="text-blue-600 dark:text-yellow-500">
                  100% refund on cancellation
                </p>
                <p>* Terms and conditions apply *</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-yellow-500 transition duration-300 w-full text-xl font-bold text-white py-2 rounded-bl-lg rounded-br-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
                }`}
              >
                {isLoading ? "Processing..." : "Buy now"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
}