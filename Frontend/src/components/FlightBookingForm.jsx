import React, { useState } from 'react';
import API from '../api/apiClient';
import LoadingSpinner from './LoadingSpinner';

const FlightBookingForm = ({ destinationCity, onClose }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState(destinationCity || '');
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const response = await API.get('/flights/search', {
        params: {
          origin,
          destination,
          date: departureDate,
        },
      });
      setFlights(response.data);
    } catch (err) {
      console.error("Flight search failed:", err);
      setError("Failed to fetch flights. Please check your search criteria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Book Your Flight</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl font-bold">×</button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Origin (IATA Code)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., BLR"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Destination (IATA Code)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., DEL"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search Flights
          </button>
        </form>

        {/* Loading, Error, or Results */}
        {loading && <LoadingSpinner />}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {flights.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-6">Available Flights</h3>
            <ul className="space-y-6 max-h-80 overflow-y-auto">
              {flights.map((flight, index) => (
                <li
                  key={index}
                  className="flex bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-lg border border-blue-200 items-center hover:shadow-2xl transition"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full text-gray-800 font-bold text-xl shadow mr-6">
                    {flight.airlineCode}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base mb-1 text-gray-800">
                      {flight.origin} <span className="text-blue-400 mx-1">→</span> {flight.destination}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      {flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} 
                      {" - "}
                      {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl mb-2 text-green-600 font-bold tracking-wider">₹ {flight.price}</div>
                    <button
                      className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 font-semibold text-base transition"
                    >
                      Book Now
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && !error && flights.length === 0 && (
          <p className="text-center text-gray-500">No flights found for this search.</p>
        )}
      </div>
    </div>
  );
};

export default FlightBookingForm;