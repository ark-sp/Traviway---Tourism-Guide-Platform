import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import TripPlannerPage from "./pages/TripPlannerPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import SearchResultsPage from "./pages/SearchResultsPage";
import CityDetailPage from "./pages/CityDetailPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import DashboardWrapper from "./pages/DashboardWrapper";
import BlogsPage from "./pages/BlogsPage";
import BlogCreatePage from "./pages/BlogCreatePage";

const style = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-inter">
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
            rel="stylesheet"
          />
          <style>{`
            body {
              font-family: 'Inter', sans-serif;
            }
            .font-inter {
              font-family: 'Inter', sans-serif;
            }
          `}</style>

          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:cityId" element={<CityDetailPage />} />
            <Route path="/plan-trip" element={<TripPlannerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/places/:placeId" element={<DestinationDetailPage />} />
            <Route path="/dashboardWrapper" element={<DashboardWrapper />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/create" element={<BlogCreatePage />} />
          </Routes>

          <footer className="bg-gray-800 text-white p-6 text-center mt-12 rounded-t-lg shadow-inner">
            <div className="container mx-auto">
              <p>&copy; {new Date().getFullYear()} Traviway. All rights reserved.</p>
              <p className="mt-2">Inspired by the rich heritage of India.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
