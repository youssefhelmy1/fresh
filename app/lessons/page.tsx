'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface LessonType {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  level: string;
  duration: string;
}

export default function LessonsPage() {
  const lessonTypes: LessonType[] = [
    {
      id: 'beginner',
      title: 'Beginner Guitar',
      description: 'Perfect for those just starting out with guitar. Learn the basics and build a solid foundation.',
      price: 30,
      image: '/images/beginner-guitar.jpg',
      features: [
        'Basic chords and strumming patterns',
        'Reading tablature and chord diagrams',
        'Proper hand positioning and technique',
        'Simple songs to build confidence',
        'Music theory fundamentals'
      ],
      level: 'Beginner',
      duration: '45 minutes'
    },
    {
      id: 'intermediate',
      title: 'Intermediate Guitar',
      description: 'For players with some experience looking to improve their skills and expand their musical repertoire.',
      price: 40,
      image: '/images/intermediate-guitar.jpg',
      features: [
        'Advanced chord progressions',
        'Fingerpicking techniques',
        'Scale patterns and improvisation',
        'Song structure and composition',
        'Performance techniques'
      ],
      level: 'Intermediate',
      duration: '60 minutes'
    },
    {
      id: 'advanced',
      title: 'Advanced Guitar',
      description: 'For experienced players wanting to master complex techniques and develop their unique style.',
      price: 50,
      image: '/images/advanced-guitar.jpg',
      features: [
        'Advanced soloing techniques',
        'Complex rhythm patterns',
        'Music theory mastery',
        'Genre-specific techniques',
        'Recording and production basics'
      ],
      level: 'Advanced',
      duration: '60 minutes'
    },
    {
      id: 'specialized',
      title: 'Specialized Lessons',
      description: 'Focus on specific styles or techniques like blues, jazz, fingerstyle, or music theory.',
      price: 45,
      image: '/images/specialized-guitar.jpg',
      features: [
        'Style-specific techniques',
        'Repertoire development',
        'Improvisation within genres',
        'Authentic playing approaches',
        'Historical and cultural context'
      ],
      level: 'All Levels',
      duration: '60 minutes'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Guitar Lesson Options</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the lesson type that best fits your skill level and musical goals.
            All lessons are available online or in-person.
          </p>
        </motion.div>

        {/* Lesson Types */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {lessonTypes.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-white">{lesson.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {lesson.level}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {lesson.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{lesson.description}</p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {lesson.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${lesson.price}</span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/booking" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      Book Now
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Do I need my own guitar?</h3>
              <p className="text-gray-600">Yes, you'll need your own instrument for lessons. If you're just starting out, we can provide recommendations for beginner guitars.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">How often should I take lessons?</h3>
              <p className="text-gray-600">Weekly lessons are recommended for consistent progress, but we can accommodate bi-weekly or monthly schedules as well.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Do you offer group lessons?</h3>
              <p className="text-gray-600">Yes, we offer group lessons for friends or family members who want to learn together. Contact us for special group rates.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">What if I need to cancel a lesson?</h3>
              <p className="text-gray-600">We require 24-hour notice for cancellations. Lessons canceled with less than 24 hours notice may be charged the full lesson fee.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">How do online lessons work?</h3>
              <p className="text-gray-600">Online lessons are conducted via Zoom or Skype. You'll need a stable internet connection and a device with a camera and microphone.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Do you provide learning materials?</h3>
              <p className="text-gray-600">Yes, we provide digital sheet music, tablature, and practice exercises tailored to your skill level and goals.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Book your first lesson today and take the first step toward mastering the guitar.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link href="/booking" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-shadow text-lg">
              Book Your First Lesson
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 