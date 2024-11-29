// import { FC } from "react";
// import { Button, Card } from "react-bootstrap";
// import "./SectionCard.css";

// interface ICardProps {
//   artworkUrl100: string;
//   artistName: string;
//   collectionCensoredName: string;
//   trackViewUrl: string;
//   imageClickHandler: () => void;
// }

// export const MusicCard: FC<ICardProps> = ({
//   artworkUrl100,
//   artistName,
//   collectionCensoredName,
//   trackViewUrl,
//   imageClickHandler,
// }) => {

//   return (
//     <Card className="card">
//       <Card.Img
//         className="cardImage"
//         variant="top"
//         src={artworkUrl100}
//         height={100}
//         width={100}
//         onClick={imageClickHandler}
//       />
//       <Card.Body>
//         <div className="textStyle">
//           <Card.Title>{collectionCensoredName}</Card.Title>
//         </div>
//         <div className="textStyle">
//           <Card.Text>{artistName}</Card.Text>
//         </div>
//         <Button
//           className="cardButton"
//           href={trackViewUrl}
//           target="_blank"
//           variant="primary"
//         >
//           Открыть в ITunes
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };

import React, { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import './SectionCard.css';
import { DateDisplay } from '../helpers/DateDisplay';

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
                src={imageUrl}
                alt="Картинка"
                onClick={imageClickHandler}
            />
            <Card.Body>
                <Card.Title>
                    <div className="card-title">{title}</div>
                    {/* <a href={`/section/${sectionId}`}>{title}</a> */}
                </Card.Title>
                <div className="card-location">{location}</div>
                <div className="card-date">
                    <DateDisplay dateString={date}/>
                </div>
            </Card.Body>
        </Card>
    );
};
