'use client';

import { Item } from '@prisma/client';
import Carousel from 'react-bootstrap/Carousel';
import ItemCard from './ItemCard';
import { Row, Col } from 'react-bootstrap';

interface RecentItemsCarouselProps {
  items: Item[];
}

const RecentItemsCarousel = ({ items }: RecentItemsCarouselProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center p-5 bg-light rounded shadow-sm">
        <p className="mb-0">No active items have been reported yet.</p>
      </div>
    );
  }

  return (
    <Carousel
      indicators={true}
      interval={5000}
      pause="hover"
      className="recent-items-carousel"
      variant="dark"
    >
      {items.map((item) => (
        <Carousel.Item key={item.id}>
          <div className="py-4">
             <Row className="justify-content-center">
               <Col md={6} lg={4}>
                 <ItemCard item={item} />
               </Col>
             </Row>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default RecentItemsCarousel;
