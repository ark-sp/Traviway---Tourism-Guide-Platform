import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.jwt) {
        login(data.jwt);
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Login</h2>

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          disabled={loading}
        />

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 pr-12"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md p-3 text-white font-semibold transition-colors
  ${
    loading
      ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
      : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black"
  }`}

        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
