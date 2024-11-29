import Carousel from 'react-bootstrap/Carousel';
import './ImageCarousel.css';
import defaultImage1 from '../pages/1.png'
import defaultImage2 from '../pages/2.png'
import defaultImage3 from '../pages/3.png'

function ImageCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
            className="carousel-image"
            src={defaultImage1}
            alt="Изображение"
        />
        <Carousel.Caption>
          <h3>Футбол</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
            className="carousel-image"
            src={defaultImage2}
            alt="Изображение"
        />
        <Carousel.Caption>
          <h3>Баскетбол</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
            className="carousel-image"
            src={defaultImage3}
            alt="Изображение"
        />
        <Carousel.Caption>
          <h3>Хоккей</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageCarousel;