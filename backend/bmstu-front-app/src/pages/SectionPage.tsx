import "./SectionPage.css";
import { FC, useEffect, useState } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useParams } from "react-router-dom";
import { Section, getSection } from "../modules/bmstuSportApi";
import { Spinner, Image } from "react-bootstrap";
import defaultImage from "../assets/default_image.png";
import { SECTION_MOCK } from "../modules/mocks";
import { DateDisplay } from '../helpers/DateDisplay';
import NavigationBar from "../components/NavBar";

export const AlbumPage: FC = () => {
  const [pageData, setPageDdata] = useState<Section>();

  const { id } = useParams(); // ид страницы, пример: "/albums/12"

  useEffect(() => {
    if (!id) return;
    getSection(id)
        .then((response) => setPageDdata(response))
        .catch(() => {
            setPageDdata(SECTION_MOCK);
        });
  }, [id]);

  return (
    <div>
      <NavigationBar/>
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.SECTIONS, path: ROUTES.SECTIONS },
          { label: pageData?.title || "Секция" },
        ]}
      />
      {pageData ? ( // проверка на наличие данных, иначе загрузка
        <div className="section">
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
            <div className="content-value"><DateDisplay dateString={pageData.date}/></div>
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