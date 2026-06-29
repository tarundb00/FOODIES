import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './MyOrders.css';


const MyOrders = () => {
    const {token} = useContext(StoreContext);
    const [data,setData]=useState([]);

    const fetchOrders=async()=>{
        try {
            const response = await axios.get("http://localhost:8080/api/orders",{headers:{"Authorization":`Bearer ${token}`}});
            const orderData = response.data;
            setData(Array.isArray(orderData) ? orderData : orderData.orders ?? []);
        } catch (error) {
            console.error('Failed to load orders:', error);
            setData([]);
        }
    };

    useEffect(()=>{
        if(token){
            fetchOrders();
        }
    },[token]);

    const orders = Array.isArray(data) ? data : [];

  return (
    <div className='container'>
        <div className="py-5 row justify-content-center">
            <div className="col-11 card">
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Count</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order,index)=>{
                                    const orderedItems = Array.isArray(order.orderItems)
                                        ? order.orderItems
                                        : Array.isArray(order.orderedItems)
                                            ? order.orderedItems
                                            : Array.isArray(order.items)
                                                ? order.items
                                                : [];

                                    const itemText = orderedItems
                                        .map((item) => {
                                            const name = item?.name || item?.title || 'Item';
                                            const quantity = Number(item?.quantity) || 0;
                                            return quantity > 0 ? `${name} x ${quantity}` : '';
                                        })
                                        .filter(Boolean)
                                        .join(', ');

                                    const totalQuantity = orderedItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
                                    const amountValue = Number(order.amount) || 0;
                                    const firstItemImage = orderedItems.length > 0 ? orderedItems[0]?.imageUrl : null;

                                    return(
                                        <tr key={order.id ?? index}>
                                            <td>
                                                <img src={firstItemImage || assets.logo} alt="Order" height={48} width={48}/>
                                            </td>
                                            <td>{itemText || 'No items available'}</td>
                                            <td>&#8377;{amountValue.toFixed(2)}</td>
                                            <td>{totalQuantity}</td>
                                            <td className='fw-bold text-capitalize'>&#x25cf; {order.orderStatus || 'unknown'}</td>
                                            <td>
                                                <button className='btn btn-sm btn-warning' onClick={() => fetchOrders()}>
                                                    <i className="bi bi-arrow-clockwise"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default MyOrders;
