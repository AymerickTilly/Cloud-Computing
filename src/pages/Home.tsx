import { Container } from 'react-bootstrap';
import { useAuthStore } from '../auth/AuthStore';
import CarouselComponent from '../components/Carousel';

const Home = () => {
  const { user, email, groups, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  return (
    <Container
      className="d-flex flex-column align-items-center text-center py-5"
      style={{ fontFamily: 'Times New Roman, sans-serif' }}
    >
      <h1 className="display-1 mb-4">RAIR Clothing.</h1> <br />

      {/* Carousels, black card, and mission statement in one container */}
      <div className="w-100 px-4">
        {/* Row of 3 carousels side by side */}
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

        {/* Black card below carousels, aligned with their width */}
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

        {/* Mission statement card below black card, same width */}
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
  );
};

export default Home;
