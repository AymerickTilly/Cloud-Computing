// Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Image, Button } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import hoodieImage from '../assets/catalog-item-1.jpg';
import tshirtImage from '../assets/catalog-item-2.jpg';

interface CartItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  variations: string[];
}

// Sample cart items (replace with API or context state in a real app)
const cartItems: CartItem[] = [
  {
    id: 1,
    name: 'Black Hoodie',
    image: hoodieImage,
    quantity: 1,
    variations: ['Small', 'Medium', 'Large'],
  },
  {
    id: 2,
    name: 'Blue T-Shirt',
    image: tshirtImage,
    quantity: 2,
    variations: ['S', 'M', 'L', 'XL'],
  },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user, email, groups, loading } = useAuthStore();
  console.log(user,email,groups)

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="py-5" style={{ fontFamily: 'Times New Roman, sans-serif' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>

      {cartItems.map((item) => (
        <Row key={item.id} className="align-items-center mb-4 border-bottom pb-3">
          <Col xs={1}>
            <Form.Check type="checkbox" />
          </Col>

          <Col xs={2}>
            <Image src={item.image} alt={item.name} fluid rounded />
          </Col>

          <Col xs={3}>
            <h5>{item.name}</h5>
          </Col>

          {/* Smaller Quantity Input */}
          <Col xs={1}>
            <Form.Control
              type="number"
              min={1}
              defaultValue={item.quantity}
              size="sm"
              className="w-75"
            />
          </Col>

          {/* Size Dropdown */}
          <Col xs={2}>
            <Form.Select defaultValue="M" size="sm" className="w-75">
              {['S', 'M', 'L'].map((size, idx) => (
                <option key={idx} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Variation Dropdown */}
          <Col xs={2}>
            <Form.Select defaultValue="Var A" size="sm">
              {['Var A', 'Var B'].map((variation, idx) => (
                <option key={idx} value={variation}>
                  {variation}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={1}>
            <Button variant="outline-danger" size="sm">
              Remove
            </Button>
          </Col>
        </Row>
      ))}

    <Row className="mt-4">
      <Col className="text-end">
        <Button variant="success" size="lg" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </Button>
      </Col>
    </Row>
    </Container>
  );
};

export default Cart;
