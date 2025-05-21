import { Carousel } from 'react-bootstrap';
import firstImage from '../assets/first-slide.jpg';
import secondImage from '../assets/second-slide.jpg';
/*import thirdImage from '../assets/third-slide.jpg';
import fourthImage from '../assets/catalog-item-1.jpg';
import fifthImage from '../assets/catalog-item-2.jpg';
import sixthImage from '../assets/catalog-item-3.jpg'; */
import './hover.css'; 

type CarouselComponentProps = {
  carouselId: 'one' | 'two' | 'three';
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
        image: firstImage,
        alt: 'Third slide',
        title: 'STYLE',
        text: 'Urban boldness in every stitch.',
      },
      {
        image: secondImage,
        alt: 'Fourth slide',
        title: 'STYLE',
        text: 'Layer up with confidence.',
      },
    ];
  } else {
    slides = [
      {
        image: firstImage,
        alt: 'Fifth slide',
        title: 'PURPOSE',
        text: 'From the studio to the streets.',
      },
      {
        image: secondImage,
        alt: 'Sixth slide',
        title: 'PURPOSE',
        text: 'Never out of style.',
      },
    ];
  }

  return (
    <Carousel className="mb-4" style={{ width: '100%' }}>
      {slides.map((slide, index) => (
        <Carousel.Item key={index} className="hover-caption-wrapper">
          <img className="d-block w-100" src={slide.image} alt={slide.alt} />
          <Carousel.Caption className="hover-caption">
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
