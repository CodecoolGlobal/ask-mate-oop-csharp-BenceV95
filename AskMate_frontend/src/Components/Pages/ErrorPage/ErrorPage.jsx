import React from 'react'
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <img src={'./src/assets/assape.webp'} alt="Error" className="error-image" />
      <h1>Oops! You Don't have permission to view this content!</h1>
      <p>Try logging in...</p>
    </div>
  )
}

export default ErrorPage