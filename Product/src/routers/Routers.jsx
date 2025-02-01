import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import Products from '../components/Products';
import ProductDetails from '../components/ProductDetail';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ProtectedRoute from './ProtectedRoute';
import RecipeUploadForm from '../components/ProductUploadForm';

const Routers = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return ( 
      <div className="fullload">
        <div className="loader"></div> 
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/products" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/products" /> : <Signup />} />
      <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
      <Route path="/recipes/:id" element={<ProductDetails />} />
      <Route path="/upload" element={user ? <RecipeUploadForm /> : <Navigate to="/login" />} />

      <Route path="/*" element={<ProtectedRoute />} />
      <Route path="*" element={<Navigate to="/products" />} />
    </Routes>
  );
};

export default Routers;
