import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "./UserDashboard";
import LoadingSpinner from "../components/LoadingSpinner";

// This wrapper component uses `useAuth` to obtain user info (including userId) and token,
// then passes userId down to UserDashboard.
// It displays loading and error UI as needed.

const DashboardWrapper = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect user to login if no valid user/token is found
    if (!user || !token) {
      setError("You must be logged in to access the dashboard.");
      setLoading(false);
      // Optionally you can uncomment the next line to auto-redirect
      // navigate("/login");
      return;
    }


    if (!user.userId) {
      setError("User ID not available. Please re-login.");
      setLoading(false);
      // Optionally you can do a redirect here as well
      // navigate("/login");
      return;
    }

    // Ready to show dashboard
    setLoading(false);
  }, [user, token, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold mt-6 p-4">
        {error}
      </div>
    );
  }
 
  // Pass userId directly from decoded JWT stored in user context
  return <UserDashboard userId={user.userId} />;
};

export default DashboardWrapper;
