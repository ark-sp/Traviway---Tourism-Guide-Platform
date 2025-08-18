import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";

const BlogCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState(""); // for showing name in select
  const [content, setContent] = useState("");

  const [places, setPlaces] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch places on mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await API.get("/content/places");
        setPlaces(res.data);
      } catch (err) {
        console.error("Failed to load places", err);
      }
    };
    fetchPlaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Basic validation
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!selectedPlaceId) {
      setError("Please select a place.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (!user || !user.userId) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload with integer placeId
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        placeId: selectedPlaceId,
        userId: user.userId,
      };

      await API.post("/travyway/blogs", blogData);

      setSuccessMsg("Blog created successfully! Redirecting...");
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the blog."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle place select change
  const onPlaceChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedPlaceId(selectedId);
    const selectedPlace = places.find((p) => p.placeId === selectedId);
    setSelectedPlaceName(selectedPlace ? selectedPlace.title || selectedPlace.placeName || selectedPlace.name || "" : "");
  };

  if (!user) {
    return null; // or LoadingSpinner while redirecting
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Write a New Blog</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMsg}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block font-semibold mb-2">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter blog title"
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="place" className="block font-semibold mb-2">
            Place <span className="text-red-600">*</span>
          </label>
          <select
            id="place"
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            onChange={onPlaceChange}
            value={selectedPlaceId || ""}
            disabled={loading}
            required
          >
            <option value="" disabled>
              Select a place
            </option>
            {places.map((place) => (
              <option key={place.placeId || place.id} value={place.placeId || place.id}>
                {place.title || place.placeName || place.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block font-semibold mb-2">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            rows={8}
            placeholder="Write your blog content here..."
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreatePage;
