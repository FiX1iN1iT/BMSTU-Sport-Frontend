import { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Button, Col, Container, Row } from "react-bootstrap";
import ImageCarousel from "../components/ImageCarousel";

export const HomePage: FC = () => {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="text-center" style={{ maxWidth: "600px", width: "100%" }}>
        <Col>
          <h1>Спортивные курсы МГТУ</h1>
          <p>
            Здесь вы можете записаться на еженедельные группы по курсам.
          </p>
          <ImageCarousel/>
          <Link to={ROUTES.SECTIONS}>
            <Button className="mt-4" variant="primary">Просмотреть доступные секции</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};