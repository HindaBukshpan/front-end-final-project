import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { fetchOrderItems, checkOpenOrder } from '../services/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const OrdersApp = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    order_id: '',
    item_id: '',
    quantity: '',
    total_price_per_item: '',
  });

  useEffect(() => {
    fetchOrderItems()
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  const handlePlaceOrder = async (item) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const newOrder = {
      ...formData,
      item_id: item.id,
      order_id: Math.random().toString(36).substring(7),
      quantity: item.quantity,
      total_price_per_item: item.price * item.quantity,
    };

    setFormData(newOrder);

    try {
      const response = await checkOpenOrder(newOrder);
      console.log('Order response:', response.data);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Your Orders</h1>
      <div className="row">
        {orders.map((order) => (
          <div key={order.order_id} className="col-md-3 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order.order_id}</h5>
                <p className="card-text">
                  Item: {order.item_name} | Quantity: {order.quantity} | Total Price: ${order.total_price_per_item}
                </p>
                <button className="btn btn-success" onClick={() => handlePlaceOrder(order)}>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersApp;
