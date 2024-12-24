import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert, Row, Col, Image } from 'react-bootstrap';
import { ROUTES } from '../Routes';
import { useSelector } from "react-redux";
import { useAppDispatch, RootState } from '../redux/store';
import { fetchSection, updateSection, updateSectionImage, deleteSection } from "../redux/sectionSlice";
import { SectionV2 } from '../graphql/graphql';

const SectionEditPage = () => {
    const { data, loading, error } = useSelector((state: RootState) => state.section);

    const [formData, setFormData] = useState<SectionV2 | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        appDispatch(fetchSection(id));
    }, [appDispatch, id]);

    useEffect(() => {
        if (!data) return;
        setFormData(data);
        setImagePreview(data.imageUrl || null);
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData!,
            [name]: value
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
        if (!id || !formData || !data) return;
        formData.id = Number(formData.id);
        appDispatch(updateSection(formData));
    };

    const handleDelete = async () => {
        if (!id || !data) return;

        appDispatch(deleteSection(id));
        navigate(ROUTES.SECTIONSTABLE);
    };

    const handleImageUpdate = async () => {
        if (!id || !imageFile) return;

        appDispatch(updateSectionImage({ sectionId: id, imageFile: imageFile }));
        navigate(ROUTES.SECTIONSTABLE);
    };  


    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <Alert variant="danger">Ошибка!</Alert>;
    }

    if (!data) {
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
                    src={data?.imageUrl || ''} 
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
                    <Button variant="danger" onClick={handleSubmit}>
                        Сохранить изменения
                    </Button>
                    {imageFile && (
                        <Button variant="danger" onClick={handleImageUpdate}>
                            Обновить изображение
                        </Button>
                    )}
                    <Button variant="outline-danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                    <Button variant="light" onClick={() => navigate(ROUTES.SECTIONSTABLE)}>
                        Отмена
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default SectionEditPage;
