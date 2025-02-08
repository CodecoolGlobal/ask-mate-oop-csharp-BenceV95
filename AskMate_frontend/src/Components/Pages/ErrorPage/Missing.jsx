import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <div>
        <h1>Page is Missing</h1>
        <Link to={"/"}><button className='btn btn-primary'>Home</button></Link>
    </div>
  )
}

export default Missing