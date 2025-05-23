import { Carousel, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import './Hover.css';


import firstImage from '../assets/crew-neck/crew_neck_1.png';
import secondImage from '../assets/crew-neck/crew_neck_2.png';
import thirdImage from '../assets/crew-neck/crew_neck_3.png';
import fourthImage from '../assets/hoodies/hoodie_1.png';
import fifthImage from '../assets/hoodies/hoodie_2.png';
import sixthImage from '../assets/hoodies/hoodie_3.png';
import seventhImage from '../assets/knitwear/knit_1.png';
import eighthImage from '../assets/knitwear/knit_2.png';
import ninthImage from '../assets/knitwear/knit_3.png';
import tenthImage from '../assets/shirts/shirt_1.png';
import eleventhImage from '../assets/shirts/shirt_2.png';
import twelfthImage from '../assets/shirts/shirt_3.png';

type Slide = {
  image: string;
  alt: string;
  title: string;
  text: string;
};

type CarouselComponentProps = {
  carouselId: 'one' | 'two' | 'three' | 'four';
};

const CarouselComponent = ({ carouselId }: CarouselComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const handleSlideClick = (slide: Slide) => {
    setSelectedSlide(slide);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleAddToCart = (slide: Slide | null) => {
    if (!slide) return;
    console.log('Added to cart:', slide);
    setShowModal(false);
  };

  const handleUpdateProduct = (slide: Slide | null) => {
    if (!slide) return;
    console.log('Update product clicked:', slide);
    // Add update logic here
  };

  let slides: Slide[] = [];

  if (carouselId === 'one') {
    slides = [
      { image: firstImage, alt: 'First slide', title: 'Crew Necks', text: 'Modern comfort in timeless style.' },
      { image: secondImage, alt: 'Second slide', title: 'Crew Necks', text: 'Sustainability never looked so good.' },
      { image: thirdImage, alt: 'Third slide', title: 'Crew Necks', text: 'Sustainability never looked so good.' },
    ];
  } else if (carouselId === 'two') {
    slides = [
      { image: fourthImage, alt: 'Fourth slide', title: 'Zip-up Hoodies', text: 'Urban boldness in every stitch.' },
      { image: fifthImage, alt: 'Fifth slide', title: 'Zip-up Hoodies', text: 'Layer up with confidence.' },
      { image: sixthImage, alt: 'Sixth slide', title: 'Zip-up Hoodies', text: 'Layer up with confidence.' },
    ];
  } else if (carouselId === 'three') {
    slides = [
      { image: seventhImage, alt: 'Seventh slide', title: 'Knitwear', text: 'From the studio to the streets.' },
      { image: eighthImage, alt: 'Eighth slide', title: 'Knitwear', text: 'Never out of style.' },
      { image: ninthImage, alt: 'Ninth slide', title: 'Knitwear', text: 'Never out of style.' },
    ];
  } else if (carouselId === 'four') {
    slides = [
      { image: tenthImage, alt: 'Tenth slide', title: 'T-Shirt', text: 'Fresh drops every week.' },
      { image: eleventhImage, alt: 'Eleventh slide', title: 'T-Shirt', text: 'Discover your new favorite fit.' },
      { image: twelfthImage, alt: 'Twelfth slide', title: 'T-Shirt', text: 'Never out of style.' },
    ];
  }

  return (
    <>
      <Carousel className="mb-4 carousel-hover" style={{ width: '100%' }}>
        {slides.map((slide, index) => (
          <Carousel.Item
            key={index}
            className="hover-caption-wrapper"
            onClick={() => handleSlideClick(slide)}
            style={{ cursor: 'pointer' }}
          >
            <img className="d-block w-100" src={slide.image} alt={slide.alt} />
            <Carousel.Caption className="hover-caption">
              <h3>{slide.title}</h3>
              <p>{slide.text}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Popup Modal */}
      <Modal show={showModal} onHide={handleClose} centered dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selectedSlide?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSlide && (
            <>
              <img
                src={selectedSlide.image}
                alt={selectedSlide.alt}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
              <p className="mt-3">{selectedSlide.text}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleAddToCart(selectedSlide)}>
            Add to Cart
          </Button>
          <Button variant="danger" onClick={() => handleUpdateProduct(selectedSlide)}>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarouselComponent;
