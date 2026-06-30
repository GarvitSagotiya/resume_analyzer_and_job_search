import React from 'react';
import AppRoutes from './routes/AppRoutes';
// 1. Import your AuthProvider
import { AuthProvider } from './context/AuthContext'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    // 2. Wrap your routing layer inside the Provider
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;