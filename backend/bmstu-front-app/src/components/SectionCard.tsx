import React, { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import './SectionCard.css';
import { DateDisplay } from '../helpers/DateDisplay';
import defaultImage from "../assets/default_image.png";

interface SectionCardProps {
    sectionId: number;
    imageUrl: string;
    title: string;
    location: string;
    date: string;
    plusButtonClickHandler: (sectionId: number) => void;
    imageClickHandler: () => void;
}

export const SectionCard: FC<SectionCardProps> = ({
    sectionId,
    imageUrl,
    title,
    location,
    date,
    plusButtonClickHandler,
    imageClickHandler
}) => {
    const addSection = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        plusButtonClickHandler(sectionId);
    };

    return (
        <Card className="card">
            <Button className="card-button" onClick={addSection}>
                +
            </Button>
            <Card.Img
                className="card-image"
                variant="top"
                src={imageUrl || defaultImage}
                alt="Картинка"
                onClick={imageClickHandler}
            />
            <Card.Body>
                <Card.Title>
                    <div className="card-title">{title}</div>
                </Card.Title>
                <div className="card-location">{location}</div>
                <div className="card-date">
                    <DateDisplay dateString={date}/>
                </div>
            </Card.Body>
        </Card>
    );
};
