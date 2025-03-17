'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
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

  const instructors = [
    {
      name: 'David Johnson',
      role: 'Lead Instructor',
      bio: 'David has been teaching guitar for over 15 years and specializes in rock, blues, and jazz. He holds a degree in Music Education from Berklee College of Music.',
      image: '/images/instructor1.jpg'
    },
    {
      name: 'Sarah Chen',
      role: 'Classical Guitar Instructor',
      bio: 'Sarah is a classically trained guitarist with a Master\'s degree in Music Performance. She has performed with orchestras around the world.',
      image: '/images/instructor2.jpg'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Contemporary Guitar Instructor',
      bio: 'Michael is a session musician who has played on numerous albums and tours. He specializes in contemporary styles including pop, rock, and R&B.',
      image: '/images/instructor3.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Our Guitar Lessons</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated to helping students of all ages and skill levels achieve their musical goals through personalized instruction.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16"
        >
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">Our Story</h2>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <motion.div variants={itemVariants} className="space-y-4">
                <p className="text-gray-600">
                  Founded in 2010, our guitar lesson program began with a simple mission: to make learning guitar accessible, enjoyable, and rewarding for everyone.
                </p>
                <p className="text-gray-600">
                  What started as a small studio with just one instructor has grown into a community of passionate teachers and students united by their love for music.
                </p>
                <p className="text-gray-600">
                  We believe that learning an instrument should be a journey of discovery and joy. Our teaching approach combines technical skill development with creative expression, ensuring that students not only learn to play but develop a lifelong passion for music.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to offer both in-person and online lessons to students around the world, helping them achieve their musical dreams one note at a time.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Our Approach */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Teaching Approach
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Curriculum</h3>
              <p className="text-gray-600">
                We create a custom learning plan for each student based on their goals, interests, and learning style. No two students follow the exact same path.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Balanced Learning</h3>
              <p className="text-gray-600">
                We balance technical skills with creative expression, theory with practice, and discipline with fun to create well-rounded musicians who truly enjoy playing.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Supportive Environment</h3>
              <p className="text-gray-600">
                We create a positive, encouraging atmosphere where students feel comfortable taking risks, making mistakes, and growing as musicians.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Meet Our Instructors */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Meet Our Instructors
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="h-64 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-70"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold">{instructor.name}</h3>
                      <p className="text-lg">{instructor.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{instructor.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Musical Journey Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our community of passionate musicians and discover the joy of playing guitar.
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