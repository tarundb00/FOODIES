import React, { useContext } from 'react';
import Menubar from './components/Menubar/Menubar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './pages/MyOrders/MyOrders';
import { StoreContext } from './context/StoreContext';

const App = () => {
  const {token} =useContext(StoreContext);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return token ? <Navigate to="/" replace /> : children;
  };

  return (
    <div>
     <Menubar/>
     <ToastContainer/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/explore' element={<ExploreFood/>}/>
      <Route path='/food/:id' element={<FoodDetails/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/order' element={<PrivateRoute><PlaceOrder/></PrivateRoute>}/>
      <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
      <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
      <Route path='/myorders' element={<PrivateRoute><MyOrders/></PrivateRoute>}/>
     </Routes>
     </div>
  )
}

export default App;
