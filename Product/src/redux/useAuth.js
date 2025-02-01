import { useEffect, useState } from 'react';
import { auth } from '../firebase';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkadmin = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);

        const isAdminUser = user.email === 'admin@gmail.com';
        setIsAdmin(isAdminUser);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => checkadmin();
  }, []);

  return { currentUser, isAdmin };
};

export default useAuth;