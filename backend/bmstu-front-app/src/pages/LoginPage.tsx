import { FC, useState } from 'react';
import { useAppDispatch } from '../redux/store';
import { loginUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { BreadCrumbs } from '../components/BreadCrumbs';

const LoginPage: FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();

      navigate('/');
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.LOGIN, path: ROUTES.LOGIN }
          ]}
        />
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <div className="auth-container p-4 border rounded shadow">
            <h2 className="text-center mb-4">Авторизация</h2>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Логин</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Введите логин" 
                  value={email} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Введите пароль" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Form.Group>

              <Button variant="primary" onClick={handleLogin} className="w-100 mt-4">
                Войти
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;