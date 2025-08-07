import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        // Auto login after registration
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.jwt) {
          login(loginData.jwt);
          navigate("/");
        } else {
          setError("Login after registration failed");
        }
      } else {
        // Try to extract error from JSON or fallback to plain text
        let errMsg;
        try {
          const errJson = await res.json();
          errMsg = errJson.message;
        } catch {
          errMsg = await res.text();
        }
        setError(errMsg || "Registration failed");
      }
    } catch {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Register</h2>

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          disabled={loading}
        />

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Your email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          disabled={loading}
        />

        <label className="block mb-2 font-semibold text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600 hover:text-green-800 focus:outline-none"
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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
