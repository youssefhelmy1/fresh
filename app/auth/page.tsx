import AuthForm from './components/AuthForm'
import { motion } from 'framer-motion'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Guitar Lessons
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in or create an account to manage your bookings
          </p>
        </div>
        <AuthForm />
      </motion.div>
    </div>
  )
} 