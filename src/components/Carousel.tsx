// CarouselComponent.tsx
import { Carousel } from 'react-bootstrap';
import firstImage from '../assets/first-slide.jpg';
import secondImage from '../assets/second-slide.jpg';
import thirdImage from '../assets/third-slide.jpg';
import fourthImage from '../assets/catalog-item-1.jpg';
import fifthImage from '../assets/catalog-item-2.jpg';
import sixthImage from '../assets/catalog-item-3.jpg';

type CarouselComponentProps = {
  carouselId: 'one' | 'two' | 'three'; // or string if dynamic
};

const CarouselComponent = ({ carouselId }: CarouselComponentProps) => {
  let slides = [];

  if (carouselId === 'one') {
    slides = [
      {
        image: firstImage,
        alt: 'First slide',
        title: 'COMFORT',
        text: 'Modern comfort in timeless style.',
      },
      {
        image: secondImage,
        alt: 'Second slide',
        title: 'COMFORT',
        text: 'Sustainability never looked so good.',
      },
    ];
  } else if (carouselId === 'two') {
    slides = [
      {
        image: thirdImage,
        alt: 'Third slide',
        title: 'STYLE',
        text: 'Urban boldness in every stitch.',
      },
      {
        image: fourthImage,
        alt: 'Fourth slide',
        title: 'STYLE',
        text: 'Layer up with confidence.',
      },
    ];
  } else {
    slides = [
      {
        image: fifthImage,
        alt: 'Fifth slide',
        title: 'PURPOSE',
        text: 'From the studio to the streets.',
      },
      {
        image: sixthImage,
        alt: 'Sixth slide',
        title: 'PURPOSE',
        text: 'Never out of style.',
      },
    ];
  }

  return (
    <Carousel className="mb-4" style={{ width: '100%' }}>
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={slide.image} alt={slide.alt} />
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

export default CarouselComponent;
