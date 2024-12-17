import "./SectionsPage.css";
import { FC, useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Badge } from "react-bootstrap";
import { SearchComponent } from "../components/SearchComponent";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { SectionCard } from "../components/SectionCard";
import { useNavigate } from "react-router-dom";
import { SECTIONS_MOCK } from "../modules/mocks";
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch } from '../redux/store';
import { api } from '../api';
import { Section } from '../api/Api';

const SectionsPage: FC = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const searchValue = useSelector((state: RootState) => state.search.searchValue);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [applicationSectionsCounter, setApplicationSectionsCounter] = useState(0);
  const [draftApplicationID, setDraftApplicationID] = useState(0);

  const authDispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.sections.sectionsList({section_title: searchValue})
        .then((response) => {
            const data = response.data;

            if (data && data.sections) {
                const sectionsData = data.sections as Section[];

                setSections(sectionsData);
            }

            if (data && data.draft_application_id && data.number_of_sections) {
                const numberOfSectionsData = data.number_of_sections as number;
                const draftApplicationIDData = data.draft_application_id as number;

                setApplicationSectionsCounter(numberOfSectionsData);
                setDraftApplicationID(draftApplicationIDData);
            }

            setLoading(false);
        })
        .catch(() => {
            setSections(SECTIONS_MOCK.sections);
            setLoading(false);
        });
  }, [searchValue])

  const handleCardClick = (id: number | undefined) => {
    if (id) {
        navigate(`${ROUTES.SECTIONS}/${id}`);
    }
  };

  const handleApplicationButtonClick = () => {
    navigate(`${ROUTES.APPLICATIONS}/${draftApplicationID}`);
  };

  const handleAddSection = (sectionId: number | undefined) => {
    console.log(sectionId)
    
    if (sectionId) {
        api.applications.applicationsDraftCreate({section_id: sectionId})
            .then((response) => {
                const data = response.data;

                if (data && data.draft_application_id) {
                    const draftApplicationIDData = data.draft_application_id as number;

                    setApplicationSectionsCounter(applicationSectionsCounter + 1);
                    setDraftApplicationID(draftApplicationIDData);
                }
            })
    }
  }

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
                {applicationSectionsCounter > 0 ? (
                    <Button variant="light" onClick={handleApplicationButtonClick}>
                        ЗАЯВКА <Badge bg="danger">{applicationSectionsCounter}</Badge>
                    </Button>
                ) : (
                    <Button variant="secondary">ЗАЯВКА</Button> 
                )}
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
                <Row className="g-4">
                    {sections.map((item, index) => (
                        <Col xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                            <SectionCard
                                key={item.pk}
                                sectionId={item.pk || 1}
                                imageUrl={item.imageUrl || ''}
                                title={item.title}
                                location={item.location || ''}
                                date={item.date || ''}
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