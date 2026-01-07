'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Loader2, AlertCircle } from 'lucide-react'
import { transactionsAPI, referralsAPI } from '@/lib/api'

interface Plan {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  durationType?: string
  features: (string | { name: string; description: string })[]
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan
  onPaymentSuccess: () => void
  onPaymentError: (error: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  onPaymentSuccess,
  onPaymentError,
}: PaymentModalProps) {
  const [referralCode, setReferralCode] = useState('')
  const [referralDiscount, setReferralDiscount] = useState<any>(null)
  const [validatingReferral, setValidatingReferral] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript()
    }
  }, [isOpen])

  const loadRazorpayScript = () => {
    if (typeof window === 'undefined') return
    
    if (window.Razorpay) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(false)
      document.head.appendChild(script)
    })
  }

  const validateReferralCode = async () => {
    if (!referralCode.trim() || !plan) return

    setValidatingReferral(true)
    try {
      const response = await referralsAPI.validateReferralCode({
        referralCode: referralCode.trim(),
        amount: plan.price,
      })

      if (response.success && response.data.isValid) {
        setReferralDiscount(response.data.referral)
      } else {
        setReferralDiscount(null)
        alert(response.message || 'Invalid referral code')
      }
    } catch (error) {
      setReferralDiscount(null)
      alert('Failed to validate referral code')
    } finally {
      setValidatingReferral(false)
    }
  }

  const removeReferralCode = () => {
    setReferralCode('')
    setReferralDiscount(null)
  }

  const handlePayment = async () => {
    if (!plan) return

    setProcessing(true)
    try {
      // Create Razorpay order via backend API
      const orderData: any = { planId: plan._id }
      if (referralDiscount) {
        orderData.referralCode = referralCode.trim()
      }

      const orderResp = await transactionsAPI.createOrder(orderData)
      if (!orderResp.success) {
        throw new Error(orderResp.message || 'Failed to create order')
      }

      const { orderId, amount, currency, transactionId } = orderResp.data

      // Get Razorpay key from environment
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''

      if (!razorpayKey || !razorpayKey.startsWith('rzp_')) {
        throw new Error('Razorpay key not configured')
      }

      // Wait for Razorpay script to load
      await loadRazorpayScript()

      if (!window.Razorpay) {
        throw new Error('Failed to load Razorpay checkout')
      }

      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency || 'INR',
        name: 'Aarambh App',
        description: plan.name,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyData = await transactionsAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              transactionId,
            })

            if (verifyData.success) {
              onPaymentSuccess()
            } else {
              onPaymentError(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            onPaymentError('Payment verification failed')
          } finally {
            setProcessing(false)
          }
        },
        prefill: {
          email: '', // Could be filled from user data
          contact: '',
        },
        theme: {
          color: '#dc2929',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      setProcessing(false)
      onPaymentError(error.message || 'Payment failed')
    }
  }

  const finalAmount = referralDiscount ? referralDiscount.finalAmount : plan.price
  const discountAmount = referralDiscount ? referralDiscount.discountAmount : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Secure Checkout</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Plan Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600">₹{plan.price}</span>
                    <span className="text-gray-600 text-sm">
                      for {plan.duration} {plan.durationType || 'months'}
                    </span>
                  </div>
                </div>

                {/* Referral Code Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a referral code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="Enter referral code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={validateReferralCode}
                      disabled={validatingReferral || !referralCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {validatingReferral ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>

                  {referralDiscount && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Discount Applied!
                          </p>
                          <p className="text-xs text-green-600">
                            Teacher: {referralDiscount.teacher?.name}
                          </p>
                        </div>
                        <button
                          onClick={removeReferralCode}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-green-700">
                        {referralDiscount.discountPercentage}% off - Save ₹{discountAmount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-medium">₹{plan.price}</span>
                  </div>
                  {referralDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">
                        Discount ({referralDiscount.discountPercentage}%):
                      </span>
                      <span className="font-medium text-green-600">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">Total Amount:</span>
                    <span className="font-bold text-xl text-red-600">₹{finalAmount}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-red-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{finalAmount}</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Powered by Razorpay • Secure Payment
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

