import "./SectionEditPage.css";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, Row, Col, Image } from 'react-bootstrap';
import { Section } from '../api/Api';
import { api } from '../api';
import { ROUTES } from '../Routes';

const SectionEditPage = () => {
    const { id } = useParams();
    const [element, setElement] = useState<Section | null>(null);
    const [formData, setFormData] = useState<Section | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("ID элемента не найден");
            return;
        }
        api.sections.sectionsRead(id)
            .then((response: { data: Section }) => {
                const elementData = response.data;
                setElement(elementData);
                setFormData(elementData);
                setImagePreview(elementData.imageUrl || null);
            })
            .catch(() => {
                setError('Ошибка при загрузке данных.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData!,
      [name]: value,
    });
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setImageFile(file);
        }
    };

    const handleSubmit = async () => {
        if (formData && element) {
        setLoading(true);

        try {
            await api.sections.sectionsChangeUpdate(id || '', {
                ...formData,
            })
                .then(() => {
                    navigate(ROUTES.SECTIONS);
                })
                .catch((error) => {
                    setError("Ошибка при сохранении изменений");
                    console.error(error);
                });
        } catch (error) {
            setError("Ошибка при сохранении изменений");
            console.error(error);
        } finally {
            setLoading(false);
        }
        }
    };

    const handleDelete = async () => {
        if (element) {
        setLoading(true);

        try {
            await api.sections.sectionsDeleteDelete(id || '')
                .then(() => {
                    navigate(ROUTES.SECTIONSTABLE);
                })
                .catch((error) => {
                    setError("Ошибка при удалении секции");
                    console.error(error);
                });
        } catch (error) {
            setError("Ошибка при удалении секции");
            console.error(error);
        } finally {
            setLoading(false);
        }
        }
    };

    const handleImageUpdate = async () => {
        if (imageFile && id) {
        setLoading(true);

        try {
            await api.sections.sectionsUploadImageCreate(id, { image: imageFile })
                .then(() => {
                    navigate(ROUTES.SECTIONS);
                })
                .catch((error) => {
                    setError("Ошибка при обновлении изображения");
                    console.error(error);
                });
        } catch (error) {
            setError("Ошибка при обновлении изображения");
            console.error(error);
        } finally {
            setLoading(false);
        }
        }
    };  


    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!element) {
        return <div>Элемент не найден.</div>;
    }

    return (
        <Container className="mt-4">
        <h2>Редактировать услугу</h2>
        <Form className="mt-3">
            <Row>
            <Col md={6}>
                <Form.Group controlId="title">
                <Form.Label>Название</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData?.title || ''}
                    onChange={handleInputChange}
                    placeholder="Введите название"
                />
                </Form.Group>
            </Col>
            </Row>

            <Row className="mt-3">
            <Col md={6}>
                <Form.Group controlId="location">
                <Form.Label>Место проведения</Form.Label>
                <Form.Control
                    type="text"
                    name="location"
                    value={formData?.location || ''}
                    onChange={handleInputChange}
                    placeholder="Введите место проведения"
                />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="date">
                <Form.Label>Дата занятия</Form.Label>
                <Form.Control
                    type="datetime"
                    name="date"
                    value={formData?.date || ''}
                    onChange={handleInputChange}
                    placeholder="Введите дату занятия"
                />
                </Form.Group>
            </Col>
            </Row>

            <Row className="mt-3">
            <Col md={6}>
                <Form.Group controlId="instructor">
                <Form.Label>ФИО преподавателя</Form.Label>
                <Form.Control
                    type="text"
                    name="instructor"
                    value={formData?.instructor || ''}
                    onChange={handleInputChange}
                    placeholder="Введите ФИО преподавателя"
                />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group controlId="duration">
                <Form.Label>Длительность занятия</Form.Label>
                <Form.Control
                    type="number"
                    name="duration"
                    value={formData?.duration || ''}
                    onChange={handleInputChange}
                    placeholder="Длительность занятия (мин)"
                />
                </Form.Group>
            </Col>
            </Row>

            <Form.Group controlId="image" className="mt-3">
            <Form.Label>Изображение</Form.Label>
            <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
            />
            {imagePreview ? (
                <Image 
                src={imagePreview} 
                alt="Preview" 
                fluid
                style={{ maxWidth: '400px', maxHeight: '400px', marginTop: '10px' }}
                />
            ) : (
                <Image 
                src={element?.imageUrl || ''} 
                alt="Preview" 
                fluid
                style={{ maxWidth: '400px', maxHeight: '400px', marginTop: '10px' }}
                />
            )}
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData?.description || ''}
                onChange={handleInputChange}
                placeholder="Введите описание"
            />
            </Form.Group>

            <div className="mt-4 d-flex justify-content-between">
            <Button variant="primary" onClick={handleSubmit}>
                Сохранить изменения
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Удалить
            </Button>
            <Button variant="secondary" onClick={() => navigate(ROUTES.SECTIONSTABLE)}>
                Отмена
            </Button>
            </div>

            {imageFile && (
            <Button variant="success" className="mt-3" onClick={handleImageUpdate}>
                Обновить изображение
            </Button>
            )}
        </Form>
        </Container>
    );
};

export default SectionEditPage;
