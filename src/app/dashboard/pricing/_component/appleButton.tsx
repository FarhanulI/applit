// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import React, { useEffect, useState } from "react";

// // const AppleButton = ({ order, onApprove, onError }: any) => {
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   const handleApplePayClick = async () => {
// //     setIsProcessing(true);
// //     try {
// //       const paypal = (window as any).paypal;

// //       if (!paypal?.Applepay) {
// //         throw new Error("Apple Pay SDK not loaded");
// //       }

// //       // Create order first
// //       const orderResponse = await fetch("/api/apple-pay", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           amount: 1000,
// //           description: 'asdasdsad',
// //         }),
// //       });

// //       const orderData = await orderResponse.json();

// //       console.log({orderData});
      

// //       if (!orderData.id) {
// //         throw new Error("Failed to create order");
// //       }

// //       // Initialize Apple Pay
// //       const applepay = paypal.Applepay();

// //       applepay.config({
// //         merchantId: process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID,
// //         storeName: "Applit",
// //       });

// //       applepay.addEventListener("onApprove", async (orderDetails: any) => {
// //         try {
// //           // Capture the order with Apple Pay payment source
// //           const captureResponse = await fetch(
// //             `/api/orders/${orderData.id}/capture`,
// //             {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //               },
// //               body: JSON.stringify({
// //                 paymentSource: {
// //                   apple_pay: {
// //                     id: orderDetails.paymentMethodId,
// //                   },
// //                 },
// //               }),
// //             }
// //           );

// //           const capturedOrder = await captureResponse.json();

// //           if (capturedOrder.status === "COMPLETED") {
// //             onApprove({ orderID: orderData.id }, {});
// //           } else {
// //             throw new Error("Payment capture failed");
// //           }
// //         } catch (error) {
// //           console.error("Error capturing order:", error);
// //           onError(error);
// //         } finally {
// //           setIsProcessing(false);
// //         }
// //       });

// //       applepay.addEventListener("onError", (err: any) => {
// //         console.error("Apple Pay error:", err);
// //         onError(err);
// //         setIsProcessing(false);
// //       });

// //       applepay.addEventListener("onCancel", () => {
// //         console.log("Apple Pay cancelled");
// //         setIsProcessing(false);
// //       });

// //       // Initiate the Apple Pay session
// //       applepay.initXO();
// //     } catch (error) {
// //       console.error("Apple Pay initialization error:", error);
// //       onError(error);
// //       setIsProcessing(false);
// //     }
// //   };
// //   return (
// //      <button
// //       onClick={handleApplePayClick}
// //       disabled={isProcessing}
// //       style={{
// //         backgroundColor: isProcessing ? '#cccccc' : '#000',
// //         color: '#fff',
// //         padding: '12px 24px',
// //         borderRadius: '8px',
// //         border: 'none',
// //         cursor: isProcessing ? 'not-allowed' : 'pointer',
// //         fontSize: '16px',
// //         fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
// //         width: '100%',
// //         fontWeight: '600',
// //         transition: 'background-color 0.2s',
// //       }}
// //     >
// //       {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
// //     </button>
// //   );
// // };
// // export default AppleButton;

// // components/ApplePayButton.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { loadScript } from "@paypal/paypal-js";

// export default function ApplePayButton() {
//   const [isEligible, setIsEligible] = useState(false);
//   const [sdkReady, setSdkReady] = useState(false);

//   useEffect(() => {
//     async function loadPaypal() {
//       try {
//         const paypal = await loadScript({
//           clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
//           currency: "USD",
//           components: "applepay",
//           merchantId: process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID, // optional, if using advanced payments
//         });

//         if (
//           typeof window === "undefined" ||
//           !window.ApplePaySession ||
//           !ApplePaySession.canMakePayments()
//         ) {
//           console.warn("Apple Pay not supported on this device/browser");
//           return;
//         }

//         if (!paypal || !paypal.Applepay) {
//           console.error("PayPal SDK or Applepay component not loaded");
//           return;
//         }

//         const applepay = paypal.Applepay();

//         const config = await applepay.config();
//         if (config?.isEligible) {
//           setIsEligible(true);
//           setSdkReady(true);
//           const container = document.getElementById("applepay-container");
//           if (container) {
//             container.innerHTML = `<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en"></apple-pay-button>`;
//           }
//         } else {
//           console.log("Merchant is not eligible for Apple Pay");
//         }
//       } catch (err) {
//         console.error("Error loading PayPal SDK or checking Apple Pay eligibility", err);
//       }
//     }

//     loadPaypal();
//   }, []);

//   const handleClick = async () => {
//     try {
//       const paypal = (window as any).paypal;
//       const applepay = paypal?.Applepay();

//       if (!applepay) throw new Error("PayPal Applepay instance not available");

//       applepay.initXO();

//       applepay.addEventListener("onValidateMerchant", async (event: any) => {
//         try {
//           const merchantSession = await applepay.validateMerchant(event.validationUrl);
//           event.completeMerchantValidation(merchantSession);
//         } catch (err) {
//           console.error("Merchant validation failed:", err);
//           event.abort();
//         }
//       });

//       applepay.addEventListener("onPaymentAuthorized", async (event: any) => {
//         try {
//           const orderRes = await fetch("/api/apple-pay", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               amount: 1000,
//               description: "Order description",
//             }),
//           });

//           const order = await orderRes.json();

//           const confirmRes = await applepay.confirmOrder(order.id, {
//             paymentMethodId: event.payment.token.paymentData,
//           });

//           if (confirmRes.status === "COMPLETED") {
//             event.completePayment({ status: "SUCCESS" });
//           } else {
//             event.completePayment({ status: "FAILURE" });
//           }
//         } catch (err) {
//           console.error("Payment failed:", err);
//           event.completePayment({ status: "FAILURE" });
//         }
//       });

//       applepay.addEventListener("onCancel", () => {
//         console.log("Apple Pay cancelled");
//       });
//     } catch (err) {
//       console.error("Apple Pay session init failed:", err);
//     }
//   };

//   return (
//     <div>
//       {sdkReady && isEligible ? (
//         <div id="applepay-container" onClick={handleClick}></div>
//       ) : (
//         <p>Apple Pay is not available on this device</p>
//       )}
//     </div>
//   );
// }

