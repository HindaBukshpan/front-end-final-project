import React, { useContext } from 'react'
import '../styles/Navbar.css'
import CustomLink from './CustomLink'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { removeAuthHeaders } from '../services/ApiService'

const Navbar = () => {
  const { currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    setTimeout(() => {
      removeAuthHeaders("token");
      updateCurrentUserContext(null);
      navigate("/");
    }, 1000)
  }

  return (
    <nav className='navbar'>
      <CustomLink to="/" children="MyShop" />
      <div className='navbar-links'>
        {isRequestToGetCurrentUserDone && !currentUser && <CustomLink to="/login" children="Login" />}
        {currentUser &&
          <div>
            <CustomLink to="/wish-list" children="FavoriteList" />
            <CustomLink to="/orders" children="Orders" />
            <CustomLink to="/profile" children="Profile" />
            {(currentUser.role == "ADMIN") &&
              <CustomLink to="/admin" children="Admin" />
            }
            <button onClick={logout}>Logout</button>
          </div>}
      </div>
    </nav>
  )
}

export default Navbar