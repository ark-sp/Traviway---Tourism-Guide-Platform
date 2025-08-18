import React from 'react';

// Sample featured cities with real-ish descriptions from your snippet
const featuredCities = [
  {
    name: "Delhi",
    description: "The Beating Retreat Ceremony at Attari-Wagah border is a unique synchronised parade by Indian and Pakistani soldiers.",
    image: "https://placehold.co/600x400/007bff/ffffff?text=Delhi",
  },
  {
    name: "Amritsar",
    description: "Amritsar holds a significant place for Sikh martial arts known as Gatka.",
    image: "https://placehold.co/600x400/28a745/ffffff?text=Amritsar",
  },
  {
    name: "Leh",
    description: "Leh is one of the highest permanently inhabited places on Earth and ancient Silk Road stop.",
    image: "https://placehold.co/600x400/ffc107/000000?text=Leh",
  },
  {
    name: "Chandigarh",
    description: "The Capitol Complex, a UNESCO Heritage site, is the epicentre of Chandigarh's political activities.",
    image: "https://placehold.co/600x400/d6336c/ffffff?text=Chandigarh",
  },
  {
    name: "Mumbai",
    description: "Mumbai is the centre of Bollywood, producing more films per year than Hollywood.",
    image: "https://placehold.co/600x400/6610f2/ffffff?text=Mumbai",
  },
  {
    name: "Hyderabad",
    description: "Ramoji Film City in Hyderabad is the largest film studio in the world.",
    image: "https://placehold.co/600x400/20c997/000000?text=Hyderabad",
  },
];

const FeaturedDestinations = () => (
  <section className="bg-gray-50 py-16">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Bucket List Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {featuredCities.map(({ name, description, image }) => (
          <div key={name} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <img src={image} alt={name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{name}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedDestinations;
