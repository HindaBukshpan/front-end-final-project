import React, { useContext, useEffect, useState } from 'react'
import '../styles/Profile.css'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom';
import { deleteCurrentUser, removeAuthHeaders, updateCurrentUser } from '../services/ApiService';

const Profile = () => {
  const { currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletedAccount, setIsDeletedAccount] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [errorFromServer, setErrorFromServer] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]*$/; // change: regex for phone validation (is optional & only numbers)

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser])

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim() && ['first_name', 'last_name', 'email'].includes(name)) {
      error = `${name.replace("_", " ")} is required.`;
    } else if (name == "email" && !emailRegex.test(value)) {
      error = "Please enter a valid email address.";
    } else if (name == "phone" && value.trim() && !phoneRegex.test(value)) {
      error = "Phone number should only contain numbers.";
    }
    setErrors({ ...errors, [name]: error });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  }

  useEffect(() => {
    if (formData) {
      const { first_name, last_name, email } = formData;
      setIsFormValid(
        Boolean(first_name && last_name && email) &&
        Object.values(errors).every(err => !err)
      );
    }
  }, [errors])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      const { data } = await updateCurrentUser(formData);
      updateCurrentUserContext(data);
      setIsEditing(false);
    } catch (err) {
      if (err.status == 400 || err.status == 500) {
        setErrorFromServer(err.response.data);
      }
      if (err.code == "ERR_NETWORK") {
        setErrorFromServer(err.message);
      }
      setTimeout(() => {
        setErrorFromServer("");
      }, 3000)
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const { data } = await deleteCurrentUser();
        removeAuthHeaders("token");
        updateCurrentUserContext(null);
        setIsDeletedAccount(data);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        if (err.status == 400 || err.status == 500) {
          setErrorFromServer(err.response.data);
        }
        if (err.code == "ERR_NETWORK") {
          setErrorFromServer(err.message);
        }
        setTimeout(() => {
          setErrorFromServer("");
        }, 3000)
      }
    }
  }

  return (
    <div className='profile'>
      {currentUser &&
        <div>
          {(formData && !isDeletedAccount) &&
            <div>
              <h2 className='center'>Your Profile</h2>
              <form className='profile-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label htmlFor='first_name' className='form-label'>
                    First Name
                  </label>
                  <input
                    type='text'
                    id='first_name'
                    name='first_name'
                    value={formData.first_name}
                    className={`form-input ${errors.first_name ? 'input-error' : ''}`}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.first_name && <p className='error-text'>{errors.first_name}</p>}
                </div>
                <div className='form-group'>
                  <label htmlFor='last_name' className='form-label'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='last_name'
                    name='last_name'
                    value={formData.last_name}
                    className={`form-input ${errors.last_name ? 'input-error' : ''}`}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.last_name && <p className='error-text'>{errors.last_name}</p>}
                </div>
                <div className='form-group'>
                  <label htmlFor='email' className='form-label'>
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.email && <p className='error-text'>{errors.email}</p>}
                </div>
                <div className='form-group'>
                  <label htmlFor='phone' className='form-label'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  {errors.phone && <p className='error-text'>{errors.phone}</p>}
                </div>
                <div className='form-group'>
                  <label htmlFor='address' className='form-label'>
                    Address
                  </label>
                  <input
                    type='text'
                    id='address'
                    name='address'
                    value={formData.address}
                    className="form-input"
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {!isEditing && <button type='button' onClick={handleEditToggle} className='edit-btn'>Edit</button>}
                {errorFromServer && <p className='error-text'>{errorFromServer}</p>}
                {isEditing && <button type='submit' disabled={!isFormValid} className='save-btn'>Save</button>}
              </form>
            </div>
          }
          {!isDeletedAccount && <button onClick={handleDeleteAccount} className='delete-btn'>Delete Your Account</button>}
          {isDeletedAccount && <h3>{isDeletedAccount}</h3>}
        </div>
      }
      {(isRequestToGetCurrentUserDone && !currentUser) &&
        <div style={{ textAlign: "center" }}>
          <h2>Unauthorized Access</h2>
          <h3>You need to login to access this page.</h3>
          <button type='button' className='login-btn' onClick={() => navigate("/login")}>Login</button>
        </div>
      }
    </div>
  )
}

export default Profile



