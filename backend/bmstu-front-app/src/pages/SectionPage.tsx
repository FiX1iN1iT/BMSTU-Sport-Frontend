import "./SectionPage.css";
import { FC, useEffect } from "react";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { useParams } from "react-router-dom";
import { Spinner, Image } from "react-bootstrap";
import defaultImage from "../assets/default_image.png";
import { DateDisplay } from '../helpers/DateDisplay';
import { NavigationBar } from "../components/NavBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch, RootState } from '../redux/store';
import { fetchSection } from "../redux/sectionSlice";

const SectionPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const { data } = useSelector((state: RootState) => state.section);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        appDispatch(fetchSection(id));
    }, [appDispatch, id]);

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

            {data ? (
                <div className="section">
                    <BreadCrumbs
                        crumbs={[
                        { label: ROUTE_LABELS.SECTIONS, path: ROUTES.SECTIONS },
                        { label: data.title || "Секция" },
                        ]}
                    />

                    <Image
                        className="image"
                        src={data.imageUrl || defaultImage}
                        alt="Image"
                    />

                    <div className="title">{data.title}</div>
                    <div className="content-header">О курсе</div>
                    <div className="content">
                        <div className="content-name">Место:&nbsp;</div>
                        <div className="content-value">{data.location}</div>
                    </div>
                    <div className="content">
                        <div className="content-name">Дата и время:&nbsp;</div>
                        <div className="content-value"><DateDisplay dateString={data.date || ''}/></div>
                    </div>
                    <div className="content">
                        <div className="content-name">Преподаватель:&nbsp;</div>
                        <div className="content-value">{data.instructor}</div>
                    </div>
                    <div className="content">
                        <div className="content-name">Длительность занятия:&nbsp;</div>
                        <div className="content-value">{data.duration}&nbsp;минут</div>
                    </div>
                    <div className="content">
                        <div className="content-name">Описание:&nbsp;</div>
                        <div className="content-value">{data.description}</div>
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

export default SectionPage;
