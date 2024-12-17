import "./SectionsTablePage.css";
import { FC, useEffect, useState } from "react";
import { Col, Row, Spinner, Container, Button } from "react-bootstrap";
import { SearchComponent } from "../components/SearchComponent";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useNavigate } from "react-router-dom";
import { SECTIONS_MOCK } from "../modules/mocks";
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch } from '../redux/store';
import { api } from '../api';
import { Section } from '../api/Api';
import { DateDisplay } from '../helpers/DateDisplay';

const SectionsTablePage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const searchValue = useSelector((state: RootState) => state.search.searchValue);
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);

    const authDispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchSections = () => {
        setLoading(true);
        api.sections.sectionsList({section_title: searchValue})
            .then((response) => {
                const data = response.data;

                if (data && data.sections) {
                    const sectionsData = data.sections as Section[];
                    setSections(sectionsData);
                }

                setLoading(false);
            })
            .catch(() => {
                setSections(SECTIONS_MOCK.sections);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (user.is_staff) {
            fetchSections();
        } else {
            navigate(ROUTES.FORBIDDEN);
        }
    }, [user]);

    useEffect(() => {
        fetchSections();
    }, [searchValue])

    const handleCardClick = (id: number | undefined) => {
        if (id) {
            navigate(`${ROUTES.SECTIONSTABLE}/${id}`);
        }
    };

    const handleAddButtonClick = () => {
        const newSection: Section = {
            title: "Добавленная секция"
        };
        
        api.sections.sectionsCreate(newSection)
            .then((response) => {
                console.log("Секция успешно создана:", response);

                const updatedSections = [...sections, response.data];
                setSections(updatedSections);
            })
            .catch(error => {
                console.log("Ошибка создания секции:", error);
            });
    };

    const handleLogout = async () => {
        try {
            await authDispatch(logoutUser()).unwrap();

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
            <div className="cccontainer">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SECTIONS }]} />
            
                <div className="top-container">
                    <div className="title">На этой неделе</div>
                </div>

                <div className="horizontal-container">
                    <SearchComponent/>

                    <div className="btncontainer">
                        <Button variant="primary" onClick={handleAddButtonClick}>Добавить секцию</Button>
                    </div>
                </div>

                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}
                {!loading &&
                    (!sections.length ? (
                        <div>
                            <h1>Такого курса на этой неделе не будет</h1>
                        </div>
                    ) : (
                        <div className="table-container">
                            <Container fluid>
                                <Row>
                                    <Col>#</Col>
                                    <Col>Название</Col>
                                    <Col>Место</Col>
                                    <Col>Дата</Col>
                                    <Col>Преподаватель</Col>
                                    <Col>Продолжительность</Col>
                                </Row>

                                {sections.map((item, _) => (
                                    <Row key={item.pk} className="my-2 custom-row align-items-center">
                                        <Col onClick={() => handleCardClick(item.pk)} style={{ cursor: "pointer", textDecoration: 'underline', color: 'blue' }}>{item.pk}</Col>
                                        <Col>{item.title}</Col>
                                        <Col>{item.location || '--'}</Col>
                                        <Col><DateDisplay dateString={item.date || ''}/></Col>
                                        <Col>{item.instructor || '--'}</Col>
                                        <Col>{item.duration || '--'}</Col>
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