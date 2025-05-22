import { useState } from 'react';
import { Container, Card, Row, Col, Image, Button, Modal } from 'react-bootstrap';
import hoodieImage from '../assets/crew-neck/crew_neck_1.png';
import tshirtImage from '../assets/crew-neck/crew_neck_2.png';
const ListOrdersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const orders = [
    {
      orderId: 'ORD123456',
      date: '2025-05-21',
      address: '123 Main Street, Cityville, State, 10001',
      status: 'Shipped',
      items: [
        {
          id: 1,
          name: 'Product 1',
          image: hoodieImage,
          variation: 'Color: Red',
          size: 'M',
          unitPrice: 29.99,
          quantity: 2,
        },
        {
          id: 2,
          name: 'Product 2',
          image: tshirtImage,
          variation: 'Color: Blue',
          size: 'L',
          unitPrice: 49.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD125555',
      date: '2025-05-21',
      address: '123 Main Street, Cityville, State, 10001',
      status: 'Processing',
      items: [
        {
          id: 1,
          name: 'Product 1',
          image: hoodieImage,
          variation: 'Color: Red',
          size: 'M',
          unitPrice: 29.99,
          quantity: 2,
        },
        {
          id: 2,
          name: 'Product 2',
          image: tshirtImage,
          variation: 'Color: Blue',
          size: 'L',
          unitPrice: 49.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD654321',
      date: '2025-05-18',
      address: '456 Another Rd, Townsville, State, 20002',
      status: 'Cancelled',
      items: [
        {
          id: 3,
          name: 'Product 3',
          image: hoodieImage,
          variation: 'Color: Green',
          size: 'S',
          unitPrice: 39.99,
          quantity: 1,
        },
      ],
    },
    {
      orderId: 'ORD789123',
      date: '2025-05-15',
      address: '789 Sample Blvd, Village, State, 30003',
      status: 'Delivered',
      items: [
        {
          id: 4,
          name: 'Product 4',
          image: tshirtImage,
          variation: 'Color: Black',
          size: 'XL',
          unitPrice: 59.99,
          quantity: 3,
        },
        {
          id: 5,
          name: 'Product 5',
          image: hoodieImage,
          variation: 'Color: Yellow',
          size: 'M',
          unitPrice: 34.99,
          quantity: 1,
        },
      ],
    },
  ];

  const getItemTotal = (product: any) => (product.unitPrice * product.quantity).toFixed(2);
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
    // Here, you could update order status in state
  };

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      <h2 className="mb-4 text-center">Your Orders</h2>

      {orders.map((order, index) => (
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
            <p style={{ fontSize: '1.1rem' }}><strong>Shipping Address:</strong> {order.address}</p>

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
                  <div>{item.variation}</div>
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

            {order.status === 'Processing' && (
              <div className="text-end mt-3">
                <Button variant="outline-danger" onClick={() => handleCancel(order.orderId)}>
                  Cancel Order
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* Modal */}
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
    </Container>
  );
};

export default ListOrdersPage;
