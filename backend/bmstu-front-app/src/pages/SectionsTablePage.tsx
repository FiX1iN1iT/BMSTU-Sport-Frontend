import "./SectionsTablePage.css";
import { FC, useEffect } from "react";
import { Col, Row, Spinner, Container, Button } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch, RootState } from '../redux/store';
import { Section } from '../api/Api';
import { DateDisplay } from '../helpers/DateDisplay';
import { fetchSections, createSection } from "../redux/sectionsSlice";

const SectionsTablePage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const { data, loading } = useSelector((state: RootState) => state.sections);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        appDispatch(fetchSections());
    }, [appDispatch])

    useEffect(() => {
        if (!user.is_staff) {
            navigate(ROUTES.FORBIDDEN);
            return;
        }

        appDispatch(fetchSections());
    }, [user]);

    const handleCardClick = (id: number | undefined) => {
        if (id) navigate(`${ROUTES.SECTIONSTABLE}/${id}`);
    };

    const handleAddButtonClick = () => {
        const newSection: Section = {
            title: "Добавленная секция"
        };
        
        appDispatch(createSection(newSection));
    };

    const handleLogout = async () => {
        try {
            await appDispatch(logoutUser()).unwrap();
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Ошибка деавторизации:', error);
        }
    };

    return (
        <div>
            <NavigationBar
                isAuthenticated={isAuthenticated}
                username={user.username}
                is_staff={user.is_staff}
                handleLogout={handleLogout}
            />
            <div className="sections-table-page-container">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SECTIONS }]} />
            
                <div className="top-container">
                    <div className="title">На этой неделе</div>
                </div>

                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}
                {!loading &&
                    (!data.sections.length ? (
                        <div>
                            <h1>Такого курса на этой неделе не будет</h1>
                        </div>
                    ) : (
                        <div className="table-container">
                            <div className="sections-table-page-horizontal-container">
                                <Button variant="danger" onClick={handleAddButtonClick}>Добавить секцию</Button>
                            </div>

                            <Container fluid>
                                <Row>
                                    <Col>#</Col>
                                    <Col>Изображение</Col>
                                    <Col>Название</Col>
                                    <Col>Место</Col>
                                    <Col>Дата</Col>
                                    <Col>Преподаватель</Col>
                                    <Col>Продолжительность</Col>
                                </Row>

                                {data.sections.map((item, _) => (
                                    <Row key={item.pk} className="my-2 sections-table-page-row align-items-center">
                                        <Col onClick={() => handleCardClick(item.pk)} style={{ cursor: "pointer", textDecoration: 'underline', color: 'blue' }}>{item.pk}</Col>
                                        <Col>
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt="section" style={{ maxWidth: "100px", maxHeight: "50px" }} />
                                            ) : (
                                                '--'
                                            )}
                                        </Col>
                                        <Col>{item.title}</Col>
                                        <Col>{item.location || '--'}</Col>
                                        <Col><DateDisplay dateString={item.date || ''}/></Col>
                                        <Col>{item.instructor || '--'}</Col>
                                        <Col>{item.duration || '--'} мин</Col>
                                    </Row>
                                ))}
                            </Container>
                        </div>
                    )
                    )
                }
            </div>
        </div>
    );
};

export default SectionsTablePage;
