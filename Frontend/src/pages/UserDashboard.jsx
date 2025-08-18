import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiClient"; 
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";


const TAB_BLOGS = "blogs";
const TAB_REVIEWS = "reviews";
const TAB_VISITED = "visited";
const TAB_WISHLIST = "wishlist";


const UserDashboard = ({ userId }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TAB_BLOGS);

  // Data states per tab
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Loading states per tab
  const [loadingMap, setLoadingMap] = useState({
    [TAB_BLOGS]: false,
    [TAB_REVIEWS]: false,
    [TAB_VISITED]: false,
    [TAB_WISHLIST]: false,
  });

  // Errors per tab
  const [errorMap, setErrorMap] = useState({
    [TAB_BLOGS]: null,
    [TAB_REVIEWS]: null,
    [TAB_VISITED]: null,
    [TAB_WISHLIST]: null,
  });

  // Helper for setting loading and error
  const setLoading = (tab, value) =>
    setLoadingMap((prev) => ({ ...prev, [tab]: value }));

  const setError = (tab, value) =>
    setErrorMap((prev) => ({ ...prev, [tab]: value }));

  // Fetch data helpers
  const fetchDataByTab = async (tab) => {
    if (!userId) {
      setError(tab, "User ID not provided.");
      return;
    }
    setLoading(tab, true);
    setError(tab, null);

    try {
      let res;
      switch (tab) {
        case TAB_BLOGS:
          res = await API.get(`travyway/blogs/by-user/${userId}`);
          setBlogs(res.data);
          break;
        case TAB_REVIEWS:
          res = await API.get(`travyway/reviews/by-user/${userId}`);
          setReviews(res.data);
          break;
        case TAB_VISITED:
          res = await API.get(`travyway/visited-places/by-user/${userId}`);
          setVisitedPlaces(res.data);
          break;
        case TAB_WISHLIST:
          res = await API.get(`travyway/wishlists/by-user/${userId}`);
          setWishlist(res.data);
          break;
        default:
          break;
      }
    } catch (error) {
      setError(tab, `You don't have any ${tab}.`);
    } finally {
      setLoading(tab, false);
    }
  };

  // Load data on tab change or when userId changes
  useEffect(() => {
    fetchDataByTab(activeTab);
  }, [activeTab, userId]);

  // Delete handlers with confirmation & optimistic UI update
  const handleDelete = async (type, id) => {
    const confirmMessages = {
      blogs: "Delete this blog?",
      reviews: "Delete this review?",
      visited: "Remove this visited place?",
      wishlist: "Remove this item from wishlist?",
    };

    if (!window.confirm(confirmMessages[type])) return;

    try {
      await API.delete(`/${type === TAB_WISHLIST ? 'wishlists' : type}/${id}`);

      // Update state optimistically
      switch (type) {
        case TAB_BLOGS:
          setBlogs((prev) => prev.filter((b) => b.blogId !== id));
          break;
        case TAB_REVIEWS:
          setReviews((prev) => prev.filter((r) => r.reviewId !== id));
          break;
        case TAB_VISITED:
          setVisitedPlaces((prev) => prev.filter((v) => v.visitedPlaceId !== id));
          break;
        case TAB_WISHLIST:
          setWishlist((prev) => prev.filter((w) => w.wishlistId !== id));
          break;
        default:
          break;
      }
    } catch {
      alert(`Failed to delete the selected ${type}.`);
    }
  };

  // Navigation to edit pages for blogs and reviews
  const goToEdit = (type, id) => {
    if (type === TAB_BLOGS) navigate(`/blogs/edit/${id}`);
    else if (type === TAB_REVIEWS) navigate(`/reviews/edit/${id}`);
  };

  // Format timestamps nicely
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  // Helper: navigate to place details for visited/wishlist places
  const goToPlaceDetails = (placeId) => {
    navigate(`/places/${placeId}`);
  };

  // New: Navigate to blog create page
  const goToCreateBlog = () => {
    navigate("/blogs/create");
  };

  return (
    <div className="w-screen mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8 flex-wrap">
        {[TAB_BLOGS, TAB_REVIEWS, TAB_VISITED, TAB_WISHLIST].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
              activeTab === tab
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {tab
              .charAt(0)
              .toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>

      {/* Write Blog button only on Blogs tab */}
      {activeTab === TAB_BLOGS && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={goToCreateBlog}
            className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold"
          >
            Write a Blog
          </button>
        </div>
      )}

      {/* Loading and error per tab */}
      {loadingMap[activeTab] && <LoadingSpinner />}
      {errorMap[activeTab] && (
        <div className="text-center text-red-600 font-semibold mb-6">
          {errorMap[activeTab]}
        </div>
      )}

      {/* Content per tab */}
      {!loadingMap[activeTab] && !errorMap[activeTab] && (
        <>
          {activeTab === TAB_BLOGS && (
            <section>
              {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blogs yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <article
                      key={blog.blogId}
                      className="border rounded-lg p-4 shadow hover:shadow-lg flex flex-col"
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {blog.title}
                      </h2>
                      <p className="mb-2 line-clamp-3">
                        {blog.content || "No content."}
                      </p>
                      <small className="text-gray-500 mb-4">
                        Created: {formatDate(blog.createdAt)}
                      </small>
                      <div className="mt-auto flex space-x-2">
                        <button
                          onClick={() => goToEdit(TAB_BLOGS, blog.blogId)}
                          className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(TAB_BLOGS, blog.blogId)}
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === TAB_REVIEWS && (
            <section>
              {reviews.length === 0 ? (
                <p className="text-center text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="border rounded-lg p-4 shadow hover:shadow-lg"
                    >
                      <p className="mb-2 line-clamp-3">
                        {review.comment || "No comment"}
                      </p>
                      <small className="block mb-1 text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </small>
                      <small className="text-gray-500 mb-4">
                        Created: {formatDate(review.createdAt)}
                      </small>
                      <div className=" flex space-x-2">
                        {/* <button
                          onClick={() => goToEdit(TAB_REVIEWS, review.reviewId)}
                          className="px-3 py-1 rounded bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:bg-indigo-700"
                        >
                          Edit
                        </button> */}
                        <button
                          onClick={() => handleDelete(TAB_REVIEWS, review.reviewId)}
                          className="px-3 py-1 rounded bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === TAB_VISITED && (
            <section>
              {visitedPlaces.length === 0 ? (
                <p className="text-center text-gray-500">
                  No visited places recorded.
                </p>
              ) : (
                <ul className="list-disc space-y-2 max-w-xl mx-auto">
                  {visitedPlaces.map((vp) => (
                    <li
                      key={vp.visitedPlaceId}
                      className="hover:underline cursor-pointer text-blue-700"
                      onClick={() => goToPlaceDetails(vp.placeId)}
                      title={`Visited on ${formatDate(vp.visitedAt)}`}
                    >
                      <strong>{vp.placeTitle || "Unknown place"}</strong> - visited
                      on {formatDate(vp.visitedAt)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeTab === TAB_WISHLIST && (
            <section>
              {wishlist.length === 0 ? (
                <p className="text-center text-gray-500">No wishlist items.</p>
              ) : (
                <ul className="list-disc space-y-2 max-w-xl mx-auto">
                  {wishlist.map((w) => (
                    <li
                      key={w.wishlistId}
                      className="hover:underline cursor-pointer text-blue-700"
                      onClick={() => goToPlaceDetails(w.placeId)}
                      title={`Added on ${formatDate(w.addedAt)}`}
                    >
                      <strong>{w.placeTitle || "Unknown place"}</strong> added on{" "}
                      {formatDate(w.addedAt)}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
