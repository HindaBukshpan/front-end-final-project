import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import FavoriteList from './pages/FavoriteList';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from './services/ApiService';
import UserContext from './contexts/UserContext';
import Orders from './pages/Orders';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRequestToGetCurrentUserDone, setIsRequestToGetCurrentUserDone] = useState(false);

  const updateCurrentUserContext = (user) => {
    console.log("current user: " + JSON.stringify(user));
    setCurrentUser(user);
  }

  const getCurrentUserForContext = async () => {
    try {
      if (localStorage.getItem('token')) {
        const { data } = await fetchCurrentUser();
        updateCurrentUserContext(data);
      }
    } catch (err) {
      console.error("Error fetching current user: ", err);
    }
    setIsRequestToGetCurrentUserDone(true);
  }

  useEffect(() => {
    getCurrentUserForContext();
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/wish-list' element={<FavoriteList />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
