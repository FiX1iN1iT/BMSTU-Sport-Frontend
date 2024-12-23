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
import { useAppDispatch, RootState } from '../redux/store';
import { fetchApplication, increasePriority, removeSection, changeFullName, deleteApplication, submitApplication } from "../redux/applicationSlice";
import { SportApplication } from "../api/Api";

const ApplicationPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const { data, loading, error } = useSelector((state: RootState) => state.application);

    const [fullName, setFullName] = useState('');
  
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        appDispatch(fetchApplication(id));
        setFullName(data.applicaiton?.full_name || '');
    }, [appDispatch, id]);
  
    const handleCardClick = (sectionId: number | undefined) => {
        if (!sectionId) return;
        navigate(`${ROUTES.SECTIONS}/${sectionId}`);
    };

    const handleArrowClick = (sectionId: number | undefined) => {
        if (!id || !sectionId) return;
        appDispatch(increasePriority({ applicationId: id, sectionId: String(sectionId) }));
    };

    const handleMinusClick = (sectionId: number | undefined) => {
        if (!id || !sectionId) return;
        appDispatch(removeSection({ applicationId: id, sectionId: String(sectionId) }));
    };

    const handleFieldSubmit = () => {
        if (!id) return;

        var updatedApplication = { ...data.applicaiton } as SportApplication;
        if (!updatedApplication) return;
        updatedApplication.full_name = fullName;
        appDispatch(changeFullName({ applicationId: id, updatedApplication: updatedApplication }));
    };

    const handleDeleteButtonClick = () => {
        if (!id) return;

        appDispatch(deleteApplication(id));

        navigate(ROUTES.APPLICATIONS);
    };

    const handleSubmitButtonClick = () => {
        if (!id) return;

        appDispatch(submitApplication(id));

        navigate(ROUTES.APPLICATIONS);
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
                {!loading && !error ? (
                    <>
                        <InputField
                            value={fullName || ""}
                            setValue={(value) => setFullName(value)}
                            placeholder="Введите ФИО"
                            onSubmit={handleFieldSubmit}
                        />

                        {data.sections.length ? (
                            <Row className="g-4">
                                {data.sections.map((item, index) => (
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