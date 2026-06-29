import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
      <div className="p-5 mb-4 bg-light rounded-3 mt-1 header">
        <div className="container-fluid py-5">
            <h1 className='display-5 fw-bold'>order your favorite food here</h1>
            <p className="col-md-8 fs-4">Display the best food and drinks in bengaluru</p>
            <Link to="/explore" className='btn btn-primary'>Explore</Link>
        </div>
      </div>
    
  )
}

export default Header;
