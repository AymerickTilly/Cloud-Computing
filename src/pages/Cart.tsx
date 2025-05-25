import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Image, Button, Card } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import hoodieImage from '../assets/hoodies/hoodie_1.png';
import tshirtImage from '../assets/shirts/shirt_1.png';

interface CartItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  size: string[];
  unitPrice: number; // ✅ Add price here
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: 'Black Hoodie',
    image: hoodieImage,
    quantity: 1,
    size: ['S', 'M', 'L', 'XL'],
    unitPrice: 39.99,
  },
  {
    id: 2,
    name: 'Blue T-Shirt',
    image: tshirtImage,
    quantity: 2,
    size: ['S', 'M', 'L', 'XL'],
    unitPrice: 24.99,
  },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { loading } = useAuthStore();// user, email, groups,
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const allSelected = selectedItems.length === items.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getItemSubtotal = (item: CartItem) => {
    return item.quantity * item.unitPrice;
  };

  const getTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + getItemSubtotal(item), 0)
      .toFixed(2);
  };
  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="py-5" style={{ fontFamily: 'Times New Roman, sans-serif' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" size="sm" style={{ fontSize: '1.2rem' }} onClick={handleSelectAll}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </Col>
      </Row>
      {items.map((item) => (
        <Card className="mb-4 shadow-sm bg-light" key={item.id}>
          <Card.Body>
            <Row className="align-items-center text-center">
              <Col xs={1}>
                <Form.Check
                  type="checkbox"
                  style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </Col>
              <Col xs={2}>
                <Image src={item.image} alt={item.name} style={{ width: '100px', height: 'auto' }} fluid rounded />
              </Col>
              <Col xs={3}>
                <h5 className="mb-2">{item.name}</h5>
                <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
              </Col>
              <Col xs={1}>
                <Form.Group>
                  <Form.Label className="mb-1" style={{ fontSize: '1.2rem' }}>Qty</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    value={item.quantity}
                    size="sm"
                    className="w-100"
                    style={{ fontSize: '1rem' }}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Form.Group>
                  <Form.Label className="mb-1" style={{ fontSize: '1.2rem' }}>Size</Form.Label>
                  <Form.Select defaultValue="M" size="sm" className="w-100">
                    {['S', 'M', 'L'].map((size, idx) => (
                      <option key={idx} value={size}>{size}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={2}>
                <strong>Subtotal:</strong><br />
                ${getItemSubtotal(item).toFixed(2)}
              </Col>
              <Col xs={1}>
                <Button variant="outline-danger" size="sm" style={{ fontSize: '1.2rem' }}>
                  Remove
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Grand Total */}
      <Row className="mt-4 mb-3">
        <Col className="text-end">
          <h4>
            Total: <span className="text-success">${getTotal()}</span>
          </h4>
        </Col>
      </Row>

      {/* Checkout Button */}
      <Row>
        <Col className="text-end">
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate('/checkout')}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
