import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Modal, Container, Form, Row, Col, Image, Button } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import { loadUserById } from '../api/loadUser';
import { User } from '../types/User';


interface ProductItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  size: string[];
  unitPrice: number;
}

interface CheckoutLocationState {
  selectedItems: ProductItem[];
}

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: CheckoutLocationState | undefined };
  const [address, setAddress] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Get user from auth store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useAuthStore((state: { user: any; }) => state.user);

  useEffect(() => {
    if (!state || !Array.isArray(state.selectedItems)) {
      navigate('/cart');
      return;
    }

    const sanitized = state.selectedItems.filter(
      (item): item is ProductItem =>
        typeof item.unitPrice === 'number' &&
        typeof item.quantity === 'number' &&
        typeof item.name === 'string'
    );

    setProducts(sanitized);
  }, [state, navigate]);

  useEffect(() => {
    async function fetchUser() {
      if (user?.username) {
        try {
          const loadedUser = (await loadUserById(user.username)) as User | null;
          if (loadedUser?.address) {
            setAddress(loadedUser.address);
          }
        } catch (err) {
          console.error('Failed to load user data:', err);
        }
      }
    }
    fetchUser();
  }, [user]);

  const getItemTotal = (product: ProductItem) => {
    if (typeof product.unitPrice !== 'number' || typeof product.quantity !== 'number') return '0.00';
    return (product.unitPrice * product.quantity).toFixed(2);
  };

  const getGrandTotal = () => {
    return products
      .reduce((sum, product) => {
        if (typeof product.unitPrice !== 'number' || typeof product.quantity !== 'number') return sum;
        return sum + product.unitPrice * product.quantity;
      }, 0)
      .toFixed(2);
  };

  const confirmPayment = () => {
    alert(`Proceeding to payment\nAddress: ${address}\nBank: ${selectedBank}\nTotal: $${getGrandTotal()}`);
    setShowConfirmModal(false);
  };

  const handlePayment = () => {
    setShowConfirmModal(true);
  };

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      <div className="mb-3">
        <Button variant="primary" onClick={() => navigate('/cart')}>
          ← Back to Cart
        </Button>
      </div>
      <h2 className="mb-4 text-center">Checkout</h2>
      <Form.Group className="mb-4" controlId="checkoutAddress">
        <h4 className="mb-3">Shipping Address</h4>
        <div className="form-control" style={{ minHeight: '3rem' }}>
          {address || 'No address provided'}
        </div>
      </Form.Group>

      <h4 className="mb-3">Your Items</h4>
      {products.map((product) => (
        <Row className="align-items-center mb-4 border p-2 rounded" key={product.id}>
          <Col xs={3}>
            <Image src={product.image} alt={product.name} fluid rounded />
          </Col>
          <Col xs={9}>
            <div><strong>{product.name}</strong></div>
            <div>Size: {product.size?.[0] ?? 'N/A'}</div>
            <div>
              Unit Price: ${typeof product.unitPrice === 'number' ? product.unitPrice.toFixed(2) : 'N/A'}
            </div>
            <div>Quantity: {product.quantity}</div>
            <div>
              <strong>
                Total: ${typeof product.unitPrice === 'number' ? getItemTotal(product) : 'N/A'}
              </strong>
            </div>
          </Col>
        </Row>
      ))}

      <h5 className="mt-3">
        Grand Total: <span className="text-success">${getGrandTotal()}</span>
      </h5>

      <Form.Group className="mt-4 mb-3">
        <Form.Label>Select Bank</Form.Label>
        <Form.Select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
          <option value="">-- Select a Bank --</option>
          <option value="Bank A">Bank A</option>
          <option value="Bank B">Bank B</option>
          <option value="Bank C">Bank C</option>
        </Form.Select>
      </Form.Group>

      <div className="d-grid gap-2 mt-4 mb-5">
        <Button
          variant="success"
          size="lg"
          onClick={handlePayment}
          disabled={!address || !selectedBank}
        >
          Proceed to Payment
        </Button>
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to proceed with the payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmPayment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;
