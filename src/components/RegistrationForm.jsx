import React, { useEffect, useState } from 'react'
import '../styles/RegistrationForm.css'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/ApiService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  // Regular expressions for validations
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,24}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]*$/; // change: regex for phone validation (is optional & only numbers)


  const validateField = (name, value) => {
    let error = '';
    if (!value.trim() && ['first_name', 'last_name', 'email', 'username', 'password'].includes(name)) {
      error = `${name.replace("_", " ")} is required.`;
    } else if (name == "username" && !usernameRegex.test(value)) {
      error = "Username should be between 4 and 24 characters and start with a letter.";
    } else if (name == "password" && !passwordRegex.test(value)) {
      error = "Password should be between 8 and 24 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
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
    const { first_name, last_name, email, username, password } = formData;
    setIsFormValid(
      Boolean(first_name && last_name && email && username && password) &&
      Object.values(errors).every(err => !err)
    );
  }, [errors])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await register(formData);
      navigate('/login');
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

  return (
    <form className='registration-form' onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type='text'
        placeholder='First Name'
        name='first_name'
        value={formData.first_name}
        onChange={handleChange}
        className={errors.first_name ? 'input-error' : ''}
      />
      {errors.first_name && <p className='error-text'>{errors.first_name}</p>}
      <input
        type='text'
        placeholder='Last Name'
        name='last_name'
        value={formData.last_name}
        onChange={handleChange}
        className={errors.last_name ? 'input-error' : ''}
      />
      {errors.last_name && <p className='error-text'>{errors.last_name}</p>}
      <input
        type='email'
        placeholder='Email Address'
        name='email'
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? 'input-error' : ''}
      />
      {errors.email && <p className='error-text'>{errors.email}</p>}
      <input
        type='tel'
        placeholder='Phone Number'
        name='phone'
        value={formData.phone}
        onChange={handleChange}
        className={errors.phone ? 'input-error' : ''}
      />
      {errors.phone && <p className='error-text'>{errors.phone}</p>}
      <input
        type='text'
        placeholder='Address'
        name='address'
        value={formData.address}
        onChange={handleChange}
      />
        <input
        type='text'
        placeholder='Username'
        name='username'
        value={formData.username}
        onChange={handleChange}
        className={errors.username ? 'input-error' : ''}
      />
      {errors.username && <p className='error-text'>{errors.username}</p>}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          style={{
            width: "98%",
            paddingRight: "0",
            paddingLeft: "0.5rem",
            marginBottom: "0"
          }}
        />
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer"
          }}
        >
          {showPassword ? <VisibilityIcon style={{ fontSize: "20px" }} /> : <VisibilityOffIcon style={{ fontSize: "20px" }} />}
        </span>
      </div>
      {errors.password && <p className='error-text'>{errors.password}</p>}
      <select name='role' onChange={handleChange} value={formData.role}>
        <option value='USER'>User</option>
        <option value='ADMIN'>Admin</option>
      </select>
      {errorFromServer && <p className='error-text'>{errorFromServer}</p>}
      <button type='submit' disabled={!isFormValid}>Register</button>
      <button type='button' onClick={() => navigate("/login")}>Login</button>
    </form>
  )
}

export default RegistrationForm