// src/pages/Shop.tsx
import { useEffect, useState } from "react";
import { loadProducts } from "../api/loadProducts";
import { Col, Container, Row } from "react-bootstrap";
import ProductCardShop from "../components/ProductCardShop";
import { Product } from "../types/Product";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div style={{ backgroundColor: "#423c37", minHeight: "100vh" }}>
      <Container className="py-4">
        <Row className="g-4 d-flex align-items-stretch">
          {products.map((product) => (
            <Col key={product.productId} xs={12} sm={6} md={4} className="d-flex h-100">
              <ProductCardShop product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Shop;
