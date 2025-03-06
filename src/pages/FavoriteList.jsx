
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


// Initial furniture list
const initialWishListItems = [
  { id: 1, username: 'john_doe', item_id: 101 },
  { id: 2, username: 'jane_smith', item_id: 102 },
  { id: 3, username: 'alex_king', item_id: 103 },
  { id: 4, username: 'maria_jones', item_id: 104 }
];

const FavoriteList = () => {
  const [furniture, setFurniture] = useState(initialWishListItems);
  const [showModal, setShowModal] = useState(false);
  const [currentFurniture, setCurrentFurniture] = useState({
    id: null,
    name: '',
    category: '',
    price: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Create
  const handleCreate = () => {
    const newFurniture = {
      ...currentFurniture,
      id: furniture.length > 0 ? Math.max(...furniture.map(f => f.id)) + 1 : 1,
      price: parseFloat(currentFurniture.price)
    };
    setFurniture([...furniture, newFurniture]);
    handleClose();
  };

  // Update
  const handleUpdate = () => {
    setFurniture(furniture.map(f =>
      f.id === currentFurniture.id
        ? {...currentFurniture, price: parseFloat(currentFurniture.price)}
        : f
    ));
    handleClose();
  };

  // Delete
  const handleDelete = (id) => {
    setFurniture(furniture.filter(f => f.id !== id));
  };

  // Modal handling
  const handleClose = () => {
    setShowModal(false);
    setCurrentFurniture({ id: null, name: '', category: '', price: '' });
    setIsEditing(false);
  };

  const handleShow = (item = null) => {
    if (item) {
      setCurrentFurniture(item);
      setIsEditing(true);
    }
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Favorite Furniture</h1>
     
      <Button
        variant="primary"
        onClick={() => handleShow()}
        className="mb-3"
      >
        Add New Furniture
      </Button>

      <Row>
        {furniture.map(item => (
          <Col key={item.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Category: {item.category}<br />
                  Price: ${item.price ? item.price.toLocaleString() : 'N/A'}
                </Card.Text>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="warning"
                    onClick={() => handleShow(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Edit Furniture' : 'Add New Furniture'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentFurniture.name}
                onChange={(e) => setCurrentFurniture({
                  ...currentFurniture,
                  name: e.target.value
                })}
                placeholder="Enter furniture name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={currentFurniture.category}
                onChange={(e) => setCurrentFurniture({
                  ...currentFurniture,
                  category: e.target.value
                })}
                placeholder="Enter category"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={currentFurniture.price}
                onChange={(e) => setCurrentFurniture({
                  ...currentFurniture,
                  price: e.target.value
                })}
                placeholder="Enter price"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {isEditing ? (
            <Button variant="primary" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              Add
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FavoriteList;