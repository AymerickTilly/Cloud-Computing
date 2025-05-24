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
    <Container className="py-4">
      {/* Add d-flex and align-items-stretch to Row */}
      <Row className="g-4 d-flex align-items-stretch">
        {products.map((product) => (
          <Col key={product.productId} xs={12} sm={6} md={4} className="d-flex h-100">
            {/* Add d-flex h-100 to Col */}
            <ProductCardShop product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shop;
