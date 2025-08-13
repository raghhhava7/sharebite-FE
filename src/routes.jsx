import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './pages/NotFound';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Donation Components
import DonationList from './components/Donations/DonationList';
import CreateDonation from './components/Donations/CreateDonation';
import NearbyDonations from './components/Donations/NearbyDonations';
import MyDonations from './components/Donations/MyDonations';
import MyReservations from './components/Donations/MyReservations';

// Volunteer Components
import VolunteerTasks from './components/Volunteers/VolunteerTasks';
import AssignTask from './components/Volunteers/AssignTask';

// Admin Components
import UserManagement from './components/Admin/UserManagement';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes - Require Authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Donation Routes */}
      <Route 
        path="/donations" 
        element={
          <ProtectedRoute requiredRoles={['RECEIVER', 'ADMIN']}>
            <DonationList />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/create-donation" 
        element={
          <ProtectedRoute requiredRoles={['DONOR']}>
            <CreateDonation />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/donations/nearby" 
        element={
          <ProtectedRoute requiredRoles={['RECEIVER']}>
            <NearbyDonations />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-donations" 
        element={
          <ProtectedRoute requiredRoles={['DONOR']}>
            <MyDonations />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-reservations" 
        element={
          <ProtectedRoute requiredRoles={['RECEIVER']}>
            <MyReservations />
          </ProtectedRoute>
        } 
      />

      {/* Volunteer Routes */}
      <Route 
        path="/volunteer-tasks" 
        element={
          <ProtectedRoute requiredRoles={['VOLUNTEER']}>
            <VolunteerTasks />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/volunteer/tasks" 
        element={
          <ProtectedRoute requiredRoles={['VOLUNTEER']}>
            <VolunteerTasks />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/volunteer/assign" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'DONOR']}>
            <AssignTask />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/tasks" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <VolunteerTasks />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;