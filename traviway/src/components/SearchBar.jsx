import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiClient";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "All Categories" });
  const [selectedCity, setSelectedCity] = useState({ id: "", name: "All Cities" });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const navigate = useNavigate();

  const categoryRef = useRef();
  const cityRef = useRef();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          API.get("/content/categories"),
          API.get("/content/cities"),
        ]);
        setCategories(catRes.data);
        setCities(cityRes.data);
      } catch (error) {
        console.error("Failed to fetch categories or cities", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let params = [];
    if (query.trim()) params.push(`title=${encodeURIComponent(query.trim())}`);
    if (selectedCategory.id) params.push(`categoryId=${selectedCategory.id}`);
    if (selectedCity.id) params.push(`cityId=${selectedCity.id}`);
    const qs = params.length ? "?" + params.join("&") : "";
    navigate(`/search${qs}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center w-full max-w-4xl mx-auto mt-8 mb-10"
      style={{ borderRadius: "3rem", background: "#fff", boxShadow: "0 2px 16px rgba(100,60,255,0.04)" }}
    >
      {/* Search Input */}
      <div className="flex flex-1 items-center space-x-4 pl-5">
        <span className="text-gray-400 text-lg">
          <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle stroke="#CCC" cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M18 18l-3.5-3.5" stroke="#CCC" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          className="flex-1 py-4 px-2 text-gray-700 bg-transparent focus:outline-none placeholder-gray-400 text-lg font-medium"
          style={{ minWidth: "170px", border: "none", outline: "none" }}
          placeholder="Search for destination"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative border-l border-gray-200 px-6 flex items-center" ref={categoryRef}>
        <button
          type="button"
          onClick={() => setCategoryOpen((prev) => !prev)}
          className="text-gray-700 font-medium text-lg flex items-center space-x-1 focus:outline-none"
          aria-haspopup="listbox"
          aria-expanded={categoryOpen}
          aria-label="Select category"
        >
          <span>{selectedCategory.name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {categoryOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 top-full left-0 mt-1 w-48 max-h-40 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg"
          >
            <li
              onClick={() => {
                setSelectedCategory({ id: "", name: "All Categories" });
                setCategoryOpen(false);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-purple-100"
              role="option"
              aria-selected={selectedCategory.id === ""}
            >
              All Categories
            </li>
            {categories.map((cat) => (
              <li
                key={cat.categoryId}
                onClick={() => {
                  setSelectedCategory({ id: cat.categoryId, name: cat.categoryName });
                  setCategoryOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 hover:bg-purple-100 ${
                  selectedCategory.id === cat.categoryId ? "bg-purple-100 font-semibold" : ""
                }`}
                role="option"
                aria-selected={selectedCategory.id === cat.categoryId}
              >
                {cat.categoryName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* City Dropdown */}
      <div className="relative border-l border-gray-200 px-6 flex items-center" ref={cityRef}>
        <button
          type="button"
          onClick={() => setCityOpen((prev) => !prev)}
          className="text-gray-700 font-medium text-lg flex items-center space-x-1 focus:outline-none"
          aria-haspopup="listbox"
          aria-expanded={cityOpen}
          aria-label="Select city"
        >
          <span>{selectedCity.name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${cityOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {cityOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 top-full left-0 mt-1 w-48 max-h-40 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg"
          >
            <li
              onClick={() => {
                setSelectedCity({ id: "", name: "All Cities" });
                setCityOpen(false);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-purple-100"
              role="option"
              aria-selected={selectedCity.id === ""}
            >
              All Cities
            </li>
            {cities.map((city) => (
              <li
                key={city.cityId}
                onClick={() => {
                  setSelectedCity({ id: city.cityId, name: city.cityName });
                  setCityOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 hover:bg-purple-100 ${
                  selectedCity.id === city.cityId ? "bg-purple-100 font-semibold" : ""
                }`}
                role="option"
                aria-selected={selectedCity.id === city.cityId}
              >
                {city.cityName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-r-full px-8 py-4 text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-colors shadow-none border-none"
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        aria-label="Search button"
      >
        <svg
          className="mr-2"
          fill="none"
          width="22"
          height="22"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-3.5-3.5" />
        </svg>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
