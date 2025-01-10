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
  const rzorpayKey = useSelector((state) => state?.razorpay?.key);
  const [subscription_id, setSubscription_id] = useState(
    useSelector((state) => state?.razorpay?.subscription_id) || ""
);
  const isPaymentVerified = useSelector(
    (state) => state?.razorpay?.isPaymentVerified
  );
  const userData = useSelector((state) => state?.auth?.data);
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_signature: "",
    razorpay_subscription_id: subscription_id,
  };

  async function handleSubscription(e) {
    e.preventDefault();
    
    try {
        // Basic validation
        if (!rzorpayKey || !subscription_id) {
            toast.error("Payment initialization failed. Please try again.");
            console.error("Missing key:", { rzorpayKey, subscription_id });
            return;
        }

        // Validate user data
        if (!userData?.email || !userData?.fullName) {
            toast.error("User information is missing. Please login again.");
            return;
        }

        const options = {
            key: rzorpayKey,
            subscription_id: subscription_id,
            name: "Lyceum",
            description: "Subscription Bundle Purchase",
            theme: {
                color: "#F4BF1E"
            },
            prefill: {
                email: userData.email,
                name: userData.fullName
            },
            handler: async function (response) {
                try {
                    paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                    paymentDetails.razorpay_signature = response.razorpay_signature;
                    paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;

                    const res = await dispatch(verifyUserPayment(paymentDetails));
                    
                    if (res?.payload?.success) {
                        await dispatch(getUserData());
                        toast.success("Payment Successful!");
                        navigate("/checkout/success");
                    } else {
                        toast.error("Payment verification failed. Please contact support.");
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                    toast.error("Payment verification failed. Please contact support.");
                }
            }
        };

        // Create Razorpay instance
        const paymentObject = new window.Razorpay(options);
        
        // Add error handler
        paymentObject.on('payment.failed', function (response) {
            toast.error("Payment failed. Please try again.");
            console.error("Payment failed:", response.error);
        });

        // Open payment window
        paymentObject.open();

    } catch (error) {
        // Handle any errors that occur during payment initialization
        console.error("Payment error:", error);
        toast.error("Unable to initialize payment. Please try again.");
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
                className="bg-yellow-500  transition duration-300 w-full text-xl font-bold text-white py-2 rounded-bl-lg rounded-br-lg"
              >
                Buy now
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
}
