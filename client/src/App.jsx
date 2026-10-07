import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ClickAnimationOverlay } from './components/effects/ClickAnimationOverlay.jsx';
import { AppLoadingScreen } from './components/effects/AppLoadingScreen.jsx';

// Dynamic Page Title Handler
const PageTitleHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/about': 'About Us | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/how-it-works': 'How It Works | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/find-donors': 'Find Blood Donors | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/login': 'Login | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/register': 'Register | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/emergency-request': 'Emergency Request | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/donor/dashboard': 'Donor Dashboard | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/donor/profile': 'Donor Profile | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/donor/history': 'Donation History | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/donor/requests': 'Nearby Requests | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/patient/dashboard': 'Patient Dashboard | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/patient/requests': 'My Requests | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/hospital/dashboard': 'Hospital Dashboard | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/hospital/requests': 'Hospital Requests | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/hospital/matches': 'Hospital Matches | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/hospital/profile': 'Hospital Profile | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/dashboard': 'Admin Dashboard | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/users': 'Manage Users | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/donors': 'Manage Donors | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/requests': 'Manage Requests | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/hospitals': 'Manage Hospitals | LifeLink – Connecting Donors. Saving Lives. 🩸',
      '/admin/reports': 'Reports & Analytics | LifeLink – Connecting Donors. Saving Lives. 🩸',
    };

    document.title = titles[location.pathname] || 'LifeLink – Connecting Donors. Saving Lives. 🩸';
  }, [location]);

  return null;
};

// Public Pages
import { Home } from './pages/public/Home.jsx';
import { About } from './pages/public/About.jsx';
import { HowItWorksPage } from './pages/public/HowItWorksPage.jsx';
import { FindDonorsPublic } from './pages/public/FindDonorsPublic.jsx';
import { Login } from './pages/public/Login.jsx';
import { Register } from './pages/public/Register.jsx';

// Layout & Protected Route
import { DashboardLayout } from './components/DashboardLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard.jsx';
import { DonorProfile } from './pages/donor/DonorProfile.jsx';
import { DonationHistory } from './pages/donor/DonationHistory.jsx';
import { NearbyRequests } from './pages/donor/NearbyRequests.jsx';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard.jsx';
import { CreateBloodRequest } from './pages/patient/CreateBloodRequest.jsx';
import { MyRequests } from './pages/patient/MyRequests.jsx';
import { RequestDetails } from './pages/patient/RequestDetails.jsx';
import { MatchedDonorsPage } from './pages/patient/MatchedDonorsPage.jsx';

// Hospital Pages
import { HospitalDashboard } from './pages/hospital/HospitalDashboard.jsx';
import { HospitalRequests } from './pages/hospital/HospitalRequests.jsx';
import { HospitalMatches } from './pages/hospital/HospitalMatches.jsx';
import { HospitalProfile } from './pages/hospital/HospitalProfile.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { ManageUsers } from './pages/admin/ManageUsers.jsx';
import { ManageDonors } from './pages/admin/ManageDonors.jsx';
import { ManageRequests } from './pages/admin/ManageRequests.jsx';
import { ManageHospitals } from './pages/admin/ManageHospitals.jsx';
import { ReportsPage } from './pages/admin/ReportsPage.jsx';

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      {/* Route-aware Dynamic Page Title Manager */}
      <PageTitleHandler />

      {/* Intro Blood Drop Falling Splash Animation Screen */}
      {isLoading && <AppLoadingScreen onComplete={() => setIsLoading(false)} />}

      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              {/* Global Interactive Click Animation Overlay matching video */}
              <ClickAnimationOverlay />

              <Routes>
                {/* Public Standalone Views */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/find-donors" element={<FindDonorsPublic />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/emergency-request" element={<CreateBloodRequest />} />

                {/* Authenticated Dashboard Shell Layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    {/* Donor Portal */}
                    <Route path="/donor/dashboard" element={<DonorDashboard />} />
                    <Route path="/donor/profile" element={<DonorProfile />} />
                    <Route path="/donor/history" element={<DonationHistory />} />
                    <Route path="/donor/requests" element={<NearbyRequests />} />

                    {/* Patient Portal */}
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/requests" element={<MyRequests />} />
                    <Route path="/patient/requests/:id" element={<RequestDetails />} />
                    <Route path="/patient/requests/:id/matches" element={<MatchedDonorsPage />} />

                    {/* Hospital Portal */}
                    <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
                    <Route path="/hospital/requests" element={<HospitalRequests />} />
                    <Route path="/hospital/matches" element={<HospitalMatches />} />
                    <Route path="/hospital/profile" element={<HospitalProfile />} />

                    {/* Admin Portal */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/donors" element={<ManageDonors />} />
                    <Route path="/admin/requests" element={<ManageRequests />} />
                    <Route path="/admin/hospitals" element={<ManageHospitals />} />
                    <Route path="/admin/reports" element={<ReportsPage />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
