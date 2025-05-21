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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* 🔳 Top rotating message bar */}
      <div
        className="text-white px-4 py-3"
        style={{
          backgroundColor: '#000',
          borderRadius: '0',
          width: '100vw',
          textAlign: 'center',
        }}
      >
        <div className="fs-5">
          {rotatingMessages[currentMessageIndex] || "Stay stylish with RAIR."}
        </div>
      </div>

      {/* 🔳 Main content */}
      <Container
        fluid
        className="d-flex flex-column align-items-center text-center pb-5"
        style={{
          fontFamily: 'Times New Roman, sans-serif',
          paddingTop: '56px',
        }}
      >
        <h1 className="display-1 mb-4">RAIR Clothing.</h1> <br />

        <div className="w-100 px-4">
          {/* Carousels */}
          <div className="d-flex flex-row justify-content-center gap-4 flex-wrap">
            <div style={{ flex: '1 1 30%' }}>
              <CarouselComponent carouselId="one" />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <CarouselComponent carouselId="two" />
            </div>
            <div style={{ flex: '1 1 30%' }}>
              <CarouselComponent carouselId="three" />
            </div>
          </div>

          {/* Welcome Card */}
          <div className="mt-4">
            <div
              className="card text-white p-4"
              style={{
                backgroundColor: '#000',
                borderRadius: '0',
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
          </div>

          {/* Mission Statement */}
          <div className="mt-4">
            <div
              className="card p-4"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '0',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'justify',
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
        </div>
      </Container>

      {/* 🔳 Footer */}
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
