import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import FlightBookingForm from "../components/FlightBookingForm";
import { useAuth } from "../context/AuthContext"; 
import { Heart, CheckCircle } from "lucide-react";

const Maps_API_KEY = "AIzaSyBjL5Z26m3nHkLPzeGwBNQRuUNGMqYmWVE";

const DestinationDetailPage = () => {
  const { placeId } = useParams();
  const { user } = useAuth();

  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [localFoods, setLocalFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFlightForm, setShowFlightForm] = useState(false);

  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const placeRes = await API.get(`/content/places/${placeId}`);
        const placeData = placeRes.data;
        setPlace(placeData);

        const imgsRes = await API.get(`/content/place-images/by-place/${placeId}`);
        const fetchedImages = (imgsRes.data || []).map((img) =>
          img.imageUrl.startsWith("http") || img.imageUrl.startsWith("/")
            ? img.imageUrl
            : `/images/${img.imageUrl}`
        );
        setImages(fetchedImages);

        try {
          const reviewsRes = await API.get(`/travyway/reviews/by-place/${placeId}`);
          setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        } catch (err) {
          console.error("Failed to fetch reviews:", err);
          setReviews([]);
        }

        if (placeData.cityId) {
          try {
            const localFoodsRes = await API.get(`/content/local-foods/by-city/${placeData.cityId}`);
            setLocalFoods(localFoodsRes.data);
          } catch (foodErr) {
            console.error("Failed to fetch local foods:", foodErr);
            setLocalFoods([]);
          }
        } else {
          setLocalFoods([]);
        }

        setCurrentImg(0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching destination details:", err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [placeId]);

  const handlePrevImg = () =>
    setCurrentImg((i) => (images.length ? (i === 0 ? images.length - 1 : i - 1) : 0));
  const handleNextImg = () =>
    setCurrentImg((i) => (images.length ? (i === images.length - 1 ? 0 : i + 1) : 0));
  
  const handleBookFlightClick = () => setShowFlightForm(true);

  const addToWishlist = async () => {
    if (!user) return;
    try {
      await API.post("/travyway/wishlists", {
        userId: user.userId,
        placeId: Number(placeId),
      });
      setActionMsg("✅ Added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setActionMsg("❌ Failed to add to wishlist");
    }
  };

  const markAsVisited = async () => {
    if (!user) return;
    try {
      await API.post("/travyway/visited-places", {
        userId: user.userId,
        placeId: Number(placeId),
      });
      setActionMsg("✅ Marked as visited!");
    } catch (err) {
      console.error("Error marking as visited:", err);
      setActionMsg("❌ Failed to mark as visited");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!place) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600 text-xl">
        Destination not found.
      </div>
    );
  }

  return (
    <div className="w-screen container mx-auto py-6 px-2 md:px-8">

      {/* Icons only for logged in user */}
      {user && (
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={addToWishlist}
            className="text-pink-600 hover:text-pink-800"
            title="Add to Wishlist"
          >
            <Heart size={26} />
          </button>
          <button
            onClick={markAsVisited}
            className="text-green-600 hover:text-green-800"
            title="Mark as Visited"
          >
            <CheckCircle size={26} />
          </button>
        </div>
      )}

      {/* Feedback message */}
      {actionMsg && (
        <div className="mb-4 text-center text-sm font-semibold text-blue-700">
          {actionMsg}
        </div>
      )}

      {/* IMAGE CAROUSEL */}
      <div
        className="relative mx-auto mb-8 rounded-lg overflow-hidden shadow"
        style={{ maxWidth: "700px", height: "280px" }}
      >
        {images.length ? (
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ height: "260px" }}
          >
            <img
              src={images[currentImg]}
              alt={place.title}
              className="w-full h-full object-cover flex-shrink-0"
              style={{ height: "300px" }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            No Images
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImg();
              }}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-1"
            >
              &lt;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImg();
              }}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-900 text-white rounded-full p-1"
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {/* == DESTINATION DETAILS == */}
      <div className="bg-white rounded-lg shadow p-8 mb-6 border border-gray-200">
        <h1 className="text-4xl font-bold mb-4">{place.title}</h1>

        {/* About */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{place.about || place.description}</p>
        </section>

        {/* How to Reach */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">How to Reach</h2>
          <p className="text-gray-700">{place.howToReach || "Details not available."}</p>
        </section>

        {place.entryFee && (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Entry Fee</h2>
            <p className="text-gray-700">{place.entryFee}</p>
          </section>
        )}

        {/* Local Foods */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Local Foods</h2>
          {localFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {localFoods.map((food) => (
                <div
                  key={food.foodId}
                  className="bg-blue-50 rounded-lg shadow border p-4 flex flex-col items-center h-full"
                >
                  {food.imageUrl && (
                    <img
                      src={food.imageUrl}
                      alt={food.foodName}
                      className="w-24 h-24 object-cover mb-2 rounded shadow"
                    />
                  )}
                  <div className="text-lg font-bold text-blue-900 mb-1 text-center">
                    {food.foodName}
                  </div>
                  {food.description && (
                    <div className="text-sm text-gray-700 text-center">{food.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No local foods information available.</p>
          )}
        </section>

        {/* Reviews */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Reviews & Ratings</h2>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <ul className="divide-y">
              {reviews.map((review) => (
                <li key={review.reviewId || Math.random()} className="py-3">
                  <div className="font-bold">{review.username || review.userId || "User"}</div>
                  <div className="text-yellow-600 mb-1">
                    {"★".repeat(review.rating || 0)}
                    {"☆".repeat(5 - (review.rating || 0))}
                  </div>
                  <div>{review.comment || "No comment provided."}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No reviews yet. Be the first to review!</div>
          )}
        </section>

        {/* Map */}
        <section className="mb-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2 text-center">Map</h2>
          <div
            className="relative mx-auto rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center mt-4"
            style={{ maxWidth: "700px", height: "260px", width: "100%" }}
          >
            {place.latitude && place.longitude ? (
              <iframe
                title={`Map of ${place.title}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, minHeight: "260px", minWidth: "100%" }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/search?key=${Maps_API_KEY}&q=${place.latitude},${place.longitude}&zoom=12&maptype=roadmap`}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-center text-sm">
                Coordinates not available for map.
              </div>
            )}
          </div>
        </section>

        {/* Booking Buttons */}
        <section className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link to="https://www.irctc.co.in/nget/train-search">
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
              Book Train
            </button>
          </Link>
          <button
            onClick={handleBookFlightClick}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            Book Flight
          </button>
          <Link to="https://www.booking.com/">
            <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
              Book Hotel
            </button>
          </Link>
        </section>
      </div>

      {/* Flight Booking Form */}
      {showFlightForm && (
        <FlightBookingForm
          destinationCity={place.cityId}
          onClose={() => setShowFlightForm(false)}
        />
      )}

      <div className="text-center mt-8">
        <Link
          to="/destinations"
          className="inline-block bg-gray-700 text-white px-8 py-4 rounded-md hover:bg-gray-900 transition font-medium text-lg"
        >
          Back to Destinations
        </Link>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
