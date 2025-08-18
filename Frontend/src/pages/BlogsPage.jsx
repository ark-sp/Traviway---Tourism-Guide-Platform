import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const BlogsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterPlace, setFilterPlace] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/travyway/blogs");
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      } catch (err) {
        setError("Failed to load blogs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filtering logic based on Date and Place only
  useEffect(() => {
    let filtered = [...blogs];

    if (filterDate) {
      filtered = filtered.filter((blog) => {
        const blogDate = new Date(blog.createdAt).toISOString().slice(0, 10);
        return blogDate === filterDate;
      });
    }

    if (filterPlace) {
      filtered = filtered.filter(
        (blog) =>
          blog.placeTitle && // Changed from blog.place to blog.placeTitle
          blog.placeTitle.toLowerCase().includes(filterPlace.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  }, [filterDate, filterPlace, blogs]);

  const handleWriteBlog = () => {
    if (user) {
      navigate("/blogs/create");
    } else {
      navigate("/login");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-screen mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Blogs</h1>
        <button
          onClick={handleWriteBlog}
          className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Write a Blog
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Filter by Date"
        />
        <input
          type="text"
          value={filterPlace}
          onChange={(e) => setFilterPlace(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Filter by Place"
        />
      </div>

      {/* Blog list */}
      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs found matching filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.map((blog) => (
            <div key={blog.blogId} className="border rounded-lg shadow p-6 bg-white">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
              <div className="text-sm text-gray-500 mb-2">
                {blog.placeTitle && <span>{blog.placeTitle}</span>}
              </div>
              <small className="text-gray-400">
                Posted on: {new Date(blog.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
