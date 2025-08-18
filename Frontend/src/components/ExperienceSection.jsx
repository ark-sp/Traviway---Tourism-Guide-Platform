import React from 'react';

const experiences = [
  { title: "Heritage & Culture", icon: "🏰" },
  { title: "Wellness & Spa", icon: "🧘" },
  { title: "Adventure Trails", icon: "🚵" },
  { title: "Wildlife Safari", icon: "🦁" },
  { title: "Culinary Delights", icon: "🍛" },
  { title: "Spiritual Journeys", icon: "🛕" },
];

const ExperiencesSection = () => (
  <section className="max-w-7xl mx-auto px-4 py-16">
    <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Experiences You'll Love</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {experiences.map(({ title, icon }) => (
        <div key={title} className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center space-x-4 hover:bg-yellow-50 transition-colors cursor-pointer border border-gray-200">
          <span className="text-5xl">{icon}</span>
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        </div>
      ))}
    </div>
  </section>
);

export default ExperiencesSection;
