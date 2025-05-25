import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import CarouselComponent from '../components/Carousel';
import { loadProducts } from '../api/loadProducts';
import Footer from '../components/Footer';
import { Product } from '../types/Product';
import { Slide } from '../types/Slide';



const Home = () => {
  const { loading, userId } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await loadProducts();
        setProducts(allProducts);
        setProductsLoading(false);
        console.log(userId)
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
      <div
        style={{
          backgroundColor: '#909EAE',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >

      <Container
        fluid
        className="d-flex flex-column align-items-center text-center pb-4"
        style={{
          fontFamily: 'Times New Roman, sans-serif',
          paddingTop: '20px',
        }}
      >
        <h1 className="display-1 mb-4 text-white">RAIR Clothing.</h1>

        {/* 🔁 2x2 carousel grid */}
        <div
            className="d-flex flex-wrap justify-content-center"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              rowGap: '0.01rem',   // Reduce vertical space
              columnGap: '2rem' // Keep horizontal space if needed
            }}
          >
          {categories.map((category) => {
            const categoryProducts = products.filter((p) => p.category === category);
            const slides: Slide[] = categoryProducts.map((p) => ({
              image: p.imageUrl,
              alt: `${p.name} image`,
              title: p.name,
              text: p.description,
              productId: p.productId,
            }));

            return (
              <div
                key={category}
                style={{
                  flex: '0 1 45%',
                  maxWidth: '440px',
                  height: '800px',
                  overflow: 'hidden',
                }}
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

      <Footer />
    </div>
  );
};

export default Home;
