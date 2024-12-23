import { FC, useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { User } from '../api/Api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { updateUser } from '../redux/authSlice';

const ProfilePage: FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const appDispatch = useAppDispatch();

    useEffect(() => {
        if (!user || !user.id) {
            setError('Не удалось получить ID пользователя');
            return;
        }

        setEmail(user.username || '');
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user || !user.id) {
            alert('Пользователь не авторизован');
            return;
        }

        if (email == '' || password == '') {
            setSuccessMessage(null);
            setError('Введите email и пароль для обновления данных');
            return;
        }

        const updatedUser: User = {email: email, password: password};

        if (firstName?.trim()) updatedUser.first_name = firstName.trim();
        if (lastName?.trim()) updatedUser.last_name = lastName.trim();

        try {
            await appDispatch(updateUser({ userId: user.id, updatedUser })).unwrap();
            setError(null);
            setSuccessMessage('Данные успешно обновлены');
        } catch (error) {
            setSuccessMessage(null);
            setError('Ошибка при обновлении данных');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
            <BreadCrumbs
            crumbs={[
                { label: ROUTE_LABELS.USER_DASHBOARD, path: ROUTES.USER_DASHBOARD }
            ]}
            />
            <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
            <div className="auth-container p-4 border rounded shadow">
                <h2 className="text-center mb-4">Личный кабинет</h2>

                {/* Сообщение об успехе */}
                {successMessage && <Alert variant="success" className="mb-4">{successMessage}</Alert>}

                {/* Сообщение об ошибке */}
                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                <Form>
                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                    type="email" 
                    placeholder="Введите email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formFirstName" className="mt-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Введите имя" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mt-3">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Введите фамилию" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
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

                <Button variant="danger" onClick={handleProfileUpdate} className="w-100 mt-4">
                    Обновить данные
                </Button>
                </Form>
            </div>
            </Col>
        </Row>
        </Container>
    );
};

export default ProfilePage;
