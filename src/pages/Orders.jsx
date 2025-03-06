import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialOrders = [
  {
    orderNumber: 'ORD-001',
    orderDate: '2024-03-05',
    status: 'open',
    totalSum: 450.00,
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      zipCode: '12345'
    },
    items: [
      { name: 'Wooden Chair', amount: 2, price: 150.00 },
      { name: 'Coffee Table', amount: 1, price: 150.00 }
    ]
  },
  {
    orderNumber: 'ORD-002',
    orderDate: '2024-02-20',
    status: 'closed',
    totalSum: 750.00,
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Somewhere',
      state: 'ST',
      zipCode: '67890'
    },
    items: [
      { name: 'Leather Sofa', amount: 1, price: 600.00 },
      { name: 'Side Table', amount: 1, price: 150.00 }
    ]
  }
];

const statusColors = {
  open: 'success',
  closed: 'secondary'
};

const OrdersList = ({ onSelectOrder }) => {

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error); 
      }
    }; 

    getUserOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      <div className="list-group">
        {orders.map(order => (
          <div
            key={order.orderNumber}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => onSelectOrder(order)}
          >
            <div>
              <h5 className="mb-1">Order #{order.orderNumber}</h5>
              <p className="mb-1">{order.orderDate}</p>
              <small>Total: ${order.totalSum.toFixed(2)}</small>
            </div>
            <span className={`badge bg-${statusColors[order.status]} rounded-pill`}>
              {order.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails = ({ order, onUpdateOrder, onCloseOrder }) => {
  const [editableAddress, setEditableAddress] = useState({ ...order.shippingAddress });
  const [editableItems, setEditableItems] = useState([...order.items]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditableAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...editableItems];
    newItems.splice(index, 1);
    setEditableItems(newItems);
  };

  const handleSaveChanges = () => {
    const updatedOrder = {
      ...order,
      shippingAddress: editableAddress,
      items: editableItems,
      totalSum: editableItems.reduce((sum, item) => sum + (item.amount * item.price), 0)
    };
    onUpdateOrder(updatedOrder);
  };

  if (order.status === 'closed') {
    return (
      <div className="container mt-4">
        <h2>Order Details (Closed)</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Order #{order.orderNumber}</h5>
            <p>Date: {order.orderDate}</p>
            <p>Total: ${order.totalSum.toFixed(2)}</p>
           
            <h6>Shipping Address</h6>
            <p>
              {order.shippingAddress.street},
              {order.shippingAddress.city},
              {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>

            <h6>Items</h6>
            <ul className="list-group">
              {order.items.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  {item.name}
                  <span>
                    {item.amount} x ${item.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Order Details (Open)</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Order #{order.orderNumber}</h5>
          <p>Date: {order.orderDate}</p>
         
          <h6>Shipping Address</h6>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                name="street"
                className="form-control"
                value={editableAddress.street}
                onChange={handleAddressChange}
                placeholder="Street Address"
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                name="city"
                className="form-control"
                value={editableAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                name="state"
                className="form-control"
                value={editableAddress.state}
                onChange={handleAddressChange}
                placeholder="State"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                name="zipCode"
                className="form-control"
                value={editableAddress.zipCode}
                onChange={handleAddressChange}
                placeholder="Zip Code"
              />
            </div>
          </div>

          <h6>Items</h6>
          <ul className="list-group mb-3">
            {editableItems.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name}
                <div>
                  <span className="me-3">
                    {item.amount} x ${item.price.toFixed(2)}
                  </span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between">
            <div>
              <strong>Total: ${editableItems.reduce((sum, item) => sum + (item.amount * item.price), 0).toFixed(2)}</strong>
            </div>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="btn btn-success"
                onClick={() => onCloseOrder(order.orderNumber)}
              >
                Close Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersApp = () => {
  const [orders, setOrders] = useState([]); 
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderNumber === updatedOrder.orderNumber ? updatedOrder : order
      )
    );
  };

  const handleCloseOrder = (orderNumber) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderNumber === orderNumber
          ? { ...order, status: 'closed' }
          : order
      )
    );
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders'); 
        setOrders(response.data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders(); 
  }, []); 


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <OrdersList
            orders={orders}
            onSelectOrder={setSelectedOrder}
          />
        </div>
        <div className="col-md-8">
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onUpdateOrder={handleUpdateOrder}
              onCloseOrder={handleCloseOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersApp;