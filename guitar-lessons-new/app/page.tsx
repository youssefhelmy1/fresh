import React from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Guitar Lessons</h1>
      <p className="mb-4">
        Welcome to our guitar lessons platform. We offer personalized lessons for all skill levels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Beginner Lessons</h2>
          <p>Perfect for those just starting out with the guitar.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Advanced Techniques</h2>
          <p>Take your skills to the next level with our advanced lessons.</p>
        </div>
      </div>
    </div>
  );
} 