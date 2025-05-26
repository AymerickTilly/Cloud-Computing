import { useEffect, useState } from 'react';
import { useAuthStore } from '../auth/AuthStore'; // Already exists in your project
import { Container, Card, Row, Col, Image, Button, Modal, Form } from 'react-bootstrap';
import hoodieImage from '../assets/crew-neck/crew_neck_1.png';
import tshirtImage from '../assets/crew-neck/crew_neck_2.png';
import { loadOrders } from '../api/loadOrders';
import { loadOrderById } from '../api/loadOrder';
import { Order } from '../types/Order';

const ListOrdersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const { user, groups } = useAuthStore();
  const isCustomer = groups.includes("Customer");
  const isAdmin = groups.includes("Admin");
  
  const [order, setOrders] = useState<Order[]>([]);// I'm tryting to get orders from here
  
  //Search Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [beforeDate, setBeforeDate] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusUpdates, setStatusUpdates] = useState<{ [orderId: string]: string }>({});

  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const orders = [    // this is the temporary data
    {
      orderId: 'ORD123456',
      date: '2025-05-21',
      username: 'XXGunslinger',
      address: '123 Main Street, Cityville, State, 10001',
      status: 'Shipped',
      items: [
        {
          id: 1,
          name: 'Product 1',
          image: hoodieImage,
          size: 'M',
          unitPrice: 29.99,
          quantity: 2,
        },
        {
          id: 2,
          name: 'Product 2',
          image: tshirtImage,
          size: 'L',
          unitPrice: 49.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD125555',
      date: '2025-05-21',
      username: 'SwordMaster',
      address: '123 Main Street, Cityville, State, 10001',
      status: 'Processing',
      items: [
        {
          id: 1,
          name: 'Product 1',
          image: hoodieImage,
          size: 'M',
          unitPrice: 29.99,
          quantity: 2,
        },
        {
          id: 2,
          name: 'Product 2',
          image: tshirtImage,
          size: 'L',
          unitPrice: 49.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD654321',
      date: '2025-05-18',
      username: 'Trickster',
      address: '456 Another Rd, Townsville, State, 20002',
      status: 'Cancelled',
      items: [
        {
          id: 3,
          name: 'Product 3',
          image: hoodieImage,
          size: 'S',
          unitPrice: 39.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD789123',
      date: '2025-05-15',
      username: 'XXRoyalGuard',
      address: '789 Sample Blvd, Village, State, 30003',
      status: 'Delivered',
      items: [
        {
          id: 4,
          name: 'Product 4',
          image: tshirtImage,
          size: 'XL',
          unitPrice: 59.99,
          quantity: 3,
        },
        {
          id: 5,
          name: 'Product 5',
          image: hoodieImage,
          size: 'M',
          unitPrice: 34.99,
          quantity: 1,
        },
      ],
    },
  ];

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const after = afterDate ? new Date(afterDate) : null;
    const before = beforeDate ? new Date(beforeDate) : null;
    const search = searchTerm.toLowerCase();
    const productNameMatches = order.items.some(item =>
      item.name.toLowerCase().includes(search)
    );
    return (
      (
      order.orderId.toLowerCase().includes(search) ||
      order.address.toLowerCase().includes(search) ||
      order.username.toLowerCase().includes(search) ||
      productNameMatches
    ) &&
      (!after || orderDate >= after) &&
      (!before || orderDate <= before) &&
      (statusFilter === 'All' || order.status === statusFilter)
    );
  });

  useEffect(() => {
    if (!user?.username) return;

    const fetchOrders = async () => {
      try {
        if (isAdmin) {
          const allOrders = await loadOrders();
          setOrders(allOrders);
        } else if (isCustomer) {
          const userOrders = await loadOrderById(user.username);
          setOrders(userOrders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };

    fetchOrders();
  }, [user, isAdmin, isCustomer]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getItemTotal = (product: any) => (product.unitPrice * product.quantity).toFixed(2);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getGrandTotal = (items: any[]) =>
    items.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0).toFixed(2);

  const handleCancel = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowModal(true);
  };

  const confirmCancel = () => {
    alert(`Order ${orderToCancel} has been cancelled.`);
    setShowModal(false);
    setOrderToCancel(null);
  };

  const handleUpdateClick = (orderId: string) => {
  setOrderToUpdate(orderId);
  setShowUpdateModal(true);
  };

  const confirmUpdate = () => {
    const newStatus = statusUpdates[orderToUpdate!] || '';
    alert(`Order ${orderToUpdate} updated to ${newStatus}`);
    setShowUpdateModal(false);
    setOrderToUpdate(null);
  };

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      <h2 className="mb-4 text-center">Your Orders</h2>
      <Form className="mb-4">
        <Form.Group controlId="search" className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-2">
          <Col>
            <Form.Label>Before Date</Form.Label>
            <Form.Control
              type="date"
              value={beforeDate}
              onChange={(e) => setBeforeDate(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>After Date</Form.Label>
            <Form.Control
              type="date"
              value={afterDate}
              onChange={(e) => setAfterDate(e.target.value)}
            />
          </Col>
          <Col sm={12} md={6}>
            <Form.Label>Status</Form.Label>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>
      {filteredOrders.map((order, index) => (
        <Card className="mb-5 shadow-sm" key={index}>
          <Card.Header className="bg-light">
            <div className="d-flex justify-content-between flex-wrap" style={{ fontSize: '1.05rem' }}>
              <span><strong>Order ID:</strong> {order.orderId}</span>
              <span><strong>Date:</strong> {order.date}</span>
              <span>
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    color:
                      order.status === 'Delivered'
                        ? 'green'
                        : order.status === 'Shipped'
                        ? '#007bff'
                        : order.status === 'Processing'
                        ? '#d39e00'
                        : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {order.status}
                </span>
              </span>
            </div>
          </Card.Header>
          <Card.Body>            
            <p style={{ fontSize: '1.1rem' }}>
              <strong>Username:</strong> {order.username}
            </p>
            <p style={{ fontSize: '1.1rem' }}>
              <strong>Shipping Address:</strong> {order.address}
            </p>
            <h5 className="mt-4 mb-3">Items Ordered:</h5>
            {order.items.map((item) => (
              <Row className="align-items-center mb-4 border-bottom pb-3" key={item.id}>
                <Col xs={3} className="d-flex justify-content-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    rounded
                    style={{ width: '150px', height: 'auto' }}
                  />
                </Col>
                <Col xs={9} style={{ fontSize: '1.1rem' }}>
                  <div><strong>{item.name}</strong></div>
                  <div>Size: {item.size}</div>
                  <div>Unit Price: ${item.unitPrice.toFixed(2)}</div>
                  <div>Quantity: {item.quantity}</div>
                  <div><strong>Total: ${getItemTotal(item)}</strong></div>
                </Col>
              </Row>
            ))}
            <h5 className="mt-4 text-end">
              Grand Total: <span className="text-success">${getGrandTotal(order.items)}</span>
            </h5>
            <div className="d-flex justify-content-end mt-3 gap-3">
            {isCustomer && order.status === 'Processing' && (
              <Button
                variant="danger"
                onClick={() => handleCancel(order.orderId)}
              >
                Cancel Order
              </Button>
            )}

            {isAdmin && (
              <>
                <Form.Select
                  style={{ width: '200px' }}
                  value={statusUpdates[order.orderId] || order.status}
                  onChange={(e) =>
                    setStatusUpdates((prev) => ({
                      ...prev,
                      [order.orderId]: e.target.value,
                    }))
                  }
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateClick(order.orderId)}
                >
                  Update
                </Button>
              </>
            )}
          </div>
          </Card.Body>
        </Card>
      ))}

      {/* Cancel Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelling Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmCancel}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update the status of this order to {' '}
          <strong>{statusUpdates[orderToUpdate!]}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListOrdersPage;
