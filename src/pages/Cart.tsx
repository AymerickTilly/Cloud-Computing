import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Image, Button, Card } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import { loadCartsByID } from '../api/loadCarts';
import { Cart } from '../types/Cart';
import { deleteCart } from '../api/deleteCart';
import { loadProducts } from "../api/loadProducts";
import { Product } from "../types/Product";

<<<<<<< HEAD
const CartPage: React.FC = () => {
=======
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

type StockItem = {
  size: string;
  stockAmount: number;
};
const Cart: React.FC = () => {
>>>>>>> dd05d287ccf2f7e282fe1f187781b18e834ac7c9
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const { user, loading } = useAuthStore();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // use cartId for unique IDs

  useEffect(() => {
    if (!user?.username) return;

    loadCartsByID(user.username)
      .then(setCarts)
      .catch((err) => console.error("Failed to load cart:", err));
  }, [user]);
  
  useEffect(() => {
      loadProducts()
        .then(setProducts)
        .catch(console.error);
    }, []);

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
  const handleCheckout = () => {
    const issues: string[] = [];

<<<<<<< HEAD
  const handleDelete = async (cart: Cart) => {
    const success = await deleteCart(cart);
=======
    items
      .filter(item => selectedItems.includes(item.id))
      .forEach(item => {
        const product = products.find((p: Product) => p.name === item.name);
        if (!product) return;

        const stockEntry = product?.stock.find((s: StockItem) => s.size === item.size[0]);
        const availableStock = stockEntry?.stockAmount ?? 0;

        if (item.quantity > availableStock) {
          issues.push(
            `Only ${availableStock} left for "${item.name}" size "${item.size[0]}".`
          );
        }
      });

    if (issues.length > 0) {
      alert(issues.join('\n'));
      return;
    }

    navigate('/checkout');
  };
  const handleDeleteItemFromCart = async (userId: string, cartId: string, id: number) => {
    const success = await deleteCart({ userId, cartId } as BackendCart);
>>>>>>> dd05d287ccf2f7e282fe1f187781b18e834ac7c9
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
<<<<<<< HEAD
                onClick={() =>
                navigate('/checkout', {
                state: {
                  selectedItems: carts
                  .filter((item) => selectedIds.includes(item.cartId))
                  .map((item) => ({
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
=======
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
>>>>>>> dd05d287ccf2f7e282fe1f187781b18e834ac7c9
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
