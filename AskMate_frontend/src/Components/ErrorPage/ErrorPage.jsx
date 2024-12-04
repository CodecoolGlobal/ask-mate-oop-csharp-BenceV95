import React from 'react'
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <img src={'./src/assets/assape.webp'} alt="Error" className="error-image" />
      <h1>Oops! Something went wrong...</h1>
      <p>Try refreshing the page or come back later.</p>
    </div>
  )
}

export default ErrorPage