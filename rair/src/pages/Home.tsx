// Home.jsx
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
      <h1 className="display-1 mb-4">RAIR Clothing.</h1>

      {/* Row of 3 carousels side by side */}
      <div className="d-flex flex-row justify-content-center gap-4 flex-wrap w-100">
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

      {user ? (
        <>
          <p className="fs-5 mt-3">Welcome, {email}!</p>
          <p className="fs-5">Your groups: {groups.join(', ') || 'None'}</p>
        </>
      ) : (
        <p className="fs-3 mt-3">You are not logged in</p>
      )}

      <div className="mt-4 fs-5">
        Here at <strong>RAIR</strong>, where quality meets comfort. <br />
        Our goal is to combine trending outerwear with sustainable materials for style
        while maintaining the comfort for everyday activities. <br />
        <strong>ORDER NOW!!!</strong>
      </div>
    </Container>
  );
};

export default Home;
