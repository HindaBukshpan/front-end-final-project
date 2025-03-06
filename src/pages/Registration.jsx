import React from 'react'
import '../styles/Registration.css'
import RegistrationForm from '../components/RegistrationForm'

const Registration = () => {
  return (
    <div className='registration-page'>
      <h2>Register for your account</h2>
      <RegistrationForm/>
    </div>
  )
}

export default Registration