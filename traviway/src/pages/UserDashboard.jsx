import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.userId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [
          blogsResponse, 
          reviewsResponse, 
          visitedPlacesResponse, 
          wishlistsResponse
        ] = await Promise.all([
          API.get(`/blogs/by-user/${user.userId}`),
          API.get(`/reviews/by-user/${user.userId}`),
          API.get(`/visited-places/by-user/${user.userId}`),
          API.get(`/wishlists/by-user/${user.userId}`),
        ]);

        setBlogs(blogsResponse.data);
        setReviews(reviewsResponse.data);
        setVisitedPlaces(visitedPlacesResponse.data);
        setWishlists(wishlistsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please ensure all backend services are running.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return <ErrorMessage message="You must be logged in to view your dashboard." />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="w-screen container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Hello, {user.username}!</h1>

      {/* Blogs Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <div key={blog.blogId} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have not written any blogs yet.</p>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.reviewId} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Review for: {review.placeTitle}</h3>
                <p className="text-gray-600 mb-2">Rating: {review.rating}/5</p>
                <p className="text-gray-600 mb-4 line-clamp-3">{review.comment}</p>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have not left any reviews yet.</p>
          )}
        </div>
      </section>

      {/* Visited Places Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Visited Places</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visitedPlaces.length > 0 ? (
            visitedPlaces.map(place => (
              <div key={place.visitId} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{place.placeTitle}</h3>
                <p className="text-gray-600 mb-4">Visited on: {new Date(place.visitedAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have not marked any places as visited yet.</p>
          )}
        </div>
      </section>

      {/* Wishlist Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Your Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlists.length > 0 ? (
            wishlists.map(wishlist => (
              <div key={wishlist.wishlistId} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{wishlist.placeTitle}</h3>
                <p className="text-gray-600 mb-4">Added on: {new Date(wishlist.addedAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;