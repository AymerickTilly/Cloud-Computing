import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import CarouselComponent from '../components/Carousel';
import { loadProducts } from '../api/loadProducts';
import Footer from '../components/Footer';

type Slide = {
  image: string;
  alt: string;
  title: string;
  text: string;
  productId: string;
};

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

const Home = () => {
  const { loading } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await loadProducts();
        setProducts(allProducts);
        setProductsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading || productsLoading) return <p>Loading...</p>;

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <>
      {/* 🔳 Main content */}
      <Container
        fluid
        className="d-flex flex-column align-items-center text-center pb-4"
        style={{
          fontFamily: 'Times New Roman, sans-serif',
          paddingTop: '20px',
        }}
      >
        <h1 className="display-1 mb-4">RAIR Clothing.</h1> <br />

        {/* 🔁 2x2 carousel grid */}
        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ maxWidth: '960px', margin: '0 auto' }}
        >
          {categories.map((category) => {
            const categoryProducts = products.filter((p) => p.category === category);
            const slides: Slide[] = categoryProducts.map((p) => ({
              image: p.imageUrl,
              alt: `${p.name} image`,
              title: p.name,           // Maps to product.name
              text: p.description,    // Maps to product.description
              productId: p.productId,
            }));

            return (
              <div
                key={category}
                style={{ flex: '0 1 45%', maxWidth: '440px', height: '800px', overflow: 'hidden' }}
              >
                <CarouselComponent slides={slides} />
              </div>
            );
          })}
        </div>

        {/* 📣 Mission Statement */}
        <div className="mt-4">
          <div
            className="card p-4"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '0',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'justify',
              border: 'none',
            }}
          >
            <div className="fs-5">
              At <strong>RAIR</strong>, quality meets comfort—without compromise. <br />
              We craft modern, trend-driven outerwear using sustainable materials,
              ensuring you look sharp and feel comfortable every day.
              Ready to upgrade your wardrobe with style and purpose? <br /><br />
              <strong>Place your order today.</strong>
            </div>
          </div>
        </div>
      </Container>

      <Footer/>
    </>
  );
};

export default Home;