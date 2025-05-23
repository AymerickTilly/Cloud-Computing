import { Carousel, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import './Hover.css';
import { useAuthStore } from '../auth/AuthStore';

type Slide = {
  image: string;
  alt: string;
  title: string;    // Maps to product.name
  text: string;     // Maps to product.description
  productId: string; // For cart functionality
};

type CarouselComponentProps = {
  slides: Slide[];
};

const CarouselComponent = ({ slides }: CarouselComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const { groups } = useAuthStore();

  const handleSlideClick = (slide: Slide) => {
    setSelectedSlide(slide);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleAddToCart = (slide: Slide | null) => {
    if (!slide) return;
    console.log('Added to cart:', slide.productId);
    // Replace with your add-to-cart logic
    setShowModal(false);
  };

  return (
    <>
      <Carousel className="mb-4 carousel-hover">
        {slides.map((slide) => (
          <Carousel.Item
            key={slide.productId}
            className="hover-caption-wrapper"
            onClick={() => handleSlideClick(slide)}
            style={{ cursor: 'pointer' }}
          >
            <img className="d-block w-100" src={slide.image} alt={slide.alt} />
            <Carousel.Caption className="hover-caption">
              <h3>{slide.title}</h3>
               {/* Added back to show product.description */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

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
                  borderRadius: '4px',
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
          {groups.includes('Customer') && (
            <Button variant="primary" onClick={() => handleAddToCart(selectedSlide)}>
              Add to Cart
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarouselComponent;