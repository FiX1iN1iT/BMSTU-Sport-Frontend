import "./ApplicationPage.css";
import { FC, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { ApplicationResult, getApplication, editApplication, deleteApplication, higherPriority, submitApplication, deletePriority } from "../modules/bmstuSportApi";
import InputField from "../components/InputField";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicationRow } from "../components/ApplicationRow";
import NavigationBar from "../components/NavBar";

const ApplicationPage: FC = () => {
    const [pageData, setPageDdata] = useState<ApplicationResult>();
    const [fullName, setFullName] = useState("");
  
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        getApplication(id)
          .then((response) => {
            setPageDdata(response);
            if (response.sections.length == 0) {
                navigate(ROUTES.SECTIONS)
            }
            setFullName(response.application.full_name || "");
          });
      }, [id]);
  
    const handleCardClick = (id: number) => {
      navigate(`${ROUTES.SECTIONS}/${id}`);
    };

    const handleArrowClick = (id: number) => {
        if (pageData) {
            higherPriority(pageData.application.pk, id)
            window.location.reload();
        }
    };

    const handleMinusClick = (id: number) => {
        if (pageData) {
            deletePriority(pageData.application.pk, id)
            window.location.reload();
        }
    };

    const handleFieldSubmit = () => {
        if (pageData) {
            editApplication(pageData.application.pk, fullName)
        }
    };

    const handleDeleteButtonClick = () => {
        if (pageData) {
            deleteApplication(pageData.application.pk)
            navigate(ROUTES.SECTIONS)
        }
    };

    const handleSubmitButtonClick = () => {
        if (pageData) {
            submitApplication(pageData.application.pk)
            navigate(ROUTES.SECTIONS)
        }
    };
  
    return (
        <div className="container">
            <NavigationBar/>
            <BreadCrumbs
                crumbs={[
                { label: ROUTE_LABELS.APPLICATIONS, path: ROUTES.APPLICATIONS },
                { label: `Заявка #${pageData?.application.pk}` || "Заявка-черновик" },
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

            {pageData ? (
            <Row className="g-4">
              {pageData.sections.map((item, index) => (
                <Col key={index} xs={12}>
                  <ApplicationRow
                      key={item.pk}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      location={item.location}
                      date={item.date}
                      position={index + 1}
                      imageClickHandler={() => handleCardClick(item.pk)}
                      handleArrowClick={() => handleArrowClick(item.pk)}
                      handleMinusClick={() => handleMinusClick(item.pk)}
                  />
                </Col>
              ))}
            </Row>
            ) : (
                <div>empty</div>
            )}
        </div>
    );
};
  
export default ApplicationPage;