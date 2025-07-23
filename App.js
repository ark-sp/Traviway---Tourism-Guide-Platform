import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState } from 'react';

// Placeholder data for demonstration
const destinations = [
  {
    id: 'delhi',
    name: 'Delhi',
    description: 'The capital city of India, known for its rich history, vibrant culture, and iconic landmarks.',
    image: 'https://placehold.co/800x400/007bff/ffffff?text=Delhi+Gateway',
    details: 'Delhi is a city that bridges two different worlds. Old Delhi, once the capital of Islamic India, is a labyrinth of narrow lanes, old havelis, and magnificent mosques. In contrast, the imperial city of New Delhi created by the British is composed of spacious, tree-lined avenues and imposing government buildings. Delhi has been the capital of several empires in ancient India. The city has been built, destroyed and rebuilt several times, and is a treasure trove of historical sites.',
    attractions: ['India Gate', 'Red Fort', 'Qutub Minar', 'Humayun\'s Tomb'],
    bestTime: 'October to March',
  },
  {
    id: 'agra',
    name: 'Agra',
    description: 'Home to the iconic Taj Mahal, a UNESCO World Heritage site and one of the New Seven Wonders of the World.',
    image: 'https://placehold.co/800x400/28a745/ffffff?text=Agra+Taj+Mahal',
    details: 'Agra, a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh, is best known for the Taj Mahal. It is a major tourist destination because of its many Mughal-era buildings, most notably the Taj Mahal, Agra Fort and Fatehpur Sikri, all of which are UNESCO World Heritage Sites.',
    attractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri'],
    bestTime: 'October to March',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    description: 'The "Pink City" of Rajasthan, famous for its majestic forts, palaces, and vibrant bazaars.',
    image: 'https://placehold.co/800x400/ffc107/333333?text=Jaipur+Palace',
    details: 'Jaipur is the capital and the largest city of the Indian state of Rajasthan. It was founded on 18 November 1727 by Jai Singh II, the ruler of Amer, after whom the city is named. Jaipur is a popular tourist destination in India and forms a part of the Golden Triangle tourist circuit along with Delhi and Agra.',
    attractions: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar'],
    bestTime: 'October to March',
  },
];

const carouselImages = [
  'https://placehold.co/1200x500/007bff/ffffff?text=Incredible+India+1',
  'https://placehold.co/1200x500/28a745/ffffff?text=Incredible+India+2',
  'https://placehold.co/1200x500/ffc107/333333?text=Incredible+India+3',
];

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold tracking-wide rounded-md p-2 hover:bg-blue-700 transition-colors">
          Incredible India
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-white text-lg font-semibold hover:text-blue-200 transition-colors">Home</Link>
          <Link to="/destinations" className="text-white text-lg font-semibold hover:text-blue-200 transition-colors">Destinations</Link>
          <Link to="/plan-trip" className="text-white text-lg font-semibold hover:text-blue-200 transition-colors">Plan Your Trip ✨</Link> {/* New Link */}
          <Link to="/about" className="text-white text-lg font-semibold hover:text-blue-200 transition-colors">About Us</Link>
          <Link to="/contact" className="text-white text-lg font-semibold hover:text-blue-200 transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

// Carousel Component
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-advance carousel
  React.useEffect(() => {
    const interval = setInterval(goToNext, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl mb-8">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-96 object-cover flex-shrink-0 rounded-lg"
          />
        ))}
      </div>
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-opacity focus:outline-none"
      >
        &#10095;
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'} focus:outline-none`}
          ></button>
        ))}
      </div>
    </div>
  );
};

// Homepage Component
const HomePage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8 mt-4">Discover Incredible India</h1>
      <Carousel images={carouselImages} />

      {/* Search Bar Section */}
      <div className="bg-white p-8 rounded-lg shadow-2xl mb-12 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Plan Your Journey</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search destinations, attractions..."
            className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold text-lg">
            Search
          </button>
        </div>
      </div>

      {/* Featured Destinations Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-200">
              <img src={destination.image} alt={destination.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
                <Link to={`/destinations/${destination.id}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Explore More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Trip Planner Call to Action */}
      <section className="mb-12 bg-purple-100 p-8 rounded-lg shadow-2xl text-center border border-purple-200">
        <h2 className="text-4xl font-bold text-purple-800 mb-6">Let AI Plan Your Perfect Trip!</h2>
        <p className="text-gray-700 text-lg mb-8">Tell us your preferences and get a custom itinerary generated by Gemini AI.</p>
        <Link to="/plan-trip" className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors font-semibold text-xl transform hover:scale-105">
          Plan Your Trip Now ✨
        </Link>
      </section>

      {/* Latest Travel Stories Section */}
      <section className="mb-12 bg-blue-50 p-8 rounded-lg shadow-inner">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Latest Travel Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Placeholder for blog posts */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">A Journey Through Rajasthan's Forts</h3>
            <p className="text-gray-600 mb-4">Discover the grandeur and history of Rajasthan's magnificent forts and palaces...</p>
            <Link to="#" className="text-blue-600 hover:underline">Read More</Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kerala Backwaters: A Serene Escape</h3>
            <p className="text-gray-600 mb-4">Experience the tranquility of Kerala's backwaters on a houseboat cruise...</p>
            <Link to="#" className="text-blue-600 hover:underline">Read More</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Destinations Page Component
const DestinationsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center mt-4">All Destinations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-200">
            <img src={destination.image} alt={destination.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
              <Link to={`/destinations/${destination.id}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Destination Detail Page Component
const DestinationDetailPage = () => {
  const { id } = useParams(); // Get ID from URL
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600 text-xl">
        Destination not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden p-8 mb-8 border border-gray-200">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 text-center">{destination.name}</h1>
        <img src={destination.image} alt={destination.name} className="w-full h-96 object-cover rounded-lg mb-8 shadow-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{destination.details}</p>

            <h2 className="text-3xl font-bold text-gray-700 mb-4">Top Attractions</h2>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              {destination.attractions.map((attraction, index) => (
                <li key={index}>{attraction}</li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-1 bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Practical Information</h2>
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-semibold">Best Time to Visit:</span> {destination.bestTime}
            </p>
            {/* Placeholder for map - In a real app, integrate Google Maps API */}
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-center text-sm">
              Map Placeholder (Integrate Google Maps API here)
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/destinations" className="inline-block bg-gray-600 text-white px-8 py-4 rounded-md hover:bg-gray-700 transition-colors font-medium text-lg">
            Back to Destinations
          </Link>
        </div>
      </div>
    </div>
  );
};

// AI Trip Planner Page Component
const TripPlannerPage = () => {
  const [interests, setInterests] = useState('');
  const [duration, setDuration] = useState('');
  const [destinationsInput, setDestinationsInput] = useState('');
  const [travelers, setTravelers] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateItinerary = async () => {
    setLoading(true);
    setError('');
    setItinerary(''); // Clear previous itinerary

    const prompt = `Generate a detailed travel itinerary for a trip to India.
    The user is interested in: ${interests || 'general sightseeing'}.
    The trip duration is: ${duration || '7 days'}.
    They want to visit: ${destinationsInput || 'any popular destinations in India'}.
    Number of travelers: ${travelers || '2 adults'}.
    Provide a day-by-day plan including activities, places to visit, and approximate timings.
    Make it engaging and informative.`;

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY; // It's best practice to store API keys in environment variables.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setItinerary(text);
      } else {
        setError('Failed to generate itinerary. Please try again.');
        console.error('Gemini API response structure unexpected:', result);
      }
    } catch (err) {
      setError('An error occurred while connecting to the AI. Please check your network and try again.');
      console.error('Error calling Gemini API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center mt-4">Plan Your Custom Trip with AI ✨</h1>
      <div className="bg-white p-8 rounded-lg shadow-2xl mb-8 border border-gray-200">
        <p className="text-gray-700 text-lg mb-6 text-center">
          Tell our Gemini AI about your travel preferences, and we'll craft a unique itinerary just for you!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="interests" className="block text-gray-700 text-sm font-bold mb-2">Your Interests (e.g., history, adventure, food):</label>
            <input
              type="text"
              id="interests"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., historical sites, beaches, local cuisine"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">Trip Duration (e.g., 7 days, 2 weeks):</label>
            <input
              type="text"
              id="duration"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 10 days"
            />
          </div>
          <div>
            <label htmlFor="destinations" className="block text-gray-700 text-sm font-bold mb-2">Specific Destinations (optional, e.g., Delhi, Agra, Jaipur):</label>
            <input
              type="text"
              id="destinations"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={destinationsInput}
              onChange={(e) => setDestinationsInput(e.target.value)}
              placeholder="e.g., Goa, Kerala"
            />
          </div>
          <div>
            <label htmlFor="travelers" className="block text-gray-700 text-sm font-bold mb-2">Number of Travelers (e.g., 2 adults, 1 child):</label>
            <input
              type="text"
              id="travelers"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder="e.g., 2 adults"
            />
          </div>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={generateItinerary}
            className="bg-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-green-700 transition-colors font-semibold text-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Itinerary ✨'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {itinerary && (
        <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Custom Itinerary</h2>
          <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-100">
            {itinerary}
          </pre>
        </div>
      )}
    </div>
  );
};


// Placeholder components for other pages
const AboutPage = () => (
  <div className="container mx-auto p-6 text-center text-gray-700 text-xl h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p>This section will provide information about our mission, vision, and the team behind the Incredible India clone.</p>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="container mx-auto p-6 text-center text-gray-700 text-xl h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p>This section will feature a contact form and our contact details.</p>
    </div>
  </div>
);

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-inter">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/plan-trip" element={<TripPlannerPage />} /> {/* New Route */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        {/* Basic Footer */}
        <footer className="bg-gray-800 text-white p-6 text-center mt-12 rounded-t-lg shadow-inner">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} Incredible India Clone. All rights reserved.</p>
            <p className="mt-2">Inspired by the rich heritage of India.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
