import React from 'react'
import '../styles/NotFound.css'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='not-found-container'>
      <div className='not-found-content'>
        <h1 className='not-found-title'>404</h1>
        <p className='not-found-message'>Oops! The page you are looking for does not exist.</p>
        <Link to="/" className='not-found-link'>Go back to home</Link>
      </div>
    </div>
  )
}

export default NotFound