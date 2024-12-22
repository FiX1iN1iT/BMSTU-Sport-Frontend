import "./SectionsPage.css";
import { FC, useEffect } from "react";
import { Button, Col, Row, Spinner, Badge } from "react-bootstrap";
import { SearchComponent } from "../components/SearchComponent";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { SectionCard } from "../components/SectionCard";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch, RootState } from '../redux/store';
import { fetchSections, addSectionToDraft } from "../redux/sectionsSlice";

const SectionsPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const searchValue = useSelector((state: RootState) => state.search.searchValue);
    const { data, loading } = useSelector((state: RootState) => state.sections);  

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        appDispatch(fetchSections(searchValue));
    }, [appDispatch, searchValue])

    const handleCardClick = (id: number | undefined) => {
        if (id) {
            navigate(`${ROUTES.SECTIONS}/${id}`);
        }
    };

    const handleApplicationButtonClick = () => {
        navigate(`${ROUTES.APPLICATIONS}/${data.draftApplicationID}`);
    };

    const handleAddSection = (sectionId: number) => {
        appDispatch(addSectionToDraft(sectionId));
    }

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
        <div className="cccontainer">
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SECTIONS }]} />
        
            <div className="top-container">
                <div className="title">На этой неделе</div>
            </div>

            <div className="horizontal-container">
                <SearchComponent/>

                <div className="btncontainer">
                    {data.applicationSectionsCounter > 0 ? (
                        <Button variant="light" onClick={handleApplicationButtonClick}>
                            Заявка <Badge bg="danger">{data.applicationSectionsCounter}</Badge>
                        </Button>
                    ) : (
                        <Button variant="secondary">Заявка</Button> 
                    )}
                </div>
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
                    <Row className="g-4">
                        {data.sections.map((item, index) => (
                            <Col xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                                <SectionCard
                                    key={item.pk}
                                    sectionId={item.pk}
                                    imageUrl={item.imageUrl || ''}
                                    title={item.title}
                                    location={item.location}
                                    date={item.date}
                                    plusButtonClickHandler={() => handleAddSection(item.pk)}
                                    imageClickHandler={() => handleCardClick(item.pk)}
                                />
                            </Col>
                        ))}
                    </Row>
                )
                )
            }
        </div>
        </div>
    );
};

export default SectionsPage;
