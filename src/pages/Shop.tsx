import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Import images
import firstImage from '../assets/first-slide.jpg';
import secondImage from '../assets/second-slide.jpg';
import thirdImage from '../assets/third-slide.jpg';
import fourthImage from '../assets/catalog-item-1.jpg';
import fifthImage from '../assets/catalog-item-2.jpg';
import sixthImage from '../assets/catalog-item-3.jpg';

// Use imported image variables in your data
const items = [
  { id: 1, title: "Shirt", image: fourthImage },
  { id: 2, title: "Pants", image: fifthImage },
  { id: 3, title: "Jacket", image: sixthImage },
  { id: 4, title: "Hat", image: firstImage },
  { id: 5, title: "Socks", image: secondImage },
  { id: 6, title: "Shoes", image: thirdImage },
];

function Shop() {
  return (
    <Container className="mt-5 px-5">
      <Row>
        {items.map((item) => (
          <Col key={item.id} md={4}>
            <div className="mt-4 mx-1">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="text-center">{item.title}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Shop;
