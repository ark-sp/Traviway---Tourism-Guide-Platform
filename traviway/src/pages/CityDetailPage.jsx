import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";

const ITEMS_PER_PAGE = 6;

// API key below:
const GOOGLE_MAPS_API_KEY = "AIzaSyBjL5Z26m3nHkLPzeGwBNQRuUNGMqYmWVE";

const CityDetailPage = () => {
  const { cityId } = useParams();
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placeImages, setPlaceImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndexMap, setCurrentImageIndexMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch city and places initially
  useEffect(() => {
    const fetchCityAndPlaces = async () => {
      try {
        const cityResponse = await API.get(`/content/cities/${cityId}`);
        setCity(cityResponse.data);

        const placesResponse = await API.get(`/content/places/by-city/${cityId}`);
        const fetchedPlaces = placesResponse.data;
        setPlaces(fetchedPlaces);

        // Initialize current image indices for each place
        const imageIndexInit = {};
        fetchedPlaces.forEach((place) => {
          imageIndexInit[place.placeId] = 0;
        });
        setCurrentImageIndexMap(imageIndexInit);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch city or places data.");
        setLoading(false);
      }
    };
    fetchCityAndPlaces();
  }, [cityId]);

  // Fetch images for all places in parallel once places loaded
  useEffect(() => {
    if (places.length === 0) return;

    const fetchAllImages = async () => {
      try {
        const allImagesResponses = await Promise.all(
          places.map((place) => API.get(`/content/place-images/by-place/${place.placeId}`))
        );

        const imagesMap = {};
        allImagesResponses.forEach((resp, idx) => {
          const placeId = places[idx].placeId;
          imagesMap[placeId] = resp.data.map((imgObj) => {
            if (imgObj.imageUrl.startsWith("http") || imgObj.imageUrl.startsWith("/")) {
              return imgObj.imageUrl;
            }
            return `/images/${imgObj.imageUrl}`;
          });
        });

        setPlaceImages(imagesMap);
      } catch (err) {
        console.error("Failed to fetch images for places:", err);
      }
    };
    fetchAllImages();
  }, [places]);

  const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPlaces = places.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevImage = (placeId) => {
    setCurrentImageIndexMap((prev) => {
      const images = placeImages[placeId] || [];
      if (images.length === 0) return prev;
      const currentIndex = prev[placeId] || 0;
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      return { ...prev, [placeId]: newIndex };
    });
  };

  const handleNextImage = (placeId) => {
    setCurrentImageIndexMap((prev) => {
      const images = placeImages[placeId] || [];
      if (images.length === 0) return prev;
      const currentIndex = prev[placeId] || 0;
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      return { ...prev, [placeId]: newIndex };
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error || !city) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600 text-xl">
        {error || "City not found."}
        <div className="mt-4">
          <Link
            to="/destinations"
            className="inline-block bg-gray-600 text-white px-8 py-4 rounded-md hover:bg-gray-700 transition-colors font-medium text-lg"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* City Image and Name */}
      <div
  className="relative mx-auto mb-8 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center"
  style={{ maxWidth: "700px", height: "260px" }}
>
  <img
    src={`/images/${city.cityImage}`}
    alt={city.cityName}
    className="w-full h-full object-cover"
    style={{ maxHeight: "260px" }}
  />
</div>
<h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
  {city.cityName}
</h1>

      {/* Places Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Top Attractions</h2>
        {paginatedPlaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedPlaces.map((place) => {
                const images = placeImages[place.placeId] || [];
                const currentIndex = currentImageIndexMap[place.placeId] || 0;
                const currentImageUrl = images[currentIndex] || null;

                return (
                  <Link
                    to={`/places/${place.placeId}`}
                    key={place.placeId}
                    className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col relative"
                  >
                    <div className="relative w-full h-48">
                      {currentImageUrl ? (
                        <img
                          src={currentImageUrl}
                          alt={place.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600">
                          No Image
                        </div>
                      )}

                      {/* Left Arrow */}
                      {images.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePrevImage(place.placeId);
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-90 text-white rounded-full px-2 py-0.5 text-md hover:bg-opacity-80"
                          aria-label="Previous Image"
                          style={{ fontSize: "0.8rem", minWidth: "18px", minHeight: "18px" }}
                        >
                          ‹
                        </button>
                      )}

                      {/* Right Arrow */}
                      {images.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNextImage(place.placeId);
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-90 text-white rounded-full px-2 py-0.5 text-md hover:bg-opacity-80"
                          aria-label="Next Image"
                          style={{ fontSize: "0.8rem", minWidth: "18px", minHeight: "18px" }}
                        >
                          ›
                        </button>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">{place.title}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{place.description}</p>
                      <span className="mt-auto text-blue-600 hover:underline">View Details</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Prev
              </button>
              <span className="font-semibold text-gray-700 px-2 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">No places found for this city.</p>
        )}
      </div>

      {/* Practical Info and Map */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100 mt-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Practical Information</h2>
        <p className="text-gray-700 text-lg mb-2">
          <span className="font-semibold">City Name:</span> {city.cityName}
        </p>
        {/* Google Maps Integration -- Sized to match city image section */}
        <div
          className="relative mx-auto rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center mt-4"
          style={{ maxWidth: "700px", height: "260px", width: "100%" }}
        >
          {city.latitude && city.longitude ? (
            <iframe
              title={`Map of ${city.cityName}`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, minHeight: "260px", minWidth: "100%" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${city.latitude},${city.longitude}&zoom=12&maptype=roadmap`}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-center text-sm">
              Coordinates not available for map.
            </div>
          )}
        </div>
      </div>


      <div className="text-center mt-8">
        <Link
          to="/destinations"
          className="inline-block bg-gray-600 text-white px-8 py-4 rounded-md hover:bg-gray-700 transition-colors font-medium text-lg"
        >
          Back to Destinations
        </Link>
      </div>
    </div>
  );
};

export default CityDetailPage;
