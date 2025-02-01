import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import Header from './Header';
import Routers from '../routers/Routers';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && isAuthPage) {
        navigate("/products"); 
      }
    });
  }, [navigate, isAuthPage]);

  return (
    <>
      {!isAuthPage && <Header />}
      <div>
        <Routers />
      </div>
    </>
  );
};

export default Layout;
