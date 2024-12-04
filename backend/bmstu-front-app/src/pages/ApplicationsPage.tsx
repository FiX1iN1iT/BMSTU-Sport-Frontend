import "./ApplicationsPage.css";
import { FC, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { logout } from "../redux/authSlice";
import { NavigationBar } from "../components/NavBar";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { api } from '../api';
import { SportApplication } from '../api/Api';
import Table from 'react-bootstrap/Table';
import { DateDisplay } from '../helpers/DateDisplay';

const ApplicationsPage: FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const [applications, setApplications] = useState<SportApplication[]>([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        api.applications.applicationsList()
            .then((response) => {
                const data = response.data;

                if (data && Array.isArray(data.applications)) {
                    const applicationsData = data.applications as SportApplication[];
                    setApplications(applicationsData);
                } else {
                    setApplications([]);
                }
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                setApplications([]);
            })
    }, [])

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            navigate(`${ROUTES.APPLICATIONS}/${id}`);
        } else {
            console.log("Ошибка перехода на страницу заявки по id")
        }
    }

    const onLogout = () => {
        dispatch(logout());
        navigate(ROUTES.HOME);
    }

    return(
        <div>
            <NavigationBar
                isAuthenticated={isAuthenticated}
                username={user.username}
                handleLogout={onLogout}
            />

            <div className="cccontainer">
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.APPLICATIONS }]} />
            </div>

            <div className="top-container">
                <div className="title">Заявки</div>
            </div>

            { !applications.length ? (
                <div>
                    <h1>Заявок нет</h1>
                </div>
            ) : (
                <div className="table-container">
                    <Table responsive bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Статус</th>
                                <th>Дата создания</th>
                                <th>Дата формирования</th>
                                <th>Дата завершения</th>
                                <th>ФИО</th>
                                <th>Кол-во секций</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((item, _) => (
                                <tr key={item.pk} onClick={() => handleRowClick(item.pk)}>
                                    <td>{item.pk}</td>
                                    <td>{item.status}</td>
                                    <td><DateDisplay dateString={item.creation_date || ''}/></td>
                                    <td><DateDisplay dateString={item.apply_date || ''}/></td>
                                    <td><DateDisplay dateString={item.end_date || ''}/></td>
                                    <td>{item.full_name || '--'}</td>
                                    <td>{item.number_of_sections || '--'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default ApplicationsPage;
