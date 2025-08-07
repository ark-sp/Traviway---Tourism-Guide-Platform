import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, User, ChevronDown, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add top padding to body to avoid overlap by fixed navbar
useEffect(() => {
  const paddingClass = 'pt-20'; // 80px top padding to compensate for navbar fixed height
  document.body.classList.add(paddingClass);
  return () => document.body.classList.remove(paddingClass);
}, []);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/icon2.png" // Use your icon or new logo here
            alt="Traviway Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white text-lg font-semibold hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            to="/destinations"
            className="text-white text-lg font-semibold hover:text-blue-400 transition"
          >
            Destinations
          </Link>
          <Link
            to="/plan-trip"
            className="text-white text-lg font-semibold hover:text-blue-400 transition"
          >
            Plan Your Trip ✨
          </Link>
          <Link
            to="/about"
            className="text-white text-lg font-semibold hover:text-blue-400 transition"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white text-lg font-semibold hover:text-blue-400 transition"
          >
            Contact
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen((open) => !open)}
              className="flex items-center text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:text-blue-400 focus:outline-none transition"
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
            >
              <User size={20} className="mr-1" />
              {user ? (
                <span className="font-semibold">{user.username}</span>
              ) : (
                <span className="font-semibold">Account</span>
              )}
              <ChevronDown size={16} className="ml-1" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg text-gray-800 py-2 z-50 bg-white border border-gray-200">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-green-600 font-semibold">
                     <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-green-400 font-semibold mb-2"
                  >
                    {user.username}
                  </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      
                      Logout
                      
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className=" block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-lg z-40"
        >
          <div className="flex flex-col space-y-4 py-4 px-6 text-white">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold hover:text-blue-400"
            >
              Destinations
            </Link>
            <Link
              to="/plan-trip"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold hover:text-blue-400"
            >
              Plan Your Trip ✨
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold hover:text-blue-400"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-semibold hover:text-blue-400"
            >
              Contact
            </Link>

            <div className="border-t border-gray-700 pt-3">
              {user ? (
                <>
                  <div className="text-green-400 font-semibold mb-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-green-600 font-semibold hover:bg-gray-100"
                    >
                    {user.username}
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-red-500 font-semibold hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-semibold hover:text-blue-400 mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-semibold hover:text-blue-400"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
