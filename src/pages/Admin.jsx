import React, { useContext, useEffect, useState } from 'react'
import '../styles/Admin.css'
import UserContext from '../contexts/UserContext'
import { adminDeleteUser, adminFetchAllUsers } from '../services/ApiService';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { currentUser, isRequestToGetCurrentUserDone } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [isRequestToGetUsersDone, setIsRequestToGetUsersDone] = useState(false);

  const getAllUsers = async () => {
    try {
      const { data } = await adminFetchAllUsers();
      setUsers(data.filter(({ username }) => username != currentUser.username))
    } catch (err) {
      console.error(err);
    }
    setIsRequestToGetUsersDone(true);
  }

  useEffect(() => {
    if (currentUser && currentUser.role == "ADMIN") {
      getAllUsers();
    }
  }, [currentUser]);

  const handleDeleteUser = async (username) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${username}'s account? This action cannot be undone.`
    );
    if (confirmDelete) {
      try {
        await adminDeleteUser(username);
        getAllUsers();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className='admin-page'>
      {(currentUser && currentUser.role == "ADMIN") &&
        <div>
          <h2>Admin Page</h2>
          {(users.length > 0) &&
            <ul className='user-list'>
              {users.map(({ username, first_name, last_name, email, phone, address }) =>
                <li key={username} className='user-item'>
                  <div className='user-info'>
                    <span>Username: <b>{username}</b></span>
                    <span>Name: <b>{first_name} {last_name}</b></span>
                    <span>Email: <b>{email}</b></span>
                    <span>Phone: <b>{phone}</b></span>
                    <span>Address: <b>{address}</b></span>
                  </div>
                  <div className='actions'>
                    <Link to={`/admin/user/${username}`}>View {username}'s notes</Link>
                    <button onClick={() => handleDeleteUser(username)} className='delete-btn'>Delete User</button>
                  </div>
                </li>)
              }
            </ul>
          }
          {(isRequestToGetUsersDone && !users.length) && <h3>No users found</h3>}
        </div>
      }
      {(isRequestToGetCurrentUserDone && (!currentUser || currentUser.role != "ADMIN")) &&
        <div>
          <h2>Unauthorized Access</h2>
          <h3>You are not authorized to access this page</h3>
        </div>
      }
    </div>
  )
}

export default Admin