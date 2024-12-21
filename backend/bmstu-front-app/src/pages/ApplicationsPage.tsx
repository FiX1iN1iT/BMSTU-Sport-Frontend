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

    const [filteredApplications, setFilteredApplications] = useState<SportApplication[]>([]);
    const [creator, setCreator] = useState<string>('');
    const [creatorList, setCreatorList] = useState<string[]>([]);

    const authDispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchApplications = () => {
        api.applications.applicationsList({ start_apply_date: startDate, end_apply_date: endDate, status: status })
            .then((response) => {
                const data = response.data;

                if (data && Array.isArray(data)) {
                    const applicationsData = data as SportApplication[];

                    const creators = applicationsData.map(app => app.creator);
                    const uniqueCreators = new Set(creators);
                    setCreatorList(Array.from(uniqueCreators));

                    setApplications(applicationsData);
                    setFilteredApplications(applicationsData);
                } else {
                    setCreatorList([]);
                    setApplications([]);
                    setFilteredApplications([]);
                }
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setCreatorList([]);
                setApplications([]);
                setFilteredApplications([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!isAuthenticated) navigate(ROUTES.FORBIDDEN);

        setLoading(true);
        fetchApplications();
    }, [])

    useEffect(() => {
        if (!isAuthenticated) navigate(ROUTES.FORBIDDEN);

        fetchApplications();

        const interval = setInterval(() => {
            fetchApplications();
        }, 2000);
    
        return () => clearInterval(interval);
    }, [startDate, endDate, status])

    useEffect(() => {
        if (creator == "") {
            setFilteredApplications(applications);
        } else {
            const filtered = applications.filter((applications) => {
                if (applications.creator) {
                    return applications.creator == creator
                } else {
                    return false
                }
            });

            setFilteredApplications(filtered)
        }
    }, [creator])

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

    const handleApplicationStatusChange = (chosenStatus: string, applicationId: number) => {
        const applicationIdString = String(applicationId);

        api.applications.applicationsApproveRejectUpdate(applicationIdString, { status: chosenStatus })
            .catch(() => {
                alert('Заявка может быть завершена или отклонена только из статуса "Сформирована"');
            })
    }

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

    const handleCreatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCreator(event.target.value);
    };

    return(
        <div>
            <NavigationBar
                isAuthenticated={isAuthenticated}
                username={user.username}
                is_staff={user.is_staff}
                handleLogout={handleLogout}
            />

            <div className="cccontainer">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.APPLICATIONS }]} />
            </div>

            <div className="top-container">
                <div className="title">Заявки</div>
            </div>

            {user.is_staff ? (
                <div className="filter-container">
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
                    <label>
                        Создатель:
                        <select value={status} onChange={handleCreatorChange}>
                            <option value="">Все</option>
                            {creatorList.map((item, _) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                </div>
            ) : (
                <></>
            )}

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
                                <Col>Создатель</Col>
                                <Col>Кол-во ауд.</Col>
                            </Row>

                            {filteredApplications.map((item, _) => (
                                <Row key={item.pk} className="my-2 custom-row align-items-center">
                                    <Col onClick={() => handleRowClick(item.pk)} style={{ cursor: "pointer", textDecoration: 'underline', color: 'blue' }}>{item.pk}</Col>

                                    {user.is_staff ? (
                                        <Col>
                                            <select value={item.status} onChange={(e) => handleApplicationStatusChange(e.target.value, item.pk)}>
                                                <option value="created">Сформирована</option>
                                                <option value="completed">Завершена</option>
                                                <option value="rejected">Отклонена</option>
                                            </select>
                                        </Col>
                                    ) : (
                                        <Col>{statusDictionary[item.status || 'created']}</Col>
                                    )}

                                    <Col><DateDisplay dateString={item.creation_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.apply_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.end_date || ''}/></Col>
                                    <Col>{item.creator}</Col>
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
