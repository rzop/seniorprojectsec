import React from 'react';

function TailwindTest() {
  return (
    <div className="min-h-screen bg-blue-900 text-white p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Tailwind Test</h1>
      <div className="bg-green-500 p-4 rounded-lg mb-4">
        <p className="text-black">This should be a green box with black text</p>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg">
        <p className="text-white">This should be a gradient box</p>
      </div>
      <div className="mt-4 w-32 h-32 bg-yellow-400 rounded-full animate-bounce">
        <p className="text-center pt-12 text-black">Bounce</p>
      </div>
    </div>
  );
}

export default TailwindTest;