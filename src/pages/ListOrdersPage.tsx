// src/pages/ListOrdersPage.tsx

import { useEffect, useState } from 'react';
import { useLocation }                 from 'react-router-dom';
import { useAuthStore }                from '../auth/AuthStore';
import {
  Container,
  Card,
  Row,
  Col,
  Image,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { loadOrders }   from '../api/loadOrders';
import { loadOrderById }from '../api/loadOrder';    // renames order update API
import { updateProduct }from '../api/updateProduct';  // product stock update API
import { Order, Product } from '../interface/Order';
import { loadProductById } from '../api/loadProduct';
import { updateOrder } from '../api/update_order';

const ListOrdersPage = () => {
  const { user, groups } = useAuthStore();
  const isCustomer = groups.includes('Customer');
  const isAdmin    = groups.includes('Admin');

  const { state } = useLocation();
  const orderIdFromState = (state as { orderId?: string })?.orderId;

  const [monitoringOrders, setMonitoringOrders] = useState<Order[]>([]);
  const [userOrder, setUserOrder]               = useState<Order | null>(null);

  // UI / filter state
  const [searchTerm, setSearchTerm]     = useState('');
  const [beforeDate, setBeforeDate]     = useState('');
  const [afterDate, setAfterDate]       = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [statusUpdates, setStatusUpdates] = useState<Record<string, Order['status']>>({});
  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel]     = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Fetch orders
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (isAdmin) {
          setMonitoringOrders(await loadOrders());
          setUserOrder(null);
        } else if (isCustomer && orderIdFromState) {
          setUserOrder(await loadOrderById(orderIdFromState));
          setMonitoringOrders([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user, isAdmin, isCustomer, orderIdFromState]);

  const ordersToDisplay = isAdmin ? monitoringOrders : userOrder ? [userOrder] : [];

  // Filtering & totals
  const filtered = ordersToDisplay.filter(o => {
    const d = new Date(o.date);
    const after  = afterDate  ? new Date(afterDate)  : null;
    const before = beforeDate ? new Date(beforeDate) : null;
    const s = searchTerm.toLowerCase();

    return (
      (o.orderId.toLowerCase().includes(s) ||
       o.shippingAddress.toLowerCase().includes(s) ||
       o.username.toLowerCase().includes(s) ||
       o.products.some(p => p.name.toLowerCase().includes(s))) &&
      (!after  || d >= after) &&
      (!before || d <= before) &&
      (statusFilter === 'All' || o.status === statusFilter)
    );
  });

  const getItemTotal  = (p: Product) => (p.unitPrice * p.quantity).toFixed(2);
  const getGrandTotal = (items: Product[]) =>
    items.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0).toFixed(2);

  // Helper: stock array → map
  const stockArrayToMap = (stock: { size: string; stockAmount: number }[]) =>
    stock.reduce<Record<string, number>>((acc, item) => {
      acc[item.size] = item.stockAmount;
      return acc;
    }, {});

  // ————— Cancel Order —————
  const handleCancelClick = (id: string) => {
    setOrderToCancel(id);
    setShowCancelModal(true);
  };
  const confirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      // 1. Update order status
      const orderUpdateRes = await updateOrder({ orderId: orderToCancel, status: 'CANCELLED' });
      if (!orderUpdateRes) throw new Error('Order update failed');

      // 2. Find the cancelled order data
      const cancelledOrder = ordersToDisplay.find(o => o.orderId === orderToCancel)!;

      // 3. Restock each product
      await Promise.all(cancelledOrder.products.map(async prod => {
        const pd = await loadProductById(prod.id);
        const map = stockArrayToMap(pd.stock);
        const newStock = (map[prod.size] || 0) + prod.quantity;

        const updatedStockArray = pd.stock.map((item: { size: string; }) =>
          item.size === prod.size
            ? { ...item, stockAmount: newStock }
            : item
        );
        await updateProduct({ productId: prod.id, stock: updatedStockArray });
      }));

      // 4. Update UI
      if (isCustomer) setUserOrder(null);
      else setMonitoringOrders(prev =>
        prev.map(o => o.orderId === orderToCancel ? { ...o, status: 'CANCELLED' } : o)
      );

      alert(`Order ${orderToCancel} cancelled and stock restocked.`);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order.');
    } finally {
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  // ————— Update Order Status —————
  const handleUpdateClick = (id: string) => {
    setOrderToUpdate(id);
    setShowUpdateModal(true);
  };
  const confirmUpdate = async () => {
    if (!orderToUpdate) return;
    const newStatus = statusUpdates[orderToUpdate]!;
    try {
      const res = await updateOrder({ orderId: orderToUpdate, status: newStatus });
      if (!res) throw new Error('Order update failed');

      // If admin set to 'Cancelled', also restock
      if (newStatus === 'CANCELLED') {
        const updOrder = ordersToDisplay.find(o => o.orderId === orderToUpdate)!;
        await Promise.all(updOrder.products.map(async prod => {
          const pd = await loadProductById(prod.id);
          const map = stockArrayToMap(pd.stock);
          const newStock = (map[prod.size] || 0) + prod.quantity;
          const updatedStockArray = pd.stock.map((item: { size: string; }) =>
            item.size === prod.size
              ? { ...item, stockAmount: newStock }
              : item
          );
          await updateProduct({ productId: prod.id, stock: updatedStockArray });
        }));
      }

      // Refresh UI
      setMonitoringOrders(prev =>
        prev.map(o => o.orderId === orderToUpdate ? { ...o, status: newStatus } : o)
      );

      alert(`Order ${orderToUpdate} updated to ${newStatus}.`);
    } catch (err) {
      console.error(err);
      alert('Failed to update order status.');
    } finally {
      setShowUpdateModal(false);
      setOrderToUpdate(null);
    }
  };

  // ————— Render —————
  if (loading) return <Container className="text-center py-5"><Spinner /></Container>;
  if (error)   return <Container className="text-center py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      <h2 className="mb-4 text-center">{isAdmin ? 'User Orders' : 'Your Orders'}</h2>

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
            <Form.Control type="date" value={afterDate}  onChange={e => setAfterDate(e.target.value)}  title="After" />
          </Col>
          <Col xs="auto">
            <Form.Control type="date" value={beforeDate} onChange={e => setBeforeDate(e.target.value)} title="Before" />
          </Col>
          <Col xs="auto">
            <Form.Select
              value={statusFilter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {filtered.length === 0 && <p>No orders found.</p>}

      {filtered.map(o => (
        <Card className="mb-4 shadow-sm" key={o.orderId}>
          <Card.Header className="bg-light">
            <div className="d-flex justify-content-between flex-wrap">
              <span><strong>ID:</strong> {o.orderId}</span>
              <span><strong>Date:</strong> {new Date(o.date).toLocaleDateString()}</span>
              <span><strong>Status:</strong> <strong>{o.status}</strong></span>
            </div>
          </Card.Header>
          <Card.Body>
            <p><strong>User:</strong> {o.username}</p>
            <p><strong>Address:</strong> {o.shippingAddress}</p>

            <h5>Items:</h5>
            {o.products.map(p => (
              <Row className="align-items-center mb-3" key={p.id}>
                <Col xs={3}><Image src={p.image} fluid rounded /></Col>
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
              Grand Total: <strong>${getGrandTotal(o.products)}</strong>
            </h5>

            <div className="d-flex justify-content-end gap-2">
              {isCustomer && o.status === 'PENDING' && (
                <Button variant="danger" onClick={() => handleCancelClick(o.orderId)}>
                  Cancel
                </Button>
              )}
              {isAdmin && (
                <>
                  <Form.Select
                    style={{ width: 160 }}
                    value={statusUpdates[o.orderId] || o.status}
                    onChange={e =>
                      setStatusUpdates(prev => ({
                        ...prev,
                        [o.orderId]: e.target.value as Order['status'],
                      }))
                    }
                  >
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Form.Select>
                  <Button variant="primary" onClick={() => handleUpdateClick(o.orderId)}>
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
        <Modal.Header closeButton><Modal.Title>Cancel Order</Modal.Title></Modal.Header>
        <Modal.Body>Cancel order {orderToCancel}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No</Button>
          <Button variant="danger"    onClick={confirmCancel}>Yes</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Update Status</Modal.Title></Modal.Header>
        <Modal.Body>
          Update order {orderToUpdate} to <strong>{statusUpdates[orderToUpdate || '']}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>No</Button>
          <Button variant="primary"    onClick={confirmUpdate} disabled={!orderToUpdate}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListOrdersPage;
