import "./ApplicationPage.css";
import { FC, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
// import { ApplicationResult, getApplication, editApplication, deleteApplication, higherPriority, submitApplication, deletePriority } from "../modules/bmstuSportApi";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationRow } from "../components/ApplicationRow";
import { NavigationBar } from "../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { api } from '../api';
import { SportApplication, Section } from '../api/Api';

const ApplicationPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const [isError, setIsError] = useState(false);
    const [application, setApplication] = useState<SportApplication>();
    const [sections, setSections] = useState<Section[]>();
    const [fullName, setFullName] = useState("");
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        api.applications.applicationsRead(id)
          .then((response) => {
            const data = response.data;

            if (data.application?.creator != user.username) {
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
          })
          .catch(() => {
            setIsError(true);
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

            api.applications.applicationsPriorityUpdate(applicationNumberString, idString);
            // higherPriority(application.pk, id)
            window.location.reload();
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleMinusClick = (id: number | undefined) => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);
            const idString = String(id);

            api.applications.applicationsPriorityDelete(applicationNumberString, idString);
            // deletePriority(application.pk, id)
            window.location.reload();
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
            // editApplication(application.pk, fullName)
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleDeleteButtonClick = () => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);

            api.applications.applicationsDelete(applicationNumberString);
            // deleteApplication(application.pk)
            navigate(ROUTES.APPLICATIONS);
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const handleSubmitButtonClick = () => {
        if (application && application.pk && id && application.status == 'draft') {
            const applicationNumberString = String(application.pk);

            api.applications.applicationsSubmitUpdate(applicationNumberString);
            // submitApplication(application.pk)
            navigate(ROUTES.APPLICATIONS);
        } else {
            alert('Изменение этой заявки невозможно');
        }
    };

    const onLogout = () => {
        dispatch(logout());
        navigate(ROUTES.HOME);
    }
  
    return (
        <div className="container">
            <NavigationBar
                isAuthenticated={isAuthenticated}
                username={user.username}
                handleLogout={onLogout}
            />

            {!isError ? (
                <>
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.APPLICATIONS, path: ROUTES.APPLICATIONS },
                    { label: `Заявка #${id}` },
                ]}
             />
        
            <div className="top-container">
                <div className="title"></div>
  
                <div className="horizontal-container">
                    <Button variant="primary" onClick={handleSubmitButtonClick}>Сформировать заявку</Button>
                    <Button variant="danger" onClick={handleDeleteButtonClick}>Удалить заявку</Button>
                </div>
            </div>

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
        </div>
    );
};
  
export default ApplicationPage;