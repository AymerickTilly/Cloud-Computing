import { useEffect, useState } from "react";
import { loadProducts } from "../api/loadProducts"; // Adjust path if needed
import { Card, Col, Container, Row } from "react-bootstrap";

type Product = {
  productId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: {
    size: string;
    stockAmount: number;
  }[];
  imageUrl: string;
  onSale?: boolean;
  salePrice?: number;
};

const UpdateItemPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <Container className="py-4">
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.productId} xs={12} sm={6} md={4}>
            <Card className="h-100 shadow-sm">
              <Row className="g-0 h-100">
                <Col xs={5} className="d-flex align-items-center justify-content-center p-2">
                  <Card.Img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ maxHeight: "200px", width: "auto", objectFit: "contain" }}
                  />
                </Col>
                <Col xs={7}>
                  <Card.Body>
                    <Card.Title className="fw-bold fs-5 mb-2">{product.name}</Card.Title>
                    <Card.Text style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                      {product.description}
                    </Card.Text>
                    <Card.Text className="fw-semibold mt-2">
                      Price: ${product.price}
                    </Card.Text>
                    {product.onSale && (
                      <Card.Text className="text-danger fw-semibold">
                        Sale Price: ${product.salePrice}
                      </Card.Text>
                    )}
                    <div>
                      <strong>Stock:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {product.stock.map((item, index) => (
                          <span
                            key={index}
                            className="border rounded px-2 py-1 text-muted small"
                          >
                            {item.size} – {item.stockAmount}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UpdateItemPage;
