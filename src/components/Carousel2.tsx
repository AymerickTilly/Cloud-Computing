import { Carousel } from 'react-bootstrap';
import firstImage from '../assets/first-slide.jpg';
import secondImage from '../assets/second-slide.jpg';
import thirdImage from '../assets/third-slide.jpg';

const slides = [
  {
    image: firstImage,
    alt: 'First slide',
    title: 'RAIR STYLE',
    text: 'Comfort that moves with you.',
  },
  {
    image: secondImage,
    alt: 'Second slide',
    title: 'RAIR STYLE',
    text: 'Elevate your everyday look.',
  },
  {
    image: thirdImage,
    alt: 'Third slide',
    title: 'RAIR STYLE',
    text: 'Crafted for confidence.',
  },
];

const CarouselComponent2 = () => {
  return (
    <Carousel className="mb-4" style={{ width: '100%', height: '100%' }}>
      {slides.map((slide, index) => (
        <Carousel.Item key={index} style={{ height: '100%' }}>
          <img
            className="d-block w-100"
            src={slide.image}
            alt={slide.alt}
            style={{ height: '100%', objectFit: 'cover' }}
          />
          <Carousel.Caption
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.39)',
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
            <h3 style={{ color: 'white' }}>{slide.title}</h3>
            <p style={{ color: 'white' }}>{slide.text}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselComponent2;
