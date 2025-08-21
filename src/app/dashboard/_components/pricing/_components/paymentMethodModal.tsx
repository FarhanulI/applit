/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payment-modal.tsx
'use client';

import { useState } from 'react';
import { X, CreditCard, Wallet } from 'lucide-react';
import { PricingPlan } from '@/types/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  onPaymentSuccess: (paymentData: any, provider: 'stripe' | 'paypal') => void;
}

type PaymentMethod = 'stripe' | 'paypal' | null;

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  plan, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePaymentSuccess = (paymentData: any, provider: 'stripe' | 'paypal') => {
    setIsProcessing(false);
    onPaymentSuccess(paymentData, provider);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    setIsProcessing(false);
    console.error('Payment failed:', error);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-semibold text-lg">{plan.name}</h3>
          <p className="text-3xl font-bold text-blue-600">
            {/* @ts-ignore */}
            {plan?.currency}{plan.price}
            {plan.name.toLowerCase().includes('month') && '/month'}
          </p>
          <ul className="mt-3 space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method Selection */}
        {!selectedMethod && (
          <div className="p-6">
            <h4 className="font-semibold mb-4">Choose Payment Method</h4>
            <div className="space-y-3">
              {/* Stripe Option */}
              <button
                onClick={() => setSelectedMethod('stripe')}
                className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                  </div>
                </div>
                <div className="text-blue-600 font-medium">Stripe</div>
              </button>

              {/* PayPal Option */}
              <button
                onClick={() => setSelectedMethod('paypal')}
                className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Wallet className="w-6 h-6 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                  </div>
                </div>
                <div className="text-blue-600 font-medium">PayPal</div>
              </button>
            </div>
          </div>
        )}

        {/* Payment Forms */}
        {selectedMethod && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-blue-600 hover:text-blue-700 text-sm mr-3"
              >
                ← Back to payment methods
              </button>
              <span className="text-sm text-gray-500">
                Paying with {selectedMethod === 'stripe' ? 'Credit Card' : 'PayPal'}
              </span>
            </div>

            {/* {selectedMethod === 'stripe' && (
              <StripePayment
                amount={plan.price}
                currency={plan.currency.toLowerCase()}
                planId={plan.planId}
                onSuccess={(data) => handlePaymentSuccess(data, 'stripe')}
                onError={handlePaymentError}
                onProcessing={setIsProcessing}
              />
            )}

            {selectedMethod === 'paypal' && (
              <PayPalPayment
                amount={plan.price.toString()}
                currency={plan.currency}
                planId={plan.planId}
                onSuccess={(data) => handlePaymentSuccess(data, 'paypal')}
                onError={handlePaymentError}
                onProcessing={setIsProcessing}
              />
            )} */}
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Processing payment...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}