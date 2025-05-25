import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Image, Button, Card } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import { loadCartsByID } from '../api/loadCarts';
import { Cart as BackendCart } from '../types/Cart';
import { deleteCart } from '../api/deleteCart';

interface CartItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  size: string[];
  unitPrice: number;
  userId: string;
  cartId: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user?.username) return;

    loadCartsByID(user.username)
      .then((data: BackendCart[]) => {
        const transformed: CartItem[] = data.map((item, index) => ({
          id: index + 1,
          name: item.name,
          image: item.imageUrl,
          quantity: item.quantity,
          size: [item.size],
          unitPrice: item.price,
          userId: item.userId,
          cartId: item.cartId,
        }));
        setItems(transformed);
      })
      .catch(err => console.error("Failed to load cart:", err));
  }, [user]);

  const allSelected = selectedItems.length === items.length;

  const handleSelectAll = () => {
    setSelectedItems(allSelected ? [] : items.map((item) => item.id));
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleDeleteItemFromCart = async (userId: string, cartId: string, id: number) => {
    const success = await deleteCart({ userId, cartId } as BackendCart);
    if (success) {
      setItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      alert("Failed to delete item from cart.");
    }
  };

  const getItemSubtotal = (item: CartItem) => item.quantity * item.unitPrice;
  const getTotal = () =>
    items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + getItemSubtotal(item), 0)
      .toFixed(2);

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="py-5" style={{ fontFamily: 'Times New Roman, sans-serif' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>

      {items.length === 0 ? (
        <p className="text-center fs-5 text-muted">Your cart is empty, come on man buy something 🤬</p>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <Button variant="primary" size="sm" onClick={handleSelectAll}>
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
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </Col>
                  <Col xs={2}>
                    <Image src={item.image} alt={item.name} style={{ width: '100px' }} fluid rounded />
                  </Col>
                  <Col xs={3}>
                    <h5>{item.name}</h5>
                    <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
                  </Col>
                  <Col xs={1}>
                    <Form.Group>
                      <Form.Label>Qty</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group>
                      <Form.Label>Size</Form.Label>
                      <Form.Select defaultValue={item.size[0]}>
                        {item.size.map((s, idx) => (
                          <option key={idx}>{s}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <strong>Subtotal:</strong><br />
                    ${getItemSubtotal(item).toFixed(2)}
                  </Col>
                  <Col xs={1}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteItemFromCart(item.userId, item.cartId, item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Row className="mt-4">
            <Col className="text-end">
              <h4>Total: <span className="text-success">${getTotal()}</span></h4>
            </Col>
          </Row>
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
        </>
      )}
    </Container>
  );
};

export default Cart;