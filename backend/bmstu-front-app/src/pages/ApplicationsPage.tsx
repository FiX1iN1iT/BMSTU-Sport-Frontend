import "./ApplicationsPage.css";
import { FC, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { logoutUser } from "../redux/authSlice";
import { useAppDispatch } from '../redux/store';
import { NavigationBar } from "../components/NavBar";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { api } from '../api';
import { SportApplication } from '../api/Api';
import { DateDisplay } from '../helpers/DateDisplay';
import { Container, Row, Spinner, Col } from "react-bootstrap";

const ApplicationsPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);

    const [applications, setApplications] = useState<SportApplication[]>([]);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    const authDispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        api.applications.applicationsList({
            start_apply_date: startDate,
            end_apply_date: endDate,
            status: status
        })
            .then((response) => {
                const data = response.data;

                if (data && Array.isArray(data)) {
                    const applicationsData = data as SportApplication[];
                    setApplications(applicationsData);
                } else {
                    setApplications([]);
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setApplications([]);
                setLoading(false);
            })
    }, [startDate, endDate, status]);

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            navigate(`${ROUTES.APPLICATIONS}/${id}`);
        } else {
            console.log("Ошибка перехода на страницу заявки по id")
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

    const handleFilterChange = () => {
        setStartDate((document.getElementById('start-date') as HTMLInputElement).value);
        setEndDate((document.getElementById('end-date') as HTMLInputElement).value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value);
    };

    const statusDictionary: Record<string, string> = {
        created: 'Сформирована',
        completed: 'Завершена',
        rejected: 'Отклонена'
    };

    return(
        <div>
            <NavigationBar
                isAuthenticated={isAuthenticated}
                username={user.username}
                handleLogout={handleLogout}
            />

            <div className="cccontainer">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.APPLICATIONS }]} />
            </div>

            <div className="top-container">
                <div className="title">Заявки</div>
            </div>

            {/* <div className="filter-container">
                <label>
                    Начальная дата:
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Конечная дата:
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Статус:
                    <select value={status} onChange={handleStatusChange}>
                        <option value="">Все</option>
                        <option value="created">Сформированные</option>
                        <option value="completed">Завершенные</option>
                        <option value="rejected">Отклоненные</option>
                    </select>
                </label>
            </div> */}

            {loading && (
                <div className="loadingBg">
                    <Spinner animation="border" />
                </div>
            )}
            {!loading && 
                (!applications.length ? (
                    <div>
                        <h1>Заявок нет</h1>
                    </div>
                ) : (
                    <div className="table-container">
                        <Container fluid>
                            <Row>
                                <Col>#</Col>
                                <Col>Статус</Col>
                                <Col>Дата создания</Col>
                                <Col>Дата формирования</Col>
                                <Col>Дата завершения</Col>
                                <Col>ФИО</Col>
                                <Col>Кол-во ауд.</Col>
                            </Row>

                            {applications.map((item, _) => (
                                <Row key={item.pk} onClick={() => handleRowClick(item.pk)} className="my-2 custom-row align-items-center">
                                    <Col>{item.pk}</Col>
                                    <Col>{statusDictionary[item.status || 'created']}</Col>
                                    <Col><DateDisplay dateString={item.creation_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.apply_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.end_date || ''}/></Col>
                                    <Col>{item.full_name || '--'}</Col>
                                    <Col>{item.number_of_sections || '--'}</Col>
                                </Row>
                            ))}
                        </Container>
                    </div>
                )
                )
            }
        </div>
    );
};

export default ApplicationsPage;
