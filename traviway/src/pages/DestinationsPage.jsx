import { useState, useEffect } from "react";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router-dom";

const DestinationsPage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const citiesPerPage = 9;
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await API.get("/content/cities");
        setCities(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cities. Please ensure all backend services and the API Gateway are running.");
        console.error(err);
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const totalPages = Math.ceil(cities.length / citiesPerPage);
  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-red-50 pb-16">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center mt-4">
        All Destinations
      </h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 sm:px-6">
            {currentCities.map((city) => (
              <div
                key={city.cityId}
                className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-200"
              >
                <div className="aspect-video w-full">
                  <img
                    src={`images/${city.cityImage}`}  // Correct use of cityImage here
                    alt={city.cityName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {city.cityName}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    A short description about this destination.
                  </p>
                  <div className="flex justify-center">
                  <Link
                    to={`/destinations/${city.cityId}`}
                    className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </div>

                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => changePage(i + 1)}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  currentPage === i + 1
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              »
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DestinationsPage;
