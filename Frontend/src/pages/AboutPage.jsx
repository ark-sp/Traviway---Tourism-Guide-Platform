import React from "react";

const AboutPage = () => (
  <div className="min-h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
    <div className="max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200 p-10">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
        About Traviway
      </h1>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Welcome to <span className="font-semibold text-blue-600">Traviway</span> – your trusted travel companion when you're uncertain about where to go and what to do!
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Explore and filter a wide array of destinations worldwide. Dive into detailed guides about cities and places including how to reach them, must-see attractions, local foods, and travel stories shared by fellow adventurers.
      </p>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Our platform lets you create a personalized experience by logging in to:
      </p>

      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2 text-lg">
        <li>Write and manage your own travel blogs and stories.</li>
        <li>Keep track of your visited places and write reviews.</li>
        <li>Create and manage your wishlist of future travel destinations.</li>
        <li>Book tickets for flights, trains, buses, and hotels directly through our platform.</li>
      </ul>

      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        Additionally, we integrate <span className="font-semibold">Google Maps</span> to provide you with an interactive way to visualize your journeys and destinations.
      </p>

      <p className="text-center text-blue-700 font-semibold text-xl">
        Ready to start your adventure? Explore Traviway and make your travel dreams come true!
      </p>
    </div>
  </div>
);

export default AboutPage;
