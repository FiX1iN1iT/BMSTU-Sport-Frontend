import "./ApplicationsPage.css";
import { FC, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { logoutUser } from "../redux/authSlice";
import { NavigationBar } from "../components/NavBar";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { SportApplication } from '../api/Api';
import { DateDisplay } from '../helpers/DateDisplay';
import { Container, Row, Spinner, Col } from "react-bootstrap";
import { useAppDispatch, RootState } from '../redux/store';
import { fetchApplications, changeStatus } from "../redux/applicationsSlice";
import { FaCheck, FaTimes } from 'react-icons/fa';

const ApplicationsPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const { data, loading } = useSelector((state: RootState) => state.applications);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    const [filteredApplications, setFilteredApplications] = useState<SportApplication[]>([]);
    const [creator, setCreator] = useState<string>('');

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchData = () => {
        appDispatch(fetchApplications({ startDate: startDate, endDate: endDate, status: status }));
    };

    useEffect(() => {
        if (!isAuthenticated) navigate(ROUTES.FORBIDDEN);
        fetchData();
    }, [])

    useEffect(() => {
        if (!isAuthenticated) navigate(ROUTES.FORBIDDEN);

        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 2000);
    
        return () => clearInterval(interval);
    }, [startDate, endDate, status])

    useEffect(() => {
        if (creator == '') {
            setFilteredApplications(data.applications);
        } else {
            const filtered = data.applications.filter((applications) => {
                if (applications.creator) {
                    return applications.creator == creator
                } else {
                    return false
                }
            });

            setFilteredApplications(filtered)
        }
    }, [data, creator])

    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`${ROUTES.APPLICATIONS}/${id}`);
    };

    const handleLogout = async () => {
        try {
            await appDispatch(logoutUser()).unwrap();
        
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Ошибка деавторизации:', error);
        }
    };

    const handleApplicationStatusChange = (applicationId: number, status: string) => {
        appDispatch(changeStatus({ applicationId: String(applicationId), status: status }));
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
                        <select value={creator} onChange={handleCreatorChange}>
                            <option value="">Все</option>
                            {data.creators.map((item, _) => (
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
                (!data.applications.length ? (
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
                                <Col>ФИО</Col>
                                <Col>Кол-во ауд.</Col>
                                {user.is_staff && (
                                    <>
                                        <Col>Одобрить</Col>
                                        <Col>Отклонить</Col>
                                    </>
                                )}
                            </Row>

                            {filteredApplications.map((item, _) => (
                                <Row key={item.pk} className="my-2 custom-row align-items-center">
                                    <Col onClick={() => handleRowClick(item.pk)} style={{ cursor: "pointer", textDecoration: 'underline', color: 'blue' }}>{item.pk}</Col>
                                    <Col>{statusDictionary[item.status.toLowerCase() || 'created']}</Col>
                                    <Col><DateDisplay dateString={item.creation_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.apply_date || ''}/></Col>
                                    <Col><DateDisplay dateString={item.end_date || ''}/></Col>
                                    <Col>{item.creator}</Col>
                                    <Col>{item.full_name || '--'}</Col>
                                    <Col>{item.number_of_sections || '--'}</Col>

                                    {user.is_staff && (
                                        <>
                                        <Col>
                                            <FaCheck
                                                style={{
                                                    color: item.status.toLowerCase() === 'created' ? 'green' : 'gray',
                                                    cursor: item.status.toLowerCase() === 'created' ? 'pointer' : 'not-allowed',
                                                }}
                                                onClick={() => {
                                                    if (item.status.toLowerCase() === 'created') handleApplicationStatusChange(item.pk, 'completed');
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <FaTimes
                                                style={{
                                                    color: item.status.toLowerCase() === 'created' ? 'red' : 'gray',
                                                    cursor: item.status.toLowerCase() === 'created' ? 'pointer' : 'not-allowed',
                                                }}
                                                onClick={() => {
                                                    if (item.status.toLowerCase() === 'created') handleApplicationStatusChange(item.pk, 'rejected');
                                                }}
                                            />
                                        </Col>
                                        </>
                                    )}
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
