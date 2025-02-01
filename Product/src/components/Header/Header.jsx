import React, { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './header.css';
import { Container, Row } from 'reactstrap';
import useAuth from '../../redux/useAuth';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { MdOutlineLogout } from 'react-icons/md';
import { MdLogin } from 'react-icons/md';
import { FiUserPlus } from 'react-icons/fi';

const Header = () => {
  const headerRef = useRef(null);
  const profileActionRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  const nav__links = [
    { path: 'products', display: 'Products' },
    ...(isAdmin
      ? [{ path: 'upload', display: 'Products Upload' }]
      : []),
  ];

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logged out');
        navigate('/login');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const menuToggle = () => menuRef.current.classList.toggle('active__menu');

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row className="header0">
          <div className="nav__wrapper">
            <div className="logo">
              <Link to="/home">
                <h4>Products</h4>
              </Link>
            </div>
            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) => (navClass.isActive ? 'nav__active' : '')}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              <div className="profile">
                {currentUser ? (
                  <button onClick={logout} className="logout-btn">
                    <MdOutlineLogout /> Logout
                  </button>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/signup" className="btn">
                      <FiUserPlus /> Signup
                    </Link>
                    <Link to="/login" className="btn">
                      <MdLogin /> Login
                    </Link>
                  </div>
                )}
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
