// src/pages/ListOrdersPage.tsx

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth/AuthStore';
import { Container, Card, Row, Col, Image, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { loadOrders } from '../api/loadOrders';
import { loadOrderById } from '../api/loadOrder';
import { Order, Product } from '../interface/Order';

const ListOrdersPage = () => {
  const { user, groups } = useAuthStore();
  const isCustomer = groups.includes('Customer');
  const isAdmin     = groups.includes('Admin');

  // Grab orderId passed from Checkout via navigation state
  const location = useLocation();
  const orderIdFromState = (location.state as { orderId?: string })?.orderId;

  // State for fetched orders
  const [monitoringOrders, setMonitoringOrders] = useState<Order[]>([]);
  const [userOrder, setUserOrder]               = useState<Order | null>(null);

  // UI / filter state
  const [searchTerm, setSearchTerm]             = useState('');
  const [beforeDate, setBeforeDate]             = useState('');
  const [afterDate, setAfterDate]               = useState('');
  const [statusFilter, setStatusFilter]         = useState<'All' | Order['status']>('All');
  const [statusUpdates, setStatusUpdates]       = useState<Record<string, Order['status']>>({});
  const [orderToUpdate, setOrderToUpdate]       = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal]   = useState(false);
  const [showCancelModal, setShowCancelModal]   = useState(false);
  const [orderToCancel, setOrderToCancel]       = useState<string | null>(null);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Fetch either all orders (admin) or single user order (customer)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (isAdmin) {
          const all = await loadOrders();
          setMonitoringOrders(all);
          setUserOrder(null);
        } else if (isCustomer && orderIdFromState) {
          const o = await loadOrderById(orderIdFromState);
          setUserOrder(o);
          setMonitoringOrders([]);
        } else {
          setMonitoringOrders([]);
          setUserOrder(null);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, isCustomer, orderIdFromState]);

  // Choose which list to display
  const ordersToDisplay = isAdmin ? monitoringOrders : userOrder ? [userOrder] : [];

  // Filter logic
  const filtered = ordersToDisplay.filter(o => {
    const d = new Date(o.date);
    const after  = afterDate  ? new Date(afterDate)  : null;
    const before = beforeDate ? new Date(beforeDate) : null;
    const s = searchTerm.toLowerCase();

    const matchesSearch =
      o.orderId.toLowerCase().includes(s) ||
      o.shippingAddress.toLowerCase().includes(s) ||
      o.userId.toLowerCase().includes(s) ||
      o.products.some((p: { name: string; }) => p.name.toLowerCase().includes(s));

    const matchesDateAfter  = !after  || d >= after;
    const matchesDateBefore = !before || d <= before;
    const matchesStatus     = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesDateAfter && matchesDateBefore && matchesStatus;
  });

  // Helpers
  const getItemTotal = (p: Product) => (p.unitPrice * p.quantity).toFixed(2);
  const getGrandTotal = (items: Product[]) =>
    items.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0).toFixed(2);

  // Cancel handlers
  const handleCancelClick = (id: string) => {
    setOrderToCancel(id);
    setShowCancelModal(true);
  };
  const confirmCancel = () => {
    alert(`Order ${orderToCancel} cancelled.`);
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  // Update handlers
  const handleUpdateClick = (id: string) => {
    setOrderToUpdate(id);
    setShowUpdateModal(true);
  };
  const confirmUpdate = () => {
    const newStatus = statusUpdates[orderToUpdate!]!;
    alert(`Order ${orderToUpdate} updated to ${newStatus}`);
    setShowUpdateModal(false);
    setOrderToUpdate(null);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      {isAdmin ? (
        <>
          <h2 className="mb-4 text-center">User Orders</h2>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-center">Your Orders</h2>
        </>
      )}

      <Form className="mb-4">
        <Row className="g-2">
          <Col md>
            <Form.Control
              placeholder="Search by ID, Address, Product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              type="date"
              value={afterDate}
              onChange={e => setAfterDate(e.target.value)}
              title="After"
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              type="date"
              value={beforeDate}
              onChange={e => setBeforeDate(e.target.value)}
              title="Before"
            />
          </Col>
          <Col xs="auto">
            <Form.Select
              value={statusFilter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {filtered.length === 0 && <p>No orders found.</p>}

      {filtered.map(order => (
        <Card className="mb-4 shadow-sm" key={order.orderId}>
          <Card.Header className="bg-light">
            <div className="d-flex justify-content-between flex-wrap">
              <span><strong>ID:</strong> {order.orderId}</span>
              <span><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</span>
              <span>
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {order.status}
                </span>
              </span>
            </div>
          </Card.Header>
          <Card.Body>
            <p><strong>User:</strong> {order.username}</p>
            <p><strong>Address:</strong> {order.shippingAddress}</p>

            <h5>Items:</h5>
            {order.products.map((p: Product) => (
              <Row className="align-items-center mb-3" key={p.id}>
                <Col xs={3}>
                  <Image src={p.image} fluid rounded />
                </Col>
                <Col xs={9}>
                  <div><strong>{p.name}</strong></div>
                  <div>Size: {p.size}</div>
                  <div>Qty: {p.quantity}</div>
                  <div>Unit: ${p.unitPrice.toFixed(2)}</div>
                  <div>Total: ${getItemTotal(p)}</div>
                </Col>
              </Row>
            ))}

            <h5 className="text-end">
              Grand Total: <strong>${getGrandTotal(order.products)}</strong>
            </h5>

            <div className="d-flex justify-content-end gap-2">
              {isCustomer && order.status === 'PENDING' && (
                <Button variant="danger" onClick={() => handleCancelClick(order.orderId)}>
                  Cancel
                </Button>
              )}
              {isAdmin && (
                <>
                  <Form.Select
                    style={{ width: 160 }}
                    value={statusUpdates[order.orderId] || order.status}
                    onChange={e =>
                      setStatusUpdates(prev => ({
                        ...prev,
                        [order.orderId]: e.target.value as Order['status']
                      }))
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                  <Button variant="primary" onClick={() => handleUpdateClick(order.orderId)}>
                    Update
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Cancel Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel order {orderToCancel}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm update of order {orderToUpdate} to{' '}
          <strong>{statusUpdates[orderToUpdate || '']}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={confirmUpdate} disabled={!orderToUpdate}>
            Yes, Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListOrdersPage;
