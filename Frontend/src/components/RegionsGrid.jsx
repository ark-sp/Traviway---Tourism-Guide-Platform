import React from 'react';

const regions = [
  { name: "North India", image: "https://placehold.co/400x300/007bff/ffffff?text=North+India" },
  { name: "South India", image: "https://placehold.co/400x300/28a745/ffffff?text=South+India" },
  { name: "East India", image: "https://placehold.co/400x300/ffc107/000000?text=East+India" },
  { name: "West India", image: "https://placehold.co/400x300/d6336c/ffffff?text=West+India" },
  { name: "Northeast India", image: "https://placehold.co/400x300/6610f2/ffffff?text=Northeast+India" },
  { name: "Central India", image: "https://placehold.co/400x300/20c997/000000?text=Central+India" }
];

const RegionsGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Explore India by Regions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {regions.map((region) => (
          <div key={region.name} className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transform transition-transform duration-300 border border-gray-300">
            <img src={region.image} alt={region.name} className="w-full h-48 object-cover" />
            <div className="p-4 bg-white">
              <h3 className="text-2xl font-semibold text-gray-800">{region.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegionsGrid;
