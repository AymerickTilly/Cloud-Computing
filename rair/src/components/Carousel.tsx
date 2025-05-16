import { Carousel } from 'react-bootstrap';
import firstImage from '../assets/first-slide.jpg';
import secondImage from '../assets/second-slide.jpg';
import thirdImage from '../assets/third-slide.jpg';

const CarouselComponent = () => {
  return (
    <Carousel className="mb-4" style={{ width: '30%' }}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={firstImage}
          alt="First slide"
        />
      <Carousel.Caption
        style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            borderRadius: '0',
            width: '100%',
            left: 0,
            right: 0,
            bottom: 0,
            transform: 'none',
            textAlign: 'center',
            }}
>
            <h3 style={{ color: 'white' }}>First slide label</h3>
            <p style={{ color: 'white' }}>Modern comfort in timeless style.</p>
      </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={secondImage}
          alt="Second slide"
        />
        <Carousel.Caption
        style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            borderRadius: '0',
            width: '100%',
            left: 0,
            right: 0,
            bottom: 0,
            transform: 'none',
            textAlign: 'center',
            }}
>
            <h3 style={{ color: 'white' }}>Second slide label</h3>
            <p style={{ color: 'white' }}>Sustainability never looked so good.</p>
      </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={thirdImage}
          alt="Third slide"
        />
                <Carousel.Caption
        style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '1rem',
            borderRadius: '0',
            width: '100%',
            left: 0,
            right: 0,
            bottom: 0,
            transform: 'none',
            textAlign: 'center',
            }}
>
            <h3 style={{ color: 'white' }}>Third slide label</h3>
            <p style={{ color: 'white' }}>From the street to the studio—wear RAIR anywhere.</p>
      </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselComponent;
