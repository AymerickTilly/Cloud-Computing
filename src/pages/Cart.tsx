import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Image, Button, Card } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import { loadCartsByID } from '../api/loadCarts';
import { Cart } from '../types/Cart';
import { deleteCart } from '../api/deleteCart';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // use cartId for unique IDs

  useEffect(() => {
    if (!user?.username) return;

    loadCartsByID(user.username)
      .then(setCarts)
      .catch((err) => console.error("Failed to load cart:", err));
  }, [user]);

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === carts.length ? [] : carts.map(c => c.cartId));
  };

  const toggleSelection = (cartId: string) => {
    setSelectedIds(prev =>
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    );
  };

  const handleQuantityChange = (cartId: string, quantity: number) => {
    setCarts(prev =>
      prev.map(c => c.cartId === cartId ? { ...c, quantity } : c)
    );
  };

  const handleDelete = async (cart: Cart) => {
    const success = await deleteCart(cart);
    if (success) {
      setCarts(prev => prev.filter(c => c.cartId !== cart.cartId));
      setSelectedIds(prev => prev.filter(id => id !== cart.cartId));
    } else {
      alert("Failed to delete item.");
    }
  };

  const getSubtotal = (item: Cart) => item.price * item.quantity;
  const getTotal = () =>
    carts
      .filter(c => selectedIds.includes(c.cartId))
      .reduce((sum, c) => sum + getSubtotal(c), 0)
      .toFixed(2);

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="py-5" style={{ fontFamily: 'Times New Roman, sans-serif' }}>
      <h2 className="mb-4 text-center">Your Cart</h2>

      {carts.length === 0 ? (
        <p className="text-center fs-5 text-muted">Your cart is empty</p>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <Button variant="primary" size="sm" onClick={toggleAll}>
                {selectedIds.length === carts.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Col>
          </Row>

          {carts.map(item => (
            <Card className="mb-4 shadow-sm bg-light" key={item.cartId}>
              <Card.Body>
                <Row className="align-items-center text-center">
                  <Col xs={1}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIds.includes(item.cartId)}
                      onChange={() => toggleSelection(item.cartId)}
                    />
                  </Col>
                  <Col xs={2}>
                    <Image src={item.imageUrl} alt={item.name} style={{ width: '100px' }} fluid rounded />
                  </Col>
                  <Col xs={3}>
                    <h5>{item.name}</h5>
                    <p>Unit Price: ${item.price.toFixed(2)}</p>
                  </Col>
                  <Col xs={1}>
                    <Form.Group>
                      <Form.Label>Qty</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.cartId, parseInt(e.target.value) || 1)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <Form.Group>
                      <Form.Label>Size</Form.Label>
                      <Form.Select defaultValue={item.size}>
                        <option>{item.size}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={2}>
                    <strong>Subtotal:</strong><br />
                    ${getSubtotal(item).toFixed(2)}
                  </Col>
                  <Col xs={1}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item)}
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
                onClick={() =>
                navigate('/checkout', {
                state: {
                  selectedItems: carts
                  .filter((item) => selectedIds.includes(item.cartId))
                  .map((item) => ({
                  cartId: item.cartId,
                  id: item.cartId,  // keep string ID
                  name: item.name,
                  image: item.imageUrl,
                  quantity: item.quantity,
                  size: [item.size],
                  unitPrice: item.price,
                })),
                },
                })
                }
                disabled={selectedIds.length === 0}
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

export default CartPage;
