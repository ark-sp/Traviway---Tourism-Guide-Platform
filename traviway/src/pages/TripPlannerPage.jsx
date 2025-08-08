import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

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
    setItinerary('');

    const prompt = `Generate a detailed travel itinerary for a trip to India.
The user is interested in: ${interests || 'general sightseeing'}.
The trip duration is: ${duration || '7 days'}.
They want to visit: ${destinationsInput || 'any popular destinations in India'}.
Number of travelers: ${travelers || '2 adults'}.
Provide a day-by-day plan including activities, places to visit, and approximate timings.
Make it engaging and informative.`;

    try {
      const chatHistory = [
        { role: "user", parts: [{ text: prompt }] }
      ];
      const payload = { contents: chatHistory };

      // Your Gemini API key inserted directly (for testing only)
      const apiKey = "AIzaSyDrWwynmQah32mlw_xnF4pwRfOssf3yzcc";

      if (!apiKey) {
        setError("API Key is missing.");
        setLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
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
    <div className="min-h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-2xl mb-8 border border-gray-200 max-w-4xl w-full">
        <p className="text-4xl font-extrabold text-gray-800 mb-8 text-center mt-4">Plan Your Custom Trip with AI ✨</p>
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
        <div className="text-center mt-8 ">
          <button
            onClick={generateItinerary}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:bg-green-700 transition-colors font-semibold text-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Itinerary ✨'}
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
      </div>

      {itinerary && (
        <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 mt-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Custom Itinerary</h2>
          <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-100">
            {itinerary}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TripPlannerPage;
