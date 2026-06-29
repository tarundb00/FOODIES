import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { assets } from './../../assets/assets';
import { StoreContext } from './../../context/StoreContext';
import { calculateCartTotals } from '../../util/cartUtils';
import {RAZORPAY_KEY} from '../../util/contants'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import Razorpay from 'razorpay';


const PlaceOrder = () => {
   const {foodList,quantities,setQuantities,token} = useContext(StoreContext);
   const navigate  = useNavigate();

  const[data,setData] =useState({
    firstName:"",
    lastName:"",
    email:"",
    phoneNumber:"",
    address:"",
    state:"",
    city:"",
    zip:""

   });

   const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}));
   }

   const onSubmitHandler=async (event)=>{
    event.preventDefault();
    const orderData={
        userAddress:`${data.firstName} ${data.lastName},${data.address},${data.city},${data.state},${data.zip}`,
        phoneNumber:data.phoneNumber,
        email:data.email,
        orderedItems:cartItems.map(item => ({
          foodId: item.id,
          quantity: quantities[item.id],
          price: item.price * quantities[item.id],
          category: item.category,
          imageUrl: item.imageUrl,
          description: item.description,
          name: item.name
        })),
        amount: total.toFixed(2),
        orderStatus: "preparing"

    };

    try {
      const response= await axios.post('http://localhost:8080/api/orders/create',orderData,{headers:{'Authorization': `Bearer ${token}`}});
      if (response.status===201 && response.data.razorpayOrderId) {
        
        initiateRazorpayPayment(response.data);
      }else{
        toast.error("unable to place order . please try again.");
      }
    } catch (error) {
        toast.error("Unable to order .please try again");
    }
   };

   const initiateRazorpayPayment = async (order) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK is not loaded. Please refresh and try again.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount * 100, // convert to paisa
      currency: "INR",
      name: "Food LAND",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: function (razorpayResponse) {
        verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async function () {
          toast.error("Payment cancelled.");
          await deleteOrder(order.id);
        }
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

   const verifyPayment=async(rezorpayResponse)=>{
     const paymentData={
        razorpay_payment_id:razorpayResponse.razorpay_payment_id,
        razorpay_order_id:razorpayResponse.razorpay_order_id,
        razorpay_signature:razorpayResponse.razorpay_signature
     };
    try {
        const response= await axios.post('http://localhost:8080/api/orders/verify',paymentData,{headers:{'Authorization':`Bearer ${token}`}});
    if (response.status === 200) {
        toast.success("Payment successful.");
        await clearCart();
        navigate('/myorders');

    } else {
        toast.error("Payment failed. Please try again.");
        navigate('/');
    }
    } catch (error) {
        console.error('Payment verification failed:', error);
        toast.error("Payment failed. Please try again.");
    }
   }

   const deleteOrder = async (orderId) => {
   try {
    await axios.delete('http://localhost:8080/api/orders/'+orderId,{headers:{'Authorization':`Bearer ${token}`}});
        
    
   } catch (error) {
    toast.error('Unable to cancel order.contact support.');
   }

   }

   const clearCart = async () => {
    try {
       await axios.delete('http://localhost:8080/api/cart/clear', { headers: { 'Authorization': `Bearer ${token}` } });
    } catch (error) {
       console.error('Error while clearing the cart:', error);
    } finally {
       setQuantities({});
    }
   };
    const cartItems=foodList.filter(food=>quantities[food.id]>0);
    
    const{subtotal,shipping,tax,total} =calculateCartTotals(cartItems,quantities);
    return (
        <div className="container mt-4">
            <main>
                <div className="py-5 text-center">
                    <img src={assets.logo} alt="" className='d-block mx-auto' width={98} height={98} />
                    <h2>Continue the payment</h2>
                </div>

                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Your cart</span>
                            <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                        </h4>

                        <ul className="list-group mb-3">
                            {cartItems.map(item=>(
                             <li className="list-group-item d-flex justify-content-between lh-sm">
                            <div>
                                <h6 className="my-0">{item.name}</h6>
                                <small className="text-body-secondary">
                                    Qty:{quantities[item.id]}</small>
                            </div>
                            <span className="text-body-secondary">&#8377;{item.price*quantities[item.id]}</span>
                            </li>   
                            ))}
                            <li className="list-group-item d-flex justify-content-between">
                                <div>
                                    <span>Shipping</span>
                                </div>
                                <span className="text-body-secondary">&#8377;{subtotal===0 ? 0.0: shipping.toFixed(2)}</span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between">
                                <div>
                                    
                                    <span>Tax(10%)</span>
                                </div>
                                <span className="text-body-secondary">&#8377;{tax.toFixed(2)}</span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (INR)</span>
                                <strong>&#8377;{total.toFixed(2)}</strong>
                            </li>
                        </ul>

                    </div>

                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Billing address</h4>

                      
                        <form className="needs-validation" onSubmit={onSubmitHandler}>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="firstName" required name='firstName' onChange={onChangeHandler} value={data.firstName}/>
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="lastName" required value={data.lastName} name="lastName" onChange={onChangeHandler}/>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">@</span>
                                        <input type="email" className="form-control" id="email" placeholder='Email' required name='email' onChange={onChangeHandler} value={data.email}/>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="phone" className="form-label">Phone </label>
                                    <input type="number" className="form-control" placeholder='9809546352' id="phone" required value={data.phoneNumber} name='phoneNumber' onChange={onChangeHandler}/>
                                </div>                                

                                <div className="col-12">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" required value={data.address} name='address' onChange={onChangeHandler}/>
                                </div>

                                <div className="col-md-5">
                                    <label htmlFor="state" className="form-label">state</label>
                                    <select className="form-select" id="state" required name='state' value={data.state} onChange={onChangeHandler}>
                                        <option value="">Choose...</option>
                                        <option value="United States">Karnataka</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select className="form-select" id="city" required name='city' value={data.city} onChange={onChangeHandler} >
                                        <option value="">Choose...</option>
                                        <option value="California">Mysore</option>
                                        <option value="California">Banglore</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="zip" className="form-label">Pin code </label>
                                    <input type="number" className="form-control" id="zip" placeholder='570001' required name='zip' value={data.zip} onChange={onChangeHandler}/>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <button className="w-100 btn btn-primary btn-lg mb-4" type="submit" disabled={cartItems.length===0}>
                                Continue to checkout
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlaceOrder;