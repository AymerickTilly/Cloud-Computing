import { useState } from 'react';
import { Container, Form, Row, Col, Image, Button } from 'react-bootstrap';
import hoodieImage from '../assets/hoodies/hoodie_1.png';
import tshirtImage from '../assets/shirts/shirt_1.png';
const Checkout = () => {
  const [address, setAddress] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [products] = useState([
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
  ]);

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getItemTotal = (product: any) => {
    return (product.unitPrice * product.quantity).toFixed(2);
  };

  const getGrandTotal = () => {
    return products
      .reduce((sum, product) => sum + product.unitPrice * product.quantity, 0)
      .toFixed(2);
  };

  const handlePayment = () => {
    alert(`Proceeding to payment\nAddress: ${address}\nBank: ${selectedBank}\nTotal: $${getGrandTotal()}`);
  };

  return (
    <Container style={{ maxWidth: 800, marginTop: 40, fontFamily: 'Times New Roman, serif' }}>
      <h2 className="mb-4 text-center">Checkout</h2>

      <Form.Group className="mb-4" controlId="checkoutAddress">
        <h4 className="mb-3">Shipping Address</h4>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <h4 className="mb-3">Your Items</h4>
      {products.map((product) => (
        <Row className="align-items-center mb-4 border p-2 rounded" key={product.id}>
          <Col xs={3}>
            <Image src={product.image} alt={product.name} fluid rounded />
          </Col>
          <Col xs={9}>
            <div><strong>{product.name}</strong></div>
            <div>{product.variation}</div>
            <div>Size: {product.size}</div>
            <div>Unit Price: ${product.unitPrice.toFixed(2)}</div>
            <div>Quantity: {product.quantity}</div>
            <div><strong>Total: ${getItemTotal(product)}</strong></div>
          </Col>
        </Row>
      ))}

      <h5 className="mt-3">Grand Total: <span className="text-success">${getGrandTotal()}</span></h5>

      <Form.Group className="mt-4 mb-3">
        <Form.Label>Select Bank</Form.Label>
        <Form.Select value={selectedBank} onChange={(e) => handleBankSelect(e.target.value)}>
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
    </Container>
  );
};

export default Checkout;
