import { FC } from 'react';
import { Image, Button } from 'react-bootstrap';
import './ApplicationRow.css';
import { DateDisplay } from '../helpers/DateDisplay';
import defaultImage from "../assets/default_image.png";
import { FaTrash } from 'react-icons/fa';

interface ApplicationRowProps {
    imageUrl: string;
    title: string;
    location: string;
    date: string;
    position: number;
    imageClickHandler: () => void;
    handleArrowClick: () => void;
    handleMinusClick: () => void;
}

export const ApplicationRow: FC<ApplicationRowProps> = ({
    imageUrl,
    title,
    location,
    date,
    position,
    imageClickHandler,
    handleArrowClick,
    handleMinusClick
}) => {

    return (
        <div className="application-cell">
            <Image
                className="image"
                src={imageUrl || defaultImage}
                alt="Картинка"
                onClick={imageClickHandler}
            />
            <div className="content">
                <div className="card-title">{title}</div>
                <div className="card-location">{location}</div>
                <div className="card-date"><DateDisplay dateString={date}/></div>
            </div>
            <div className="position-container">
                {position > 1 ? (
                    <div className="arrow">
                        <Button variant="outline-dark" onClick={handleArrowClick} size="sm">
                            {'\u2191'}
                        </Button>
                    </div>
                ) : (
                    <div className="arrow"></div>
                )}

                <div className="position">{position}</div>

                <div className="minus">
                    <Button variant="outline-danger" onClick={handleMinusClick} size="sm">
                        <FaTrash/>
                    </Button>
                </div>
            </div>
        </div>
    );
};
