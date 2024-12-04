import "./SectionPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useParams } from "react-router-dom";
// import { Section, getSection } from "../modules/bmstuSportApi";
import { Spinner, Image } from "react-bootstrap";
import defaultImage from "../assets/default_image.png";
import { SECTION_MOCK } from "../modules/mocks";
import { DateDisplay } from '../helpers/DateDisplay';
import { NavigationBar } from "../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { api } from '../api';
import { Section } from '../api/Api';

export const AlbumPage: FC = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const [pageData, setPageDdata] = useState<Section>();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    api.sections.sectionsRead(id)
        .then((response) => {
            const data = response.data;

            setPageDdata(data)
        })
        .catch(() => {
            setPageDdata(SECTION_MOCK);
        });
  }, [id]);

  const onLogout = () => {
    dispatch(logout());
    navigate(ROUTES.HOME);
  }

  return (
    <div>
      <NavigationBar
        isAuthenticated={isAuthenticated}
        username={user.username}
        handleLogout={onLogout}
      />

      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="section">
            <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SECTIONS, path: ROUTES.SECTIONS },
          { label: pageData?.title || "Секция" },
        ]}
      />
          <Image
            className="image"
            src={pageData.imageUrl || defaultImage}
            alt="Image"
          />
          <div className="title">{pageData.title}</div>
          <div className="content-header">О курсе</div>
          <div className="content">
            <div className="content-name">Место:&nbsp;</div>
            <div className="content-value">{pageData.location}</div>
          </div>
          <div className="content">
            <div className="content-name">Дата и время:&nbsp;</div>
            <div className="content-value"><DateDisplay dateString={pageData.date || ''}/></div>
          </div>
          <div className="content">
            <div className="content-name">Преподаватель:&nbsp;</div>
            <div className="content-value">{pageData.instructor}</div>
          </div>
          <div className="content">
            <div className="content-name">Длительность занятия:&nbsp;</div>
            <div className="content-value">{pageData.duration}&nbsp;минут</div>
          </div>
          <div className="content">
            <div className="content-name">Описание:&nbsp;</div>
            <div className="content-value">{pageData.description}</div>
          </div>
        </div>
      ) : (
        <div className="album_page_loader_block">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};