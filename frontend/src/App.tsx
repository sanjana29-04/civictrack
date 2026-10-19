import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ExploreIncidentsPage } from './pages/public/ExploreIncidentsPage';
import { InteractiveMapPage } from './pages/public/InteractiveMapPage';
import { IncidentDetailsPage } from './pages/public/IncidentDetailsPage';
import { ReportIncidentPage } from './pages/public/ReportIncidentPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { GuidelinesPage } from './pages/public/GuidelinesPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Citizen Pages
import { CitizenDashboardPage } from './pages/citizen/CitizenDashboardPage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Admin & Operations Pages
import { OperationsDashboardPage } from './pages/admin/OperationsDashboardPage';
import { ReviewQueuePage } from './pages/admin/ReviewQueuePage';
import { DuplicateReviewPage } from './pages/admin/DuplicateReviewPage';
import { ResolutionVerificationPage } from './pages/admin/ResolutionVerificationPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, // 3 minutes
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExploreIncidentsPage />} />
                  <Route path="/map" element={<InteractiveMapPage />} />
                  <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/guidelines" element={<GuidelinesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected reporting route - requires login/registration */}
                  <Route
                    path="/report"
                    element={
                      <ProtectedRoute>
                        <ReportIncidentPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CitizenDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-reports"
                    element={
                      <ProtectedRoute>
                        <MyReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Operational & Moderator routes */}
                  <Route
                    path="/admin/operations"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OPERATIONS', 'ROLE_MODERATOR']}>
                        <OperationsDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reviews"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_MODERATOR', 'ROLE_OPERATIONS']}>
                        <ReviewQueuePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/duplicates"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_MODERATOR', 'ROLE_OPERATIONS']}>
                        <DuplicateReviewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/resolution"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OPERATIONS', 'ROLE_MODERATOR']}>
                        <ResolutionVerificationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/audit"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_MODERATOR', 'ROLE_OPERATIONS']}>
                        <AuditLogPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <MobileBottomBar />
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
