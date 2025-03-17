'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user came from Sign Up button
    const showRegister = localStorage.getItem('showRegister')
    if (showRegister === 'true') {
      setIsLogin(false)
      localStorage.removeItem('showRegister') // Clear the flag
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First, check if the API endpoint is accessible
      const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

      // Store the token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect to appropriate page
      router.push(isLogin ? '/profile' : '/booking');
      
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
      
      {/* Floating 3D elements */}
      <motion.div 
        className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full"
        animate={{ 
          y: [0, -10, 0],
          rotateZ: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 5,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full"
        animate={{ 
          y: [0, 10, 0],
          rotateZ: [0, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 7,
          ease: "easeInOut"
        }}
      />

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
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              />
            </motion.div>
          )}
        </AnimatePresence>

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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
          />
          {!isLogin && (
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long
            </p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <span className="relative z-10">
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 to-purple-700 transform translate-z-[-1px]" />
        </motion.button>
      </form>

      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.button
          onClick={() => setIsLogin(!isLogin)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-200 underline hover:underline-offset-4"
        >
          {isLogin ? (
            "New to guitar lessons? Sign up now"
          ) : (
            "Already registered? Login here"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 