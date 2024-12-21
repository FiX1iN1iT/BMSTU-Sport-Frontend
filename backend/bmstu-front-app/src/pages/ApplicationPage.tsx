import "./ApplicationPage.css";
import { FC, useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationRow } from "../components/ApplicationRow";
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch } from '../redux/store';
import { api } from '../api';
import { SportApplication, Section } from '../api/Api';

const ApplicationPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [application, setApplication] = useState<SportApplication>();
    const [sections, setSections] = useState<Section[]>();
    const [fullName, setFullName] = useState("");
  
    const authDispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        api.applications.applicationsRead(id)
            .then((response) => {
                const data = response.data;

                if (data.application?.creator != user.username && !user.is_staff) {
                    setIsError(true);
                }

                if (data.application && data.sections) {
                    const applicationData = data.application as SportApplication;
                    const sectionsData = data.sections as Section[];

                    setApplication(applicationData);
                    setSections(sectionsData);
                    if (sectionsData.length == 0 && application?.status == 'draft') {
                        navigate(ROUTES.APPLICATIONS);
                    }
                    setFullName(applicationData.full_name || '');
                } else {
                    setIsError(true);
                }

                setLoading(false);
            })
            .catch((error) => {
                switch (error.response.status) {
                    case 403:
                        navigate(ROUTES.FORBIDDEN);
                        break;
                    default:
                        setIsError(true);
                        setLoading(false);
                        break;
                }
            });
      }, [id]);
  
    const handleCardClick = (id: number | undefined) => {
        if (id) {
            navigate(`${ROUTES.SECTIONS}/${id}`);
        }
    };

    const handleArrowClick = (id: number | undefined) => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);
            const idString = String(id);

            setLoading(true);
            api.applications.applicationsPriorityUpdate(applicationNumberString, idString)
                .then((response) => {
                    const data = response.data;
        
                    if (data.application?.creator != user.username) {
                        setIsError(true);
                    }
        
                    if (data.sections) {
                        const sectionsData = data.sections as Section[];
                        setSections(sectionsData);
                    } else {
                        setIsError(true);
                    }
        
                    setLoading(false);
                })
                .catch(() => {
                    setIsError(true);
                    setLoading(false);
                });
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleMinusClick = (id: number | undefined) => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);
            const idString = String(id);

            setLoading(true);
            api.applications.applicationsPriorityDelete(applicationNumberString, idString)
                .then((response) => {
                    const data = response.data;
        
                    if (data.application?.creator != user.username) {
                        setIsError(true);
                    }
        
                    if (data.sections) {
                        const sectionsData = data.sections as Section[];
                        setSections(sectionsData);
                    } else {
                        setIsError(true);
                    }
        
                    setLoading(false);
                })
                .catch(() => {
                    setIsError(true);
                    setLoading(false);
                });
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleFieldSubmit = () => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);

            let updatedApplication = application;
            updatedApplication.full_name = fullName;
            api.applications.applicationsUpdate(applicationNumberString, updatedApplication);
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleDeleteButtonClick = () => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);

            api.applications.applicationsDelete(applicationNumberString);

            navigate(ROUTES.APPLICATIONS);
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleSubmitButtonClick = () => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);

            api.applications.applicationsSubmitUpdate(applicationNumberString);

            navigate(ROUTES.APPLICATIONS);
        } else {
            alert('Изменение этой заявки невозможно');
        }
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

            <div className="application-page-breadcrumbs-container">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.APPLICATIONS, path: ROUTES.APPLICATIONS },
                        { label: `Заявка #${id}` },
                    ]}
                />
            </div>

            <div className="container">
                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}
                {!loading && !isError ? (
                    <>
                        <InputField
                            value={fullName || ""}
                            setValue={(value) => setFullName(value)}
                            placeholder="Введите ФИО"
                            onSubmit={handleFieldSubmit}
                        />

                        {sections?.length ? (
                            <Row className="g-4">
                                {sections.map((item, index) => (
                                    <Col key={index} xs={12}>
                                        <ApplicationRow
                                            key={item.pk}
                                            imageUrl={item.imageUrl || ''}
                                            title={item.title}
                                            location={item.location || ''}
                                            date={item.date || ''}
                                            position={index + 1}
                                            imageClickHandler={() => handleCardClick(item.pk)}
                                            handleArrowClick={() => handleArrowClick(item.pk)}
                                            handleMinusClick={() => handleMinusClick(item.pk)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div>Нет добавленных секций</div>
                        )}
                    </>
                ) : (
                    <div>Нет доступа к заявке с таким id</div>
                )}

                <div className="application-page-horizontal-container">
                    <Button variant="danger" onClick={handleSubmitButtonClick}>Сформировать заявку</Button>
                    <Button variant="outline-danger" onClick={handleDeleteButtonClick}>Удалить заявку</Button>
                </div>
            </div>
        </div>
    );
};
  
export default ApplicationPage;