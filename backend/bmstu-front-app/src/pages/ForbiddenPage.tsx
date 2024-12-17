import "./ForbiddenPage.css";
import React from "react";
import { Link } from "react-router-dom";

const ForbiddenPage: React.FC = () => {
    return (
        <div className="not-found">
            <h1>403 – Нет доступа</h1>
            <p>К сожалению, у вас нет доступа к запрашиваемо странице</p>
            <Link to="/">Вернуться на главную страницу</Link>
        </div>
    )
};

export default ForbiddenPage;
