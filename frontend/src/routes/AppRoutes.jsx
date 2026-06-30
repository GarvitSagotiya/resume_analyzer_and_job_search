import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Jobs from '../pages/Jobs/Jobs';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Register from "../pages/Register/Register";

const AppRoutes = () => {
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;