'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user came from Sign Up button
    const showRegister = localStorage.getItem('showRegister')
    if (showRegister === 'true') {
      setIsLogin(false)
      localStorage.removeItem('showRegister') // Clear the flag
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = !isLogin ? formData.get('name') as string : undefined

    try {
      // First, check if the API endpoint is accessible
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      }).catch(error => {
        console.error('Network error:', error);
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Unable to process server response. Please try again.');
        }
      } else {
        console.error('Invalid content type:', contentType);
        throw new Error('Server returned an invalid response format. Please try again.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      if (!data.token) {
        throw new Error('No authentication token received from server');
      }

      // Store the token and redirect
      localStorage.setItem('authToken', data.token);
      router.push('/booking');
      
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-white p-8 rounded-2xl shadow-xl transform-gpu perspective-1000"
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* 3D decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl transform -translate-z-2" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-2xl transform -translate-z-1" />

      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
      </motion.h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required={!isLogin}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
            />
          </motion.div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </motion.button>
      </form>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          onClick={() => setIsLogin(!isLogin)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-gray-50 py-2 rounded-lg"
        >
          {isLogin ? (
            "New to guitar lessons? Sign up now"
          ) : (
            <span>
              Already registered?{' '}
              <span className="text-blue-600 underline hover:text-blue-700">
                Login here
              </span>
            </span>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 