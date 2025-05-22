import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import CarouselComponent from '../components/Carousel';

const rotatingMessages = [
  "Look good. Feel good. Do good.",
  "New styles drop every week.",
  "New items on sale!"
];

const Home = () => {
  const { user, email, groups, loading } = useAuthStore();
  const [, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* 🔳 Welcome Card */}
      <div
        className="card text-black p-5"
        style={{
          backgroundColor: 'white',
          borderRadius: '0',
          marginTop: '0',
          width: '100vw',
          textAlign: 'center',
          border: 'none',
        }}
      >
        {user ? (
          <>
            <p className="fs-5 mb-2">Welcome, {email}!</p>
            <p className="fs-5">Your groups: {groups.join(', ') || 'None'}</p>
          </>
        ) : (
          <p className="fs-5">You are not logged in</p>
        )}
      </div>

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

        {/* 🔁 2x2 carousel grid (optimized for 1024px width) */}
        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ maxWidth: '960px', margin: '0 auto' }} // center + cap total width
        >
          <div style={{ flex: '0 1 45%', maxWidth: '440px', height: '800px', overflow: 'hidden' }}>
            <CarouselComponent carouselId="one" />
          </div>
          <div style={{ flex: '0 1 45%', maxWidth: '440px', height: '800px', overflow: 'hidden' }}>
            <CarouselComponent carouselId="two" />
          </div>
          <div style={{ flex: '0 1 45%', maxWidth: '440px', height: '800px', overflow: 'hidden' }}>
            <CarouselComponent carouselId="three" />
          </div>
          <div style={{ flex: '0 1 45%', maxWidth: '440px', height: '800px', overflow: 'hidden' }}>
            <CarouselComponent carouselId="four" />
          </div>
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

      {/* 🔻 Footer */}
      <footer
        className="text-white text-center py-4"
        style={{
          backgroundColor: '#000',
          width: '100vw',
        }}
      >
        <div className="container">
          <p className="mb-1">© 2025 RAIR Clothing</p>
          <p className="mb-0">Privacy · Terms · Contact</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
