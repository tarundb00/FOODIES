import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {assets} from '../../assets/assets';


const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrdersFromResponse = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.orders)) return payload.orders;
    return [];
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/orders/all');
      setData(getOrdersFromResponse(response.data));
    } catch (fetchError) {
      console.error('Fetch orders failed', fetchError);
      setError('Unable to load orders.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (event, orderId) => {
    if (!orderId) {
      return;
    }

    try {
      const status = event.target.value;
      const response = await axios.patch(
        `http://localhost:8080/api/orders/status/${orderId}?status=${encodeURIComponent(status)}`
      );
      if (response.status === 200) {
        await fetchOrders();
      }
    } catch (updateError) {
      console.error('Order status update failed', updateError);
      setError('Unable to update order status.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='container'>
      <div className='py-5 row justify-content-center'>
        <div className='col-11 card'>
          <div className='card-body'>
            {loading && <p>Loading orders...</p>}
            {error && <p className='text-danger'>{error}</p>}
            {!loading && !error && data.length === 0 && <p>No orders found.</p>}
            {!loading && !error && data.length > 0 && (
              <table className='table table-responsive'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((order, index) => {
                    const orderId = order.id || order._id || index;
                    const orderedItems = Array.isArray(order.orderedItems)
                      ? order.orderedItems
                      : Array.isArray(order.items)
                      ? order.items
                      : Array.isArray(order.orderItems)
                      ? order.orderItems
                      : [];
                    const firstItem = orderedItems[0] || {};
                    const itemImage =
                      firstItem.imageUrl || firstItem.image || firstItem.img || firstItem.imagePath || assets.logo;
                    const itemLabel = orderedItems
                      .map(
                        (item) =>
                          `${item.name || item.title || item.productName || 'Item'} x ${
                            item.quantity ?? item.qty ?? 0
                          }`
                      )
                      .join(', ');
                    const totalQuantity = orderedItems.reduce(
                      (sum, item) => sum + Number(item.quantity ?? item.qty ?? 0),
                      0
                    );
                    const amount = Number(order.amount) || 0;
                    const statusValue = order.orderStatus || order.status || 'Food preparing';
                    const address = order.userAddress || order.address || 'No Address Provided';

                    return (
                      <tr key={orderId}>
                        <td>
                          <img src={itemImage} alt='Ordered food' height={48} width={48} />
                        </td>
                        <td>
                          {itemLabel || 'No items available'}
                          <div>{address}</div>
                        </td>
                        <td>&#8377;{amount.toFixed(2)}</td>
                        <td>{totalQuantity}</td>
                        <td>
                          <select
                            className='form-control'
                            onChange={(e) => updateStatus(e, orderId)}
                            value={statusValue}
                          >
                            <option value='Food preparing'>Food preparing</option>
                            <option value='Out for delivery'>Out for delivery</option>
                            <option value='Delivered'>Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
