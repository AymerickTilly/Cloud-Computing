
import { Container, Row, Col, Card } from 'react-bootstrap';

import firstImage from '../assets/first-slide.jpg';
import fourthImage from '../assets/catalog-item-1.jpg';
import fifthImage from '../assets/catalog-item-2.jpg';
import sixthImage from '../assets/catalog-item-3.jpg';

interface ShopItem {
  id: number;
  title: string;
  image: string;
}

const items: ShopItem[] = [
  { id: 1, title: "Shirt", image: fourthImage },
  { id: 2, title: "Crew Necks", image: fifthImage },
  { id: 3, title: "Knitwear", image: sixthImage },
  { id: 4, title: "Hoodies", image: firstImage },
];

function Shop() {
  return (
    <Container className="mt-5 px-5">
      <Row className="g-4">
        {items.map((item) => (
          <Col key={item.id} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={item.image}
                alt={item.title}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-center">{item.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Shop;
