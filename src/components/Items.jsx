import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { fetchItems, createOrder, checkOpenOrder } from '../services/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button, Form } from 'react-bootstrap';

const FurnitureCrudApp = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [furniture, setFurniture] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', stock: '', image: '' });
  const [formData, setFormData] = useState({
      order_id: '',
      item_id: '',
      quantity: '',
      ttotal_price_per_item: '',
    });
    const [formWish, setFormWish] = useState({
        username: '',
        item_id: '',
      });

  useEffect(() => {
    fetchItems()
      .then((response) => {
        setFurniture(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;

    setFurniture(prevFurniture =>
      prevFurniture.map(f =>
        f.id === itemId
          ? { ...f, quantity: Math.min(newQuantity, f.stock) } 
          : f
      )
    );
  };

  const handleCart = async (item) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  
    if (item.cart) return;
  
    if (item.stock < item.quantity) {
      alert("Not enough stock available.");
      return;
    }

    setFurniture(prevFurniture =>
      prevFurniture.map(f =>
        f.id === item.id ? { ...f, cart: true, stock: f.stock - item.quantity } : f
      )
    );
  
    try {
      const orderData = {
        order_id: item.orderId,
        item_id: item.id,
        quantity: item.quantity,
        ttotal_price_per_item: item.price * item.quantity,
      };
  
      const response = await checkOpenOrder(orderData);
      console.log("Server response:", response.data);
  
    
  
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };
  

  
  const handleLike = (item) => {

    if (!currentUser) {
      return;
    }
  
    if (item.liked) return;
  
    setFurniture(prevFurniture =>
      prevFurniture.map(f =>
        f.id === item.id ? { ...f, liked: true } : f
      )
    );
  
    setFormWish({
      username: currentUser.username, 
      item_id: item.id,
    });
  
    console.log("FormWish:", formWish);
    
  };

  const handleAddItem = () => {
    setFurniture([...furniture, { ...newItem, id: furniture.length + 1, liked: false, cart: false, quantity: 1 }]);
    setShowModal(false);
    setNewItem({ name: '', description: '', price: '', stock: '', image: '' });
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Favorite Furniture</h1>
      {currentUser?.role === 'ADMIN' && (
        <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
          Add Item
        </button>
      )}

      <div className="row">
        {furniture.map(item => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Price: ${item.price.toLocaleString()} | Stock: {item.stock}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button className={`btn ${item.liked ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => handleLike(item)}>
                    <i className={`bi ${item.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-outline-secondary me-2" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                      disabled={item.quantity <= 1 || item.cart} 
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)} 
                      className="form-control text-center" 
                      style={{ width: "60px" }} 
                      disabled={item.cart} 
                    />
                    <button 
                      className="btn btn-outline-secondary ms-2" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                      disabled={item.quantity >= item.stock || item.cart} 
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <button 
                    className={`btn ${item.cart ? 'btn-danger' : 'btn-outline-danger'}`} 
                    onClick={() => handleCart(item)} 
                    disabled={item.cart}
                  >
                    <i className={`bi ${item.cart ? 'bi-cart-fill' : 'bi-cart'}`}></i>
                  </button>
                </div>
                {currentUser?.role === 'ADMIN' && (
                  <div className="mt-3">
                    <button className="btn btn-warning me-2" onClick={() => handleEditItem(item)}>Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding item */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddItem}>Add Item</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FurnitureCrudApp;
