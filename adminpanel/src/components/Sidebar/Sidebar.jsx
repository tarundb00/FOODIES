import React from 'react';
import { Link } from 'react-router-dom';
import {assets} from '../../assets/assets';
const Sidebar = ({sidebarVisible}) => {
  return (
    <div className={`border-end bg-white ${sidebarVisible ? '':'d-none'}`} id="sidebar-wrapper">
                <div className="sidebar-heading border-bottom bg-light">
                  <img src={assets.logo} alt="" width={32} height={46}/>
                </div>
                <div className="list-group list-group-flush">
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/add">
                    <i className='bi bi-plus-circle me-3'></i>Add Food</Link>
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/List">
                     <i className='bi bi-list-ul me-3'></i>List Food</Link>
                    <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/Orders">
                     <i className='bi bi-cart me-3'></i>Orders</Link>
                </div>
        </div>
  )
}

export default Sidebar;
