import React from 'react'
import '../styles/Login.css'
import LoginForm from '../components/LoginForm'

const Login = () => {
  return (
    <div className='login-page'>
      <h2>Login to your account</h2>
      <LoginForm/>
    </div>
  )
}

export default Login