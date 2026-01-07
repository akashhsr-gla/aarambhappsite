'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { transactionsAPI } from '@/lib/api'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, XCircle, Clock, Crown } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface SubscriptionData {
  subscriptionStatus: 'active' | 'inactive'
  currentPlan?: {
    _id: string
    name: string
    description: string
    price: number
    duration: number
  }
  subscriptionExpiry?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

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
      loadSubscription()
    }
  }, [user, authLoading, router])

  const loadSubscription = async () => {
    try {
      const response = await transactionsAPI.getSubscription()
      if (response.success) {
        setSubscription(response.data)
      }
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
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

  const isActive = subscription?.subscriptionStatus === 'active'
  const expiryDate = subscription?.subscriptionExpiry
    ? new Date(subscription.subscriptionExpiry)
    : null
  const isExpired = expiryDate ? expiryDate < new Date() : true

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </motion.div>

        {/* Subscription Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Crown className="text-yellow-500" size={28} />
              Subscription Status
            </h2>
            <div
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isActive && !isExpired
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isActive && !isExpired ? (
                <>
                  <CheckCircle size={18} />
                  <span className="font-semibold">Active</span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span className="font-semibold">Inactive</span>
                </>
              )}
            </div>
          </div>

          {isActive && !isExpired && subscription?.currentPlan ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {subscription.currentPlan.name}
                </h3>
                <p className="text-gray-600 mb-4">{subscription.currentPlan.description}</p>
                
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar size={18} />
                  <span className="font-medium">
                    Expires on: {expiryDate?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {expiryDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>
                      {Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <XCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to a plan to access all premium features
              </p>
              <Link
                href="/subscription"
                className="inline-block bg-gradient-to-r from-red-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-blue-700 transition-all"
              >
                View Plans
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/subscription"
              className="p-6 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:from-red-700 hover:to-blue-700 transition-all"
            >
              <h3 className="text-lg font-semibold mb-2">Manage Subscription</h3>
              <p className="text-sm opacity-90">View and subscribe to plans</p>
            </Link>
            <Link
              href="/"
              className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Back to Home</h3>
              <p className="text-sm text-gray-600">Return to homepage</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

