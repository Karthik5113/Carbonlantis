import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { MRVPage } from '../pages/MRVPage';
import { CDRPage } from '../pages/CDRPage';
import { DeploymentsPage } from '../pages/DeploymentsPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mrv" element={<MRVPage />} />
      <Route path="/cdr" element={<CDRPage />} />
      <Route path="/deployments" element={<DeploymentsPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Enterprise MRV Dashboard: Requires Authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
