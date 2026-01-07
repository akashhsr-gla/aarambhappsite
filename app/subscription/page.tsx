'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { transactionsAPI } from '@/lib/api'
import { motion } from 'framer-motion'
import { Check, Star, Crown } from 'lucide-react'
import Header from '@/components/Header'
import PaymentModal from '@/components/PaymentModal'

interface Plan {
  _id: string
  name: string
  description: string
  price: number
  duration: number
  durationType?: string
  features: (string | { name: string; description: string })[]
  isPopular?: boolean
  isActive?: boolean
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { user, loading: authLoading, refreshUser } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user && user.role !== 'student') {
      router.push('/')
      return
    }

    if (user) {
      loadPlans()
    }
  }, [user, authLoading, router])

  const loadPlans = async () => {
    try {
      const response = await transactionsAPI.getAvailablePlans()
      if (response.success) {
        setPlans(response.data || [])
      }
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan)
    setPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async () => {
    setPaymentModalOpen(false)
    await refreshUser()
    router.push('/dashboard')
  }

  const handlePaymentError = (error: string) => {
    setPaymentModalOpen(false)
    alert(error || 'Payment failed. Please try again.')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activePlans = plans.filter(plan => plan.isActive !== false && plan.price > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">
            Select a subscription plan that works best for you
          </p>
        </motion.div>

        {activePlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                  plan.isPopular ? 'ring-4 ring-red-500 scale-105' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={14} />
                      Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-red-600">₹{plan.price}</span>
                    <span className="text-gray-600 ml-2">
                      / {plan.duration} {plan.durationType || 'months'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {plan.features && Array.isArray(plan.features) ? (
                      plan.features.map((feature, idx) => {
                        const featureText = typeof feature === 'string' 
                          ? feature 
                          : (feature.name || feature.description || 'Feature')
                        return (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                            <span>{featureText}</span>
                          </li>
                        )
                      })
                    ) : (
                      <li className="text-sm text-gray-500">No features listed</li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:from-red-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Subscribe Now
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Crown className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Plans Available
            </h3>
            <p className="text-gray-600">
              Please check back later for available subscription plans.
            </p>
          </div>
        )}
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          plan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  )
}

