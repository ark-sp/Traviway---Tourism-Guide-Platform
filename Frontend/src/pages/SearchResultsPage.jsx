import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const PAGE_SIZE = 9;

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const rawTitle = searchParams.get("title");
  const rawCategoryId = searchParams.get("categoryId");
  const rawCityId = searchParams.get("cityId");

  // Normalize input
  const title = rawTitle && rawTitle.trim() !== "" ? rawTitle.trim() : null;
  const categoryId = rawCategoryId && !isNaN(+rawCategoryId) ? +rawCategoryId : null;
  const cityId = rawCityId && !isNaN(+rawCityId) ? +rawCityId : null;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    window.scrollTo(0, 0);
  }, [title, categoryId, cityId]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (categoryId) params.append("categoryId", categoryId);
      if (cityId) params.append("cityId", cityId);

      try {
        const response = await API.get(`/content/places?${params.toString()}`);
        setPlaces(response.data);
      } catch (err) {
        setError("Failed to fetch search results. Please ensure backend services are available.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [title, categoryId, cityId]);

  const totalPages = Math.ceil(places.length / PAGE_SIZE);
  const pagedResults = places.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getImageSrc = (place) => {
    if (
      Array.isArray(place.placeImages) &&
      place.placeImages.length > 0 &&
      place.placeImages[0]?.imageUrl
    ) {
      const url = place.placeImages[0].imageUrl;
      if (url.startsWith("http") || url.startsWith("/")) return url;
      return `/images/${url}`;
    }
    return `https://placehold.co/800x450/7265e3/fff?text=${encodeURIComponent(place.title)}`;
  };

  return (
    <div className="min-h-screen w-screen bg-neutral-50 px-6 py-8">
      <h1 className="text-center text-4xl font-bold mb-8">Search Results</h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          {places.length === 0 ? (
            <p className="text-center text-gray-600 mt-12 text-xl">No destinations found.</p>
          ) : (
            <>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mx-auto"
                style={{ maxWidth: "1100px" }}
              >
                {pagedResults.map((place) => (
                  <div
                    key={place.placeId}
                    className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 transition-transform transform hover:scale-105"
                  >
                    <img
                      src={getImageSrc(place)}
                      alt={place.title}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/800x450/ccc/000?text=${encodeURIComponent(
                          place.title
                        )}`;
                      }}
                    />
                    <div className="p-6 min-h-[140px]">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{place.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3" title={place.description}>
                        {place.description?.slice(0, 96) || "A beautiful destination to explore!"}
                      </p>
                      <div className="flex justify-center">
                        <Link
                          to={`/places/${place.placeId}`}
                          className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    aria-label="Previous Page"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx + 1)}
                      className={`px-4 py-2 rounded ${
                        page === idx + 1
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label={`Page ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    aria-label="Next Page"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
