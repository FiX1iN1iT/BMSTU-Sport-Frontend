import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found">
            <h1>404 – страница не найдена</h1>
            <p>К сожалению, запрашиваемая страница не существует</p>
            <Link to="/">Вернуться на главную страницу</Link>
        </div>
    )
};

export default NotFoundPage;
