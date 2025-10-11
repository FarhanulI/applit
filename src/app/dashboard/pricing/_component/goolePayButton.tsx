/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";

interface GooglePayButtonProps {
  amount: string;
  currency?: string;
  clientId: string;
  merchantId?: string;
  onSuccess?: (orderId: string) => void;
  onError?: (error: any) => void;
  environment?: "TEST" | "PRODUCTION";
}

declare global {
  interface Window {
    paypal?: any;
    google?: any;
  }
}

export default function GooglePayButton({
  amount,
  currency = "USD",
  clientId,
  merchantId = "",
  onSuccess,
  onError,
  environment = "TEST",
}: GooglePayButtonProps) {
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paymentsClientRef = useRef<any>(null);

useEffect(() => {
  const loadPayPalSDK = async (): Promise<any> => {
    if (window.paypal) return window.paypal;

    try {
      const res = await fetch('/api/paypal/client-token');
      const { clientToken } = await res.json();

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=googlepay${merchantId ? `&merchant-id=${merchantId}` : ''}`;
        script.setAttribute('data-client-token', clientToken);
        script.async = true;

        script.onload = () => {
          if (window.paypal) {
            resolve(window.paypal);
          } else {
            reject(new Error('PayPal SDK failed to load'));
          }
        };

        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        document.head.appendChild(script);
      });
    } catch (error) {
      throw new Error('Failed to fetch client token');
    }
  };

  const loadGooglePaySDK = async (): Promise<any> => {
    if (window.google?.payments?.api) return window.google;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = () => {
        if (window.google?.payments?.api) {
          resolve(window.google);
        } else {
          reject(new Error('Google Pay SDK failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Pay SDK'));
      document.head.appendChild(script);
    });
  };

  const initializeGooglePay = async () => {
    try {
      setIsLoading(true);

      // ✅ Load SDKs in parallel
      await Promise.all([loadPayPalSDK(), loadGooglePaySDK()]);

      const paymentsClient = getGooglePaymentsClient();
      paymentsClientRef.current = paymentsClient;

      // ✅ Fetch PayPal's Google Pay config
      const googlePayConfig = await window.paypal.Googlepay().config();
      console.log('✅ Google Pay Config:', googlePayConfig);

      // ✅ Check if Google Pay is ready
      const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
      };

      const isReadyResponse = await paymentsClient.isReadyToPay(isReadyToPayRequest);

      if (isReadyResponse.result) {
        setIsGooglePayReady(true);
        addGooglePayButton(paymentsClient);
      } else {
        console.warn('❌ Not eligible for Google Pay:', isReadyResponse);
        setIsGooglePayReady(false);
      }
    } catch (error) {
      console.error('❌ Error initializing Google Pay:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  initializeGooglePay();
}, [clientId, currency, merchantId, onError]);


  const getGooglePaymentsClient = () => {
    return new window.google.payments.api.PaymentsClient({
      environment: environment,
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
      },
    });
  };

  const addGooglePayButton = (paymentsClient: any) => {
    const button = paymentsClient.createButton({
      onClick: onGooglePaymentButtonClicked,
      buttonType: "pay",
      buttonColor: "default",
      buttonRadius: 4,
    });

    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = "";
      buttonContainerRef.current.appendChild(button);
    }
  };

  const getGooglePaymentDataRequest = async () => {
    const googlePayConfig = await window?.paypal?.Googlepay().config();

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
      transactionInfo: {
        currencyCode: currency,
        totalPriceStatus: "FINAL",
        totalPrice: amount,
      },
      merchantInfo: googlePayConfig.merchantInfo,
      callbackIntents: ["PAYMENT_AUTHORIZATION"],
    };

    // Uncomment for Japan integrations only
    // paymentDataRequest.allowedPaymentMethods[0].parameters.allowedAuthMethods = ['PAN_ONLY'];

    return paymentDataRequest;
  };

  const onGooglePaymentButtonClicked = async () => {
    try {
      const paymentDataRequest = await getGooglePaymentDataRequest();
      const paymentsClient = paymentsClientRef.current;
      await paymentsClient.loadPaymentData(paymentDataRequest);
    } catch (error) {
      console.error("Payment cancelled or error:", error);
      onError?.(error);
    }
  };

  const onPaymentAuthorized = async (paymentData: any) => {
    return new Promise(async (resolve) => {
      try {
        // Create order on server
        const createOrderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: currency,
          }),
        });

        if (!createOrderResponse.ok) {
          throw new Error("Failed to create order");
        }

        const { id: orderId } = await createOrderResponse.json();

        // Confirm order with PayPal
        const confirmOrderResponse = await window.paypal
          .Googlepay()
          .confirmOrder({
            orderId: orderId,
            paymentMethodData: paymentData.paymentMethodData,
          });

        // Handle 3DS if required
        if (confirmOrderResponse.status === "PAYER_ACTION_REQUIRED") {
          await window.paypal.Googlepay().initiatePayerAction({ orderId });

          // Get order details after 3DS
          const orderDetailsResponse = await fetch(`/api/orders/${orderId}`, {
            method: "GET",
          });
          const orderDetails = await orderDetailsResponse.json();

          console.log(
            "3DS Authentication Result:",
            orderDetails?.payment_source?.google_pay?.card
              ?.authentication_result
          );
        }

        // Capture payment
        if (
          confirmOrderResponse.status === "APPROVED" ||
          confirmOrderResponse.status === "PAYER_ACTION_REQUIRED"
        ) {
          const captureResponse = await fetch(
            `/api/orders/${orderId}/capture`,
            {
              method: "POST",
            }
          );

          if (!captureResponse.ok) {
            throw new Error("Failed to capture payment");
          }

          const captureData = await captureResponse.json();

          if (captureData.status === "COMPLETED") {
            onSuccess?.(orderId);
            resolve({ transactionState: "SUCCESS" });
          } else {
            throw new Error("Payment capture failed");
          }
        } else {
          throw new Error("Order confirmation failed");
        }
      } catch (error: any) {
        console.error("Payment processing error:", error);
        onError?.(error);
        resolve({
          transactionState: "ERROR",
          error: {
            intent: "PAYMENT_AUTHORIZATION",
            message: error.message || "TRANSACTION FAILED",
          },
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Loading Google Pay...</div>
      </div>
    );
  }

  if (!isGooglePayReady) {
    return (
      <div className="text-gray-600 p-4">
        Google Pay is not available on this device
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonContainerRef} className="w-full" />
    </div>
  );
}
